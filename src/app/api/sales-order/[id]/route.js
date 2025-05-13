import dbConnect from "@/lib/db";
import SalesOrder from "@/models/SalesOrder";

// GET /api/grn/[id]: Get a single GRN by ID
export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;  // Ensure params are awaited here.
    const SalesOrders = await SalesOrder.findById(id);
    if (!SalesOrders) {
      return new Response(JSON.stringify({ message: "SalesOrders not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ success: true, data: SalesOrders }), {
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

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;  // Ensure params are awaited here.
    const data = await req.json();
    const updatedSalesOrder = await SalesOrder.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!updatedSalesOrder) {
      return new Response(JSON.stringify({ message: "SalesOrder not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(
      JSON.stringify({ message: "updatedSalesOrder updated successfully", data: updatedSalesOrder }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error updating updatedSalesOrder:", error);
    return new Response(
      JSON.stringify({ message: "Error updating updatedSalesOrder", error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;  // Ensure params are awaited here.
    const deletedSalesOrder = await SalesOrder.findByIdAndDelete(id);
    if (!deletedSalesOrder) {
      return new Response(JSON.stringify({ message: "updateddeletedSalesOrder not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(
      JSON.stringify({ message: "updateddeletedSalesOrder deleted successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error deleting updateddeletedSalesOrder:", error);
    return new Response(
      JSON.stringify({ message: "Error deleting updateddeletedSalesOrder", error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}