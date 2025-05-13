// // /app/api/inventory/route.js
// import dbConnect from '@/lib/db';
// import Inventory from '@/models/Inventory';
// import warehouseModels from '@/models/warehouseModels';

// export async function GET(req) {
//   await dbConnect();
//   try {
//     const inventoryRecords = await Inventory.find({})
//       .populate('warehouse') // populates the warehouse field with Warehouse details
//       .populate('item');     // populates the item field with Item details

//     return new Response(JSON.stringify(inventoryRecords), {
//       status: 200,
//       headers: { "Content-Type": "application/json" },
//     });
//   } catch (error) {
//     console.error("Error fetching inventory:", error);
//     return new Response(
//       JSON.stringify({ message: "Error fetching inventory", error: error.message }),
//       { status: 500, headers: { "Content-Type": "application/json" } }
//     );
//   }
// }


import dbConnect from '@/lib/db';
import Inventory from '@/models/Inventory';
import '@/models/warehouseModels';
import '@/models/ItemModels';

export async function GET(req) {
  await dbConnect();
  
  const { searchParams } = new URL(req.url);
  const itemId = searchParams.get('item');
  const warehouse = searchParams.get('warehouse'); // e.g. warehouse ID
  
  if (itemId) {
    const query = { item: itemId };
    if (warehouse) {
      query.warehouse = warehouse;
    }
    try {
      const inventory = await Inventory.findOne(query)
        .populate('warehouse')
        .populate('item')
        .lean();
      if (!inventory) {
        return new Response(
          JSON.stringify({ success: false, message: "No inventory found for this item and warehouse" }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }
      return new Response(
        JSON.stringify({ success: true, batches: inventory.batches }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      console.error("Error fetching inventory:", error);
      return new Response(
        JSON.stringify({ success: false, message: error.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  } else {
    // Optionally return all inventory records.
    try {
      const inventories = await Inventory.find({})
        .populate('warehouse')
        .populate('item')
        .lean();
      return new Response(
        JSON.stringify({ success: true, data: inventories }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      console.error("Error fetching inventories:", error);
      return new Response(
        JSON.stringify({ success: false, message: error.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }
}

