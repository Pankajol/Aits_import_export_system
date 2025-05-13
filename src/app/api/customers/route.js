import dbConnect from "@/lib/db.js";
import Customer from "@/models/CustomerModel";
import { NextResponse } from "next/server";




export async function POST(req) {
  await dbConnect();
  try {
    const data = await req.json();
    console.log("Received customer data:", data);

    // Validate required fields
    if (!data.customerCode || !data.customerName || !data.emailId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const customer = await Customer.create(data);
    return NextResponse.json(customer, { status: 201 });
  } catch (error) {
    console.error("Error creating customer:", error);
    return NextResponse.json(
      { error: error.message || "Error creating customer" },
      { status: 400 }
    );
  }
}


export async function GET() {
  await dbConnect();
  try {
    const customers = await Customer.find({});
    return NextResponse.json(customers, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error fetching customers" }, { status: 400 });
  }
}

// export async function POST(req) {
//   await dbConnect();
//   try {
//     const data = await req.json();
//     console.log('Received customer data:', data);
//     const customer = await Customer.create(data);
//     return NextResponse.json(customer, { status: 201 });
//   } catch (error) {
//     return NextResponse.json({ error: "Error creating customer" }, { status: 400 });
//   }
// }
