"use server";
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import ProductionOrder from '@/models/ProductionOrder';
// import  Warehouse from '@/models/Warehouse'; 
// import BOM from '@/models/BOM';

import '@/models/warehouseModels'; 
import '@/models/BOM';


export async function GET(request, { params }) {
  const { id } = await params;
  await connectDB();

  try {
    const order = await ProductionOrder.findById(id)
      .populate('warehouse', 'warehouseName')
      .populate('items.warehouse', 'warehouseName')
      .populate('bomId', 'productNo');
      

    if (!order) {
      return NextResponse.json({ error: 'Production order not found' }, { status: 404 });
    }

    return NextResponse.json(order.toObject(), { status: 200 });
  } catch (err) {
    console.error('Error fetching production order:', err);
    return NextResponse.json({ error: 'Failed to fetch production order' }, { status: 500 });
  }
}

  
  export async function PUT(request, { params }) {
    const { id } = await params;
    await connectDB();
    try {
      const data = await request.json();
      const updated = await ProductionOrder.findByIdAndUpdate(id, data, { new: true });
      if (!updated) {
        return NextResponse.json({ error: 'Production order not found' }, { status: 404 });
      }
      return NextResponse.json(updated, { status: 200 });
    } catch (err) {
      console.error('Error updating production order:', err);
      return NextResponse.json({ error: 'Failed to update production order' }, { status: 400 });
    }
  }
  
  export async function DELETE(request, { params }) {
    const { id } = await params;
    await connectDB();
    try {
      const deleted = await ProductionOrder.findByIdAndDelete(id);
      if (!deleted) {
        return NextResponse.json({ error: 'Production order not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true }, { status: 200 });
    } catch (err) {
      console.error('Error deleting production order:', err);
      return NextResponse.json({ error: 'Failed to delete production order' }, { status: 400 });
    }
  }
  