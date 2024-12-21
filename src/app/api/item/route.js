import { NextResponse } from 'next/server';
import connectDb from '../../../lib/db';
import Item from './schema';

export async function POST(req) {
  try {
    await connectDb();
    const formData = await req.json();

    // Validate required fields
    if (!formData.itemCode || !formData.itemName || !formData.itemGroup) {
      return NextResponse.json(
        { error: "Item Code, Item Name, and Item Group are required." },
        { status: 400 }
      );
    }

    const newItem = new Item(formData);
    await newItem.save();

    return NextResponse.json(
      { message: "Item added successfully", item: newItem },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to save item" }, { status: 500 });
  }
}


export async function GET() {
  try {
    await connectDb();
    const items = await Item.find();
    return NextResponse.json({items}, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
  }
}
