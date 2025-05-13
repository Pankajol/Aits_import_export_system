// import dbConnect from '@/lib/db';
// import Inventory from '@/models/Inventory';
// import '@/models/warehouseModels';  // Register the Warehouse model
// import '@/models/ItemModels';       // Register the Item model

// export async function GET(req, { params }) {
//   await dbConnect();
//   const { id } = params;
//   try {
//     const inventory = await Inventory.findOne({ _id: id })
//       .populate('warehouse')
//       .populate('item')
//       .lean();

//     if (!inventory) {
//       return new Response(
//         JSON.stringify({ success: false, message: "Inventory not found" }),
//         { status: 404, headers: { "Content-Type": "application/json" } }
//       );
//     }

//     return new Response(
//       JSON.stringify({ success: true, data: inventory }),
//       { status: 200, headers: { "Content-Type": "application/json" } }
//     );
//   } catch (error) {
//     console.error("Error fetching inventory record:", error);
//     return new Response(
//       JSON.stringify({ success: false, message: error.message }),
//       { status: 500, headers: { "Content-Type": "application/json" } }
//     );
//   }
// }

import dbConnect from '@/lib/db';
import Inventory from '@/models/Inventory';
import { Types } from 'mongoose';

export async function GET(request, { params }) {
  await dbConnect();
  const resolvedParams = await params;
  const { itemId, itemCode, warehouseId } = resolvedParams;
  // console.log("API params received:", resolvedParams);

  try {
    // Convert the string parameters to ObjectId.
    const inventory = await Inventory.findOne({
      // item: new Types.ObjectId(itemId),
      itemCode: itemCode,
      warehouse: new Types.ObjectId(warehouseId),
    });
    if (!inventory) {
      return new Response(JSON.stringify({ message: "Inventory not found" }), { status: 404 });
    }
    return new Response(JSON.stringify({ batches: inventory.batches }), { status: 200 });
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return new Response(JSON.stringify({ error: "Error fetching inventory" }), { status: 500 });
  }
}

