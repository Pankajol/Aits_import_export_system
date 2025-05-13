import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import GRN from "@/models/grnModels";
import PurchaseOrder from "@/models/PurchaseOrder";
import Inventory from "@/models/Inventory";
import StockMovement from "@/models/StockMovement";

const { Types } = mongoose;

export async function POST(req) {
  await dbConnect();
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const grnData = await req.json();
    console.log("Received GRN Data:", grnData);

    // ----- Data Cleaning -----
    if ("_id" in grnData) delete grnData._id;
    let purchaseOrderId = null;
    if (grnData.purchaseOrderId) {
      purchaseOrderId = grnData.purchaseOrderId;
      delete grnData.purchaseOrderId;
    }
    if (Array.isArray(grnData.items)) {
      grnData.items = grnData.items.map((item) => {
        if ("_id" in item) delete item._id;
        return item;
      });
    }

    // ----- Validation: Quantities & Required Fields -----
    for (const [i, item] of grnData.items.entries()) {
      const allowedQty = Number(item.allowedQuantity) || 0;
      if (allowedQty > 0 && Number(item.quantity) > allowedQty) {
        throw new Error(
          `For item ${item.itemCode}, GRN quantity (${item.quantity}) exceeds allowed quantity (${allowedQty}).`
        );
      }
      if (!item.item) {
        throw new Error(
          `Missing item ObjectId for row ${i + 1} with code: ${item.itemCode}`
        );
      }
      if (!item.warehouse) {
        throw new Error(
          `Missing warehouse ObjectId for row ${i + 1} with code: ${item.itemCode}`
        );
      }
      if (!Types.ObjectId.isValid(item.warehouse)) {
        throw new Error(
          `Invalid warehouse ObjectId for row ${i + 1}: ${item.warehouse}`
        );
      }
    }

    // ----- Validation: Batch-managed Items -----
    for (const [i, item] of grnData.items.entries()) {
      if (item.managedBy && item.managedBy.toLowerCase() === "batch") {
        const totalBatchQty = (item.batches || []).reduce(
          (sum, batch) => sum + Number(batch.batchQuantity || 0),
          0
        );
        if (totalBatchQty !== Number(item.quantity)) {
          throw new Error(
            `Batch quantity mismatch for item row ${i + 1} (${item.itemCode}): total batch quantity (${totalBatchQty}) does not equal item quantity (${item.quantity}).`
          );
        }
      }
    }

    // ----- Create GRN Document -----
    const [grn] = await GRN.create([grnData], { session });
    console.log("GRN created with _id:", grn._id);

    // ----- Update Inventory & Log Stock Movements -----
    // For each item, update the Inventory document.
    for (const item of grnData.items) {
      const itemQty = Number(item.quantity);
      // If the item is managed by batch, update batch details.
      if (
        item.managedBy &&
        item.managedBy.toLowerCase() === "batch" &&
        Array.isArray(item.batches) &&
        item.batches.length > 0
      ) {
        for (const batch of item.batches) {
          if (!batch.batchNumber || batch.batchNumber.trim() === "") {
            throw new Error(`Batch number is required for item ${item.itemCode}.`);
          }
          const batchQty = Number(batch.batchQuantity);
          let inventoryDoc = await Inventory.findOne({
            item: item.item,
            warehouse: item.warehouse,
          }).session(session);
          if (!inventoryDoc) {
            // Create a new inventory document with an overall quantity equal to the batch quantity.
            inventoryDoc = await Inventory.create(
              [
                {
                  item: item.item,
                  warehouse: item.warehouse,
                  quantity: batchQty, // overall quantity (you can choose to sum batches later)
                  onOrder: 0,
                  batches: [
                    {
                      batchNumber: batch.batchNumber,
                      expiryDate: batch.expiryDate,
                      manufacturer: batch.manufacturer,
                      quantity: batchQty,
                      unitPrice: Number(item.unitPrice),
                    },
                  ],
                },
              ],
              { session }
            );
          } else {
            // Update batch details.
            const existingBatch = inventoryDoc.batches.find(
              (b) => b.batchNumber === batch.batchNumber
            );
            if (existingBatch) {
              existingBatch.quantity = Number(existingBatch.quantity) + batchQty;
            } else {
              inventoryDoc.batches.push({
                batchNumber: batch.batchNumber,
                expiryDate: batch.expiryDate,
                manufacturer: batch.manufacturer,
                quantity: batchQty,
                unitPrice: Number(item.unitPrice),
              });
            }
            // Also update the overall quantity.
            inventoryDoc.quantity = (inventoryDoc.quantity || 0) + batchQty;
            await inventoryDoc.save({ session });
          }
          // Log stock movement for the batch.
          await StockMovement.create(
            [
              {
                item: item.item,
                warehouse: item.warehouse,
                movementType: "IN",
                quantity: batchQty,
                reference: grn._id,
                remarks: `Stock updated via GRN for batch ${batch.batchNumber}`,
              },
            ],
            { session }
          );
        }
        // For batch-managed items, adjust the onOrder field.
        let inventoryDoc = await Inventory.findOne({
          item: item.item,
          warehouse: item.warehouse,
        }).session(session);
        if (inventoryDoc) {
          inventoryDoc.onOrder = Math.max((inventoryDoc.onOrder || 0) - itemQty, 0);
          await inventoryDoc.save({ session });
        }
      } else {
        // For non-batch-managed items, update the overall quantity.
        await Inventory.updateOne(
          { item: item.item, warehouse: item.warehouse },
          { $inc: { quantity: itemQty, onOrder: -itemQty } },
          { upsert: true, session }
        );
        await StockMovement.create(
          [
            {
              item: item.item,
              warehouse: item.warehouse,
              movementType: "IN",
              quantity: itemQty,
              reference: grn._id,
              remarks: "Stock updated via GRN",
            },
          ],
          { session }
        );
      }
    }

    // ----- Update Linked Purchase Order (PO) -----
    // if (purchaseOrderId) {
    //   const po = await PurchaseOrder.findById(purchaseOrderId).session(session);
    //   if (!po) {
    //     throw new Error(
    //       `Purchase Order with id ${purchaseOrderId} not found. Aborting GRN save.`
    //     );
    //   }
    //   let allItemsReceived = false;
    //   for (const poItem of po.items) {
    //     poItem.receivedQuantity = poItem.receivedQuantity || 0;
    //     const grnItem = grnData.items.find(
    //       (i) => i.item.toString() === poItem.item.toString()
    //     );
    //     if (grnItem) {
    //       poItem.receivedQuantity += Number(grnItem.quantity) || 0;
    //     }
    //     const originalQty = Number(poItem.orderedQuantity) || 0;
    //     const remaining = Math.max(originalQty - poItem.receivedQuantity);
    //     poItem.quantity = remaining; // pending quantity
    //     console.log(
    //       `PO item ${poItem.item.toString()} - ordered: ${originalQty}, received: ${poItem.receivedQuantity}, remaining: ${remaining}`
    //     );
    //     if (remaining > 0) {
    //       allItemsReceived = true;
    //     }
    //   }
    //   po.orderStatus = allItemsReceived ? "Close" : "Open";
    //   po.stockStatus = allItemsReceived ? "Updated" : "Adjusted";
    //   console.log(`Final PO status: orderStatus=${po.orderStatus}, stockStatus=${po.stockStatus}`);
    //   await po.save({ session });
    // }
    if (purchaseOrderId) {
      const po = await PurchaseOrder.findById(purchaseOrderId).session(session);
      if (!po) {
        throw new Error(
          `Purchase Order with id ${purchaseOrderId} not found. Aborting GRN save.`
        );
      }
      
      let allItemsReceived = true;
      
      for (const poItem of po.items) {
        // Initialize receivedQuantity if not already set.
        poItem.receivedQuantity = poItem.receivedQuantity || 0;
        
        // Find the corresponding GRN item for this PO item.
        const grnItem = grnData.items.find(
          (i) => i.item.toString() === poItem.item.toString()
        );
        
        // If a matching GRN item exists, add its quantity.
        if (grnItem) {
          poItem.receivedQuantity += Number(grnItem.quantity) || 0;
        }
        
        // Determine the original (expected) quantity:
        // Use the PO's orderedQuantity if it's greater than zero,
        // otherwise fall back to the GRN item's allowedQuantity.
        const originalQty =
          Number(poItem.orderedQuantity) > 0
            ? Number(poItem.orderedQuantity)
            : (grnItem && Number(grnItem.allowedQuantity) > 0
                 ? Number(grnItem.allowedQuantity)
                 : 0);
        
        // Calculate remaining pending quantity.
        const remaining = Math.max(originalQty - poItem.receivedQuantity, 0);
        // Optionally, store the remaining quantity in a dedicated field.
        poItem.pendingQuantity = remaining;
        poItem.quantity = remaining;
        
        console.log(
          `PO item ${poItem.item.toString()} - ordered: ${originalQty}, received: ${poItem.receivedQuantity}, remaining: ${remaining}`
        );
        
        // If any item has remaining quantity, then the PO is not fully received.
        if (remaining > 0) {
          allItemsReceived = false;
        }
      }
      
      // Set PO status based on whether all items are fully received.
      po.orderStatus = allItemsReceived ? "Close" : "Open";
      po.stockStatus = allItemsReceived ? "Updated" : "Adjusted";
      console.log(`Final PO status: orderStatus=${po.orderStatus}, stockStatus=${po.stockStatus}`);
      await po.save({ session });
    }
    
    

    await session.commitTransaction();
    session.endSession();
    return new Response(
      JSON.stringify({ message: "GRN processed and inventory updated", grnId: grn._id }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error processing GRN:", error.stack || error);
    return new Response(
      JSON.stringify({ message: "Error processing GRN", error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}








// import mongoose from "mongoose";
// import dbConnect from "@/lib/db";
// import GRN from "@/models/grnModels";
// import PurchaseOrder from "@/models/PurchaseOrder";
// import Inventory from "@/models/Inventory";
// import StockMovement from "@/models/StockMovement";

// const { Types } = mongoose;

// export async function POST(req) {
//   await dbConnect();
//   const session = await mongoose.startSession();
//   session.startTransaction();
//   try {
//     const grnData = await req.json();
//     console.log("Received GRN Data:", grnData);

//     // ----- Data Cleaning -----
//     // Remove _id from GRN data unconditionally.
//     if ("_id" in grnData) {
//       delete grnData._id;
//     }

//     // If this GRN was copied from a PO, store the PO _id and then remove it.
//     let purchaseOrderId = null;
//     if (grnData.purchaseOrderId) {
//       purchaseOrderId = grnData.purchaseOrderId;
//       delete grnData.purchaseOrderId;
//     }

//     // Remove _id from each GRN item unconditionally.
//     if (Array.isArray(grnData.items)) {
//       grnData.items = grnData.items.map((item) => {
//         if ("_id" in item) {
//           delete item._id;
//         }
//         return item;
//       });
//     }

//     // ----- Validation: Quantities & Required Fields -----
//     for (const [i, item] of grnData.items.entries()) {
//       const allowedQty = Number(item.allowedQuantity) || 0;
//       if (allowedQty > 0 && Number(item.quantity) > allowedQty) {
//         throw new Error(
//           `For item ${item.itemCode}, GRN quantity (${item.quantity}) exceeds allowed quantity (${allowedQty}).`
//         );
//       }
//       if (!item.item) {
//         throw new Error(
//           `Missing item ObjectId for row ${i + 1} with code: ${item.itemCode}`
//         );
//       }
//       if (!item.warehouse) {
//         throw new Error(
//           `Missing warehouse ObjectId for row ${i + 1} with code: ${item.itemCode}`
//         );
//       }
//       if (!Types.ObjectId.isValid(item.warehouse)) {
//         throw new Error(
//           `Invalid warehouse ObjectId for row ${i + 1}: ${item.warehouse}`
//         );
//       }
//     }

//     // ----- Validation: Batch-managed Items -----
//     for (const [i, item] of grnData.items.entries()) {
//       if (item.managedBy && item.managedBy.toLowerCase() === "batch") {
//         const totalBatchQty = (item.batches || []).reduce(
//           (sum, batch) => sum + (Number(batch.batchQuantity) || 0),
//           0
//         );
//         if (totalBatchQty !== Number(item.quantity)) {
//           throw new Error(
//             `Batch quantity mismatch for item row ${i + 1} (${item.itemCode}): total batch quantity (${totalBatchQty}) does not equal item quantity (${item.quantity}).`
//           );
//         }
//       }
//     }

//     // ----- Create GRN Document -----
//     const [grn] = await GRN.create([grnData], { session });
//     console.log("GRN created with _id:", grn._id);

//     // ----- Update Inventory & Log Stock Movements -----
//     for (const item of grnData.items) {
//       if (!item.stockAdded) {
//         if (item.batches && item.batches.length > 0) {
//           // Batch-managed items.
//           for (const batch of item.batches) {
//             let inventoryDoc = await Inventory.findOne({
//               item: item.item,
//               warehouse: item.warehouse,
//             }).session(session);
//             if (!inventoryDoc) {
//               inventoryDoc = await Inventory.create(
//                 [
//                   {
//                     item: item.item,
//                     warehouse: item.warehouse,
//                     onOrder: 0,
//                     batches: [
//                       {
//                         batchNumber: batch.batchNumber,
//                         expiryDate: batch.expiryDate,
//                         manufacturer: batch.manufacturer,
//                         quantity: batch.batchQuantity,
//                         unitPrice: item.unitPrice,
//                       },
//                     ],
//                   },
//                 ],
//                 { session }
//               );
//             } else {
//               const existingBatch = inventoryDoc.batches.find(
//                 (b) => b.batchNumber === batch.batchNumber
//               );
//               if (existingBatch) {
//                 existingBatch.quantity += batch.batchQuantity;
//               } else {
//                 inventoryDoc.batches.push({
//                   batchNumber: batch.batchNumber,
//                   expiryDate: batch.expiryDate,
//                   manufacturer: batch.manufacturer,
//                   quantity: batch.batchQuantity,
//                   unitPrice: item.unitPrice,
//                 });
//               }
//               await inventoryDoc.save({ session });
//             }
//             // Log stock movement for the batch.
//             await StockMovement.create(
//               [
//                 {
//                   item: item.item,
//                   warehouse: item.warehouse,
//                   movementType: "IN",
//                   quantity: batch.batchQuantity,
//                   reference: grn._id,
//                   remarks: `Stock updated via GRN for batch ${batch.batchNumber}`,
//                 },
//               ],
//               { session }
//             );
//           }
//           // For batch-managed items, reduce the onOrder value.
//           let inventoryDoc = await Inventory.findOne({
//             item: item.item,
//             warehouse: item.warehouse,
//           }).session(session);
//           if (inventoryDoc) {
//             inventoryDoc.onOrder = Math.max((inventoryDoc.onOrder || 0) - item.quantity, 0);
//             await inventoryDoc.save({ session });
//           }
//         } else {
//           // For non-batch-managed items.
//           await Inventory.updateOne(
//             { item: item.item, warehouse: item.warehouse },
//             { $inc: { quantity: Number(item.quantity), onOrder: -Number(item.quantity) } },
//             { upsert: true, session }
//           );
//           await StockMovement.create(
//             [
//               {
//                 item: item.item,
//                 warehouse: item.warehouse,
//                 movementType: "IN",
//                 quantity: item.quantity,
//                 reference: grn._id,
//                 remarks: "Stock updated via GRN",
//               },
//             ],
//             { session }
//           );
//         }
//         item.stockAdded = true;
//       }
//     }

//     // ----- Update Linked Purchase Order (PO) -----
//     if (purchaseOrderId) {
//       const po = await PurchaseOrder.findById(purchaseOrderId).session(session);
//       if (!po) {
//         throw new Error(
//           `Purchase Order with id ${purchaseOrderId} not found. Aborting GRN save.`
//         );
//       }
//       let allItemsReceived = true;
//       for (const poItem of po.items) {
//         poItem.receivedQuantity = poItem.receivedQuantity || 0;
//         const grnItem = grnData.items.find(
//           (i) => i.item.toString() === poItem.item.toString()
//         );
//         if (grnItem) {
//           poItem.receivedQuantity += Number(grnItem.quantity) || 0;
//         }
//         const originalQty = Number(poItem.orderedQuantity) || 0;
//         const remaining = Math.max(originalQty - poItem.receivedQuantity, 0);
//         poItem.quantity = remaining; // pending quantity
//         console.log(
//           `PO item ${poItem.item.toString()} - ordered: ${originalQty}, received: ${poItem.receivedQuantity}, remaining: ${remaining}`
//         );
//         if (Math.abs(remaining) > 0.01) {
//           allItemsReceived = false;
//         }
//       }
//       po.orderStatus = allItemsReceived ? "Close" : "Open";
//       po.stockStatus = allItemsReceived ? "Updated" : "Adjusted";
//       console.log(`Final PO status: orderStatus=${po.orderStatus}, stockStatus=${po.stockStatus}`);
//       await po.save({ session });
//     }

//     await session.commitTransaction();
//     session.endSession();
//     return new Response(
//       JSON.stringify({ message: "GRN processed and inventory updated", grnId: grn._id }),
//       { status: 200, headers: { "Content-Type": "application/json" } }
//     );
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     console.error("Error processing GRN:", error.stack || error);
//     return new Response(
//       JSON.stringify({ message: "Error processing GRN", error: error.message }),
//       { status: 500, headers: { "Content-Type": "application/json" } }
//     );
//   }
// }








// import mongoose from "mongoose"; 
// import dbConnect from "@/lib/db";
// import GRN from "@/models/grnModels";
// import PurchaseOrder from "@/models/PurchaseOrder";
// import Inventory from "@/models/Inventory";
// import StockMovement from "@/models/StockMovement";

// const { Types } = mongoose;

// export async function POST(req) {
//   await dbConnect();
//   const session = await mongoose.startSession();
//   session.startTransaction();
//   try {
//     const grnData = await req.json();
//     console.log("Received GRN Data:", grnData);

//     // Validate each GRN item.
//     for (const [i, item] of grnData.items.entries()) {
//       if (!item.item) {
//         throw new Error(`Missing item ObjectId for row ${i + 1} with code: ${item.itemCode}`);
//       }
//       if (!item.warehouse) {
//         throw new Error(`Missing warehouse ObjectId for row ${i + 1} with code: ${item.itemCode}`);
//       }
//       if (!Types.ObjectId.isValid(item.warehouse)) {
//         throw new Error(`Invalid warehouse ObjectId for row ${i + 1}: ${item.warehouse}`);
//       }
//     }

//     // Save the GRN document.
//     const [grn] = await GRN.create([grnData], { session });
//     console.log("GRN created with _id:", grn._id);

//     // Update inventory and log stock movements.
//     for (const item of grnData.items) {
//       if (!item.stockAdded) {
//         await Inventory.updateOne(
//           { item: item.item, warehouse: item.warehouse },
//           { $inc: { quantity: item.quantity } },
//           { upsert: true, session }
//         );
//         await StockMovement.create(
//           [{
//             item: item.item,
//             warehouse: item.warehouse,
//             movementType: "IN",
//             quantity: item.quantity,
//             reference: grn._id,
//             remarks: "Stock updated via GRN",
//           }],
//           { session }
//         );
//         item.stockAdded = true;
//       }
//     }

//     // Update the linked Purchase Order if available.
//     if (grnData.purchaseOrderId) {
//       const po = await PurchaseOrder.findById(grnData.purchaseOrderId).session(session);
//       if (po) {
//         let allItemsFulfilled = true;
//         for (const poItem of po.items) {
//           console.log(
//             `Before update - PO item ${poItem.item}: orderedQuantity=${poItem.orderedQuantity}, receivedQuantity=${poItem.receivedQuantity}, pending=${poItem.quantity}`
//           );

//           // Find the matching GRN item for this PO item.
//           const grnItem = grnData.items.find(
//             (i) => i.item.toString() === poItem.item.toString()
//           );
//           // Ensure receivedQuantity is defined.
//           poItem.receivedQuantity = poItem.receivedQuantity || 0;
//           if (grnItem) {
//             console.log(`Matching GRN item found for PO item ${poItem.item} with quantity=${grnItem.quantity}`);
//             poItem.receivedQuantity += Number(grnItem.quantity) || 0;
//           }
//           // Determine the original quantity: if orderedQuantity is set (>0), use it; otherwise, use the current pending quantity.
//           const originalQuantity = (Number(poItem.orderedQuantity) > 0)
//             ? Number(poItem.orderedQuantity)
//             : Number(poItem.quantity);
//           const received = Number(poItem.receivedQuantity) || 0;
//           const remaining = Math.max(originalQuantity - received, 0);
//           poItem.quantity = remaining;
//           console.log(
//             `After update - PO item ${poItem.item}: original=${originalQuantity}, received=${received}, remaining=${remaining}`
//           );
//           if (remaining > 0) {
//             allItemsFulfilled = false;
//           }
//         }
//         // Update PO status based on fulfillment.
//         po.orderStatus = allItemsFulfilled ? "Close" : "Open";
//         // Use a valid enum value; change "Partially Updated" to "Adjusted" (or any allowed value).
//         po.stockStatus = allItemsFulfilled ? "Updated" : "Adjusted";
//         await po.save({ session });
//       }
//     }

//     await session.commitTransaction();
//     session.endSession();
//     return new Response(
//       JSON.stringify({ message: "GRN processed and inventory updated", grnId: grn._id }),
//       { status: 200, headers: { "Content-Type": "application/json" } }
//     );
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     console.error("Error processing GRN:", error.stack || error);
//     return new Response(
//       JSON.stringify({ message: "Error processing GRN", error: error.message }),
//       { status: 500, headers: { "Content-Type": "application/json" } }
//     );
//   }
// }



export async function GET(req) {
  try {
    await dbConnect();
    const grns = await GRN.find({});
    return new Response(JSON.stringify(grns), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching GRNs:", error);
    return new Response(
      JSON.stringify({ message: "Error fetching GRNs", error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// // POST /api/grn: Create a new GRN
// export async function POST(req) {
//   try {
//     await dbConnect();
//     // const data = await req.json();
//         const body = await req.json();
//         const quotation = await GRN.create(body);
//     // const newGRN = new GRN(data);
//     // await newGRN.save();
//     return new Response(
//       JSON.stringify({ message: "GRN created successfully", data: quotation }),
//       {
//         status: 201,
//         headers: { "Content-Type": "application/json" },
//       }
//     );
//   } catch (error) {
//     console.error("Error creating GRN:", error);
//     return new Response(
//       JSON.stringify({ message: "Error creating GRN", error: error.message }),
//       { status: 500, headers: { "Content-Type": "application/json" } }
//     );
//   }
// }
