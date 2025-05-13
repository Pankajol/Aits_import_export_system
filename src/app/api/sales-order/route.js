import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import SalesOrder from "@/models/SalesOrder"; // Your Sales Order model
import Inventory from "@/models/Inventory";   // Inventory model (includes batches)
import StockMovement from "@/models/StockMovement"; // Model for logging stock movements

const { Types } = mongoose;

export async function POST(req) {
  await dbConnect();
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const orderData = await req.json();
    console.log("Received Sales Order Data:", orderData);

    // ----- Data Cleaning -----
    delete orderData._id;
    if (Array.isArray(orderData.items)) {
      orderData.items = orderData.items.map((item) => {
        delete item._id;
        return item;
      });
    }

    // ----- Create Sales Order Document -----
    // Create using an array so we can use the returned document from create()
    const [order] = await SalesOrder.create([orderData], { session });
    console.log("Sales Order created with _id:", order._id);

    // ----- Process Each Order Item: Update Inventory (Only Committed) & Log Stock Movement -----
    async function processItem(item) {
      // Find the inventory record for this item in the specified warehouse.
      const inventoryDoc = await Inventory.findOne({
        item: new Types.ObjectId(item.item),
        warehouse: new Types.ObjectId(item.warehouse),
      }).session(session);

      if (!inventoryDoc) {
        throw new Error(
          `No inventory record found for item ${item.item} in warehouse ${item.warehouse}`
        );
      }

      // For Sales Orders, we "reserve" the stock by increasing the committed field.
      // For batch-managed items, verify each allocated batch has enough available stock
      // but do not deduct the physical quantity.
      if (item.batches && item.batches.length > 0) {
        for (const allocated of item.batches) {
          const batchIndex = inventoryDoc.batches.findIndex(
            (b) => b.batchNumber === allocated.batchCode
          );
          if (batchIndex === -1) {
            throw new Error(
              `Batch ${allocated.batchCode} not found in inventory for item ${item.item}`
            );
          }
          // Verify that the batch has enough available stock to commit.
          if (inventoryDoc.batches[batchIndex].quantity < allocated.allocatedQuantity) {
            throw new Error(
              `Insufficient stock in batch ${allocated.batchCode} for item ${item.item}`
            );
          }
          // Note: We are not reducing the batch quantity here.
        }
      } else {
        // For non-batch-managed items, ensure available inventory is sufficient.
        if (inventoryDoc.quantity < item.quantity) {
          throw new Error(
            `Insufficient stock for item ${item.item} in warehouse ${item.warehouse}`
          );
        }
        // Do not reduce inventoryDoc.quantity since we are only reserving (committing).
      }

      // Increase the committed field by the ordered quantity.
      inventoryDoc.committed = (inventoryDoc.committed || 0) + item.quantity;

      // Save the updated inventory document.
      await inventoryDoc.save({ session });

      // Log the stock movement as a "RESERVE" (or similar) action.
      await StockMovement.create(
        [
          {
            item: item.item,
            warehouse: item.warehouse,
            movementType: "RESERVE", // Indicates that stock is reserved, not reduced.
            quantity: item.quantity,
            reference: order._id,
            remarks: "Sales Order - committed increased (reservation)",
          },
        ],
        { session }
      );
    }

    // Process each item in the sales order.
    for (const item of orderData.items) {
      await processItem(item);
    }

    await session.commitTransaction();
    session.endSession();

    return new Response(
      JSON.stringify({
        message: "Sales Order processed and committed stock updated",
        orderId: order._id,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error processing Sales Order:", error.stack || error);
    return new Response(
      JSON.stringify({
        message: "Error processing Sales Order",
        error: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}






export async function GET(req) {
  try {
    await dbConnect();
    const SalesOrders = await SalesOrder.find({});
    return new Response(JSON.stringify(SalesOrders), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching SalesOrders:", error);
    return new Response(
      JSON.stringify({ message: "Error fetching SalesOrders", error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
