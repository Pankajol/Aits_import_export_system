import dbConnect from "@/lib/db";
import SalesQuotation from "@/models/SalesQuotationModel";

export async function GET(request) {
  await dbConnect();
  try {
    const quotations = await SalesQuotation.find({});
    return new Response(JSON.stringify({ success: true, data: quotations }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("GET error:", error);
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

    // Basic validation for required fields.
    if (!body.customerCode || !body.customerName) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "customerCode and customerName are required.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const quotation = await SalesQuotation.create(body);
    return new Response(JSON.stringify({ success: true, data: quotation }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("POST error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
}
