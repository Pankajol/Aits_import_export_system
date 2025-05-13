import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Item from "@/models/ItemModels";

// Connect to the database
await dbConnect();

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;  // Ensure params are awaited here.
    const fechitem = await Item.findById(id);
    if (!fechitem) {
      return new Response(JSON.stringify({ message: "item not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
       
      });
    }
    console.log("item",fechitem);
    return new Response(JSON.stringify({ success: true, data: fechitem }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
      
    });
   
  } catch (error) {
    console.error("Error fetching GRN:", error);
    return new Response(
      JSON.stringify({ message: "Error fetching GRN", error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
 
}


// Update an item
export async function PUT(req, { params }) {
  try {
    const data = await req.json();
    const updatedItem = await Item.findByIdAndUpdate(params.id, data, { new: true });
    if (!updatedItem) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }
    return NextResponse.json(updatedItem, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}

// Delete an item
export async function DELETE(req, { params }) {
  try {
    const deletedItem = await Item.findByIdAndDelete(params.id);
    if (!deletedItem) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Item deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
