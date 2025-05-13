import mongoose from "mongoose";

// Schema for each sales order item (without batch information)
const ItemSchema = new mongoose.Schema({
  item: { type: String, required: true },
  itemCode: { type: String, required: true },
  itemName: { type: String, required: true },
  itemDescription: { type: String, required: true },
  quantity: { type: Number, required: true }, // Total quantity for the item
  allowedQuantity: { type: Number, default: 0 },
  receivedQuantity: { type: Number, default: 0 },
  unitPrice: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  freight: { type: Number, default: 0 },
  gstType: { type: Number, default: 0 },
  gstRate: { type: Number, default: 0 },
  taxOption: { type: String, enum: ["GST", "IGST"], default: "GST" },
  priceAfterDiscount: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  gstAmount: { type: Number, required: true },
  cgstAmount: { type: Number, default: 0 },
  sgstAmount: { type: Number, default: 0 },
  igstAmount: { type: Number, default: 0 },
  managedBy: { type: String,},
  warehouse: { type: String, required: true },
  warehouseName: { type: String, required: true },
  warehouseCode: { type: String, required: true },
  
  errorMessage: { type: String },
});

// Schema for the overall Sales Order document
const SalesOrderSchema = new mongoose.Schema({
  customerCode: { type: String, required: true },
  customerName: { type: String, required: true },
  contactPerson: { type: String, required: true },
  refNumber: { type: String,  }, // Sales Order Number
  salesEmployee: { type: String },
  status: { type: String, enum: ["Pending", "Confirmed"], default: "Pending" },
  orderDate: { type: Date },
  expectedDeliveryDate: { type: Date },
  items: [ItemSchema],
  remarks: { type: String },
  freight: { type: Number, default: 0 },
  rounding: { type: Number, default: 0 },
  totalDownPayment: { type: Number, default: 0 },
  appliedAmounts: { type: Number, default: 0 },
  totalBeforeDiscount: { type: Number, required: true },
  gstTotal: { type: Number, required: true },
  grandTotal: { type: Number, required: true },
  openBalance: { type: Number, required: true },
  fromQuote: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.SalesOrder || mongoose.model("SalesOrder", SalesOrderSchema);


// import mongoose from 'mongoose';

// const SalesOrderItemSchema = new mongoose.Schema({
//   item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
//   itemCode: { type: String },
//   itemName: { type: String },
//   itemDescription: { type: String },
//   quantity: { type: Number, default: 0 },
//   unitPrice: { type: Number, default: 0 },
//   discount: { type: Number, default: 0 },
//   freight: { type: Number, default: 0 },
//   gstType: { type: Number, default: 0 },
//   priceAfterDiscount: { type: Number, default: 0 },
//   totalAmount: { type: Number, default: 0 },
//   gstAmount: { type: Number, default: 0 },
//   tdsAmount: { type: Number, default: 0 },
//   warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse' },
//   warehouseName: { type: String },
//   warehouseCode: { type: String },
// }, { _id: false });

// const SalesOrderSchema = new mongoose.Schema({
//   customerCode: { type: String },
//   customerName: { type: String },
//   contactPerson: { type: String },
//   refNumber: { type: String },
//   status: { type: String, default: "Open" },
//   postingDate: { type: Date },
//   validUntil: { type: Date },
//   documentDate: { type: Date },
//   items: [SalesOrderItemSchema],
//   salesEmployee: { type: String },
//   remarks: { type: String },
//   freight: { type: Number, default: 0 },
//   rounding: { type: Number, default: 0 },
//   totalBeforeDiscount: { type: Number, default: 0 },
//   totalDownPayment: { type: Number, default: 0 },
//   appliedAmounts: { type: Number, default: 0 },
//   gstTotal: { type: Number, default: 0 },
//   grandTotal: { type: Number, default: 0 },
//   openBalance: { type: Number, default: 0 },
// }, { timestamps: true });

// export default mongoose.models.SalesOrder || mongoose.model('SalesOrder', SalesOrderSchema);
