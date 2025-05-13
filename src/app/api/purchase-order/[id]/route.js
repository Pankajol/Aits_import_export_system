import dbConnect from "@/lib/db";
import PurchaseOrder from "@/models/PurchaseOrder";

// GET /api/grn/[id]: Get a single GRN by ID
export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;  // Ensure params are awaited here.
    const PurchaseOrders = await PurchaseOrder.findById(id);
    if (!PurchaseOrders) {
      return new Response(JSON.stringify({ message: "PurchaseOrders not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ success: true, data: PurchaseOrders }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching PurchaseOrders:", error);
    return new Response(
      JSON.stringify({ message: "Error fetching PurchaseOrders", error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;  // Ensure params are awaited here.
    const data = await req.json();
    const updatedPurchaseOrder = await PurchaseOrder.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!updatedPurchaseOrder) {
      return new Response(JSON.stringify({ message: "PurchaseOrder not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(
      JSON.stringify({ message: "updatedPurchaseOrder updated successfully", data: updatedPurchaseOrder }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error updating updatedPurchaseOrder:", error);
    return new Response(
      JSON.stringify({ message: "Error updating updatedPurchaseOrder", error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;  // Ensure params are awaited here.
    const deletedPurchaseOrder = await PurchaseOrder.findByIdAndDelete(id);
    if (!deletedPurchaseOrder) {
      return new Response(JSON.stringify({ message: "updateddeletedPurchaseOrder not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(
      JSON.stringify({ message: "updateddeletedPurchaseOrder deleted successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error deleting updateddeletedPurchaseOrder:", error);
    return new Response(
      JSON.stringify({ message: "Error deleting updateddeletedPurchaseOrder", error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}


