
// File: app/api/production-orders/route.js (Next.js App Router)
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import ProductionOrder from '@/models/ProductionOrder';



export async function GET() {
  await connectDB();
  try {
    const orders = await ProductionOrder.find().sort('-createdAt');
    return NextResponse.json(orders);
  } catch (err) {
    console.error('Error fetching production orders:', err);
    return NextResponse.json({ error: 'Failed to fetch production orders' }, { status: 500 });
  }
}

export async function POST(request) {
  await connectDB();
  try {
    const data = await request.json();
    const order = new ProductionOrder(data);
    const saved = await order.save();
    return NextResponse.json(saved, { status: 201 });
  } catch (err) {
    console.error('Error creating production order:', err);
    return NextResponse.json({ error: 'Failed to create production order' }, { status: 400 });
  }
}
