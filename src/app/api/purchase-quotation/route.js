import dbConnect from "@/lib/db";
import PurchaseQuotation from "@/models/PurchaseQuotationModel";

export async function GET(request) {
  await dbConnect();
  try {
    const quotations = await PurchaseQuotation.find({});
    return new Response(
      JSON.stringify({ success: true, data: quotations }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function POST(request) {
  await dbConnect();
  try {
    const body = await request.json();
    const quotation = await PurchaseQuotation.create(body);
    return new Response(
      JSON.stringify({ success: true, data: quotation }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
}
