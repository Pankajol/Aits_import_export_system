import mongoose from 'mongoose';

const ProductionOrderSchema = new mongoose.Schema({
  bomId: { type: mongoose.Types.ObjectId, ref: 'BOM', required: true },
  type: { type: String, default: 'standard' },
  status: { type: String, default: 'planned' },
  warehouse: { type: mongoose.Types.ObjectId, ref: 'Warehouse' },
  productDesc: String,
  priority: String,
  productionDate: Date,
  quantity: { type: Number, default: 1 },
  items: [
    {
      _id: false,
      itemCode: String,
      itemName: String,
      unitQty: Number,
      quantity: Number,
      requiredQty: Number,
      warehouse: { type: mongoose.Types.ObjectId, ref: 'Warehouse' }
    }
  ],
  statusHistory: [{ status: String, date: Date }]
}, { timestamps: true });

export default mongoose.models.ProductionOrder || mongoose.model('ProductionOrder', ProductionOrderSchema);
