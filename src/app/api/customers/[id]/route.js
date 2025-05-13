import dbConnect from "@/lib/db.js";
import Customer from "@/models/CustomerModel";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { id } = params; // Use id here
  try {
    await dbConnect(); // Ensure database connection is established
    const customer = await Customer.findById(id); // Find customer by id
    if (!customer) return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    return NextResponse.json(customer, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error fetching customer" }, { status: 400 });
  }
}

export async function PUT(req, { params }) {
  const { id } = params; // Use id here
  try {
    const data = await req.json();
    const customer = await Customer.findByIdAndUpdate(id, data, { new: true }); // Update customer by id
    if (!customer) return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    return NextResponse.json(customer, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error updating customer" }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  const { id } = params; // Ensure the parameter is named id

  if (!id) {
    return NextResponse.json({ error: "Customer id is required" }, { status: 400 });
  }

  try {
    const deletedCustomer = await Customer.findByIdAndDelete(id); // Delete customer by id

    if (!deletedCustomer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    return NextResponse.json({ success: "Customer deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error deleting customer" }, { status: 500 });
  }
}
