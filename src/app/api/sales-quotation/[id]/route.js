

import dbConnect from "@/lib/db";
import SalesQuotation from "@/models/SalesQuotationModel";

export async function GET(request, { params }) {
  await dbConnect();
  const { id } = await params;
  try {
    const quotation = await SalesQuotation.findById(id);
    if (!quotation) {
      return new Response(JSON.stringify({ success: false, error: "Not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ success: true, data: quotation }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}


export async function PUT(request, { params }) {
  await dbConnect();
  try {
    const { id } = params;
    const body = await request.json();
    const quotation = await SalesQuotation.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!quotation) {
      return new Response(
        JSON.stringify({ success: false, error: "Not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify({ success: true, data: quotation }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
}


export async function DELETE(request, { params }) {
  await dbConnect();
  try {
    const { id } = await params;  // await params to ensure proper async access
    const result = await SalesQuotation.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      return new Response(JSON.stringify({ success: false, error: "Not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ success: true, data: {} }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}

