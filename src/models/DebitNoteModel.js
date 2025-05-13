import mongoose from "mongoose";

// Schema for batch details.
const BatchSchema = new mongoose.Schema({
  batchCode: { type: String, required: true },
  expiryDate: { type: Date, required: true },
  manufacturer: { type: String, required: true },
  allocatedQuantity: { type: Number, required: true },
  availableQuantity: { type: Number, required: true }
});

// Schema for each item in the debit note.
const ItemSchema = new mongoose.Schema({
  item: { type: String, required: true },
  itemCode: { type: String, required: true },
  itemName: { type: String, required: true },
  itemDescription: { type: String, required: true },
  quantity: { type: Number, required: true }, // Total quantity for the item.
  allowedQuantity: { type: Number, default: 0 },
  unitPrice: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  freight: { type: Number, default: 0 },
  gstType: { type: Number, default: 0 },
  priceAfterDiscount: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  gstAmount: { type: Number, required: true },
  tdsAmount: { type: Number, required: true },
  batches: [BatchSchema],
  warehouse: { type: String, required: true },
  warehouseName: { type: String, required: true },
  warehouseCode: { type: String, required: true },
  errorMessage: { type: String },
  taxOption: { type: String, enum: ["GST", "IGST"], default: "GST" },
  igstAmount: { type: Number, default: 0 },
  managedByBatch: { type: Boolean, default: true }
});

// Schema for the overall Debit Note.
const DebitNoteSchema = new mongoose.Schema({
  // Polymorphic reference to a Sales Order or Delivery (if this debit note is copied).
  sourceId: { type: mongoose.Schema.Types.ObjectId, refPath: "sourceModel" },
  sourceModel: { type: String, enum: ["SalesOrder", "Delivery"] },
  
  // Supplier-related fields.
  supplierCode: { type: String, required: true },
  supplierName: { type: String, required: true },
  supplierContact: { type: String, required: true },
  
  refNumber: { type: String }, // Debit Note Number.
  salesEmployee: { type: String },
  status: { type: String, enum: ["Pending", "Confirmed"], default: "Pending" },
  
  // Date fields.
  postingDate: { type: Date },
  validUntil: { type: Date },
  documentDate: { type: Date },
  
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
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.DebitNote || mongoose.model("DebitNote", DebitNoteSchema);



// import mongoose from 'mongoose';

// const DebitNoteItemSchema = new mongoose.Schema({
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

// const DebitNoteSchema = new mongoose.Schema({
//   supplierCode: { type: String },
//   supplierName: { type: String },
//   contactPerson: { type: String },
//   debitNoteNumber: { type: String },
//   status: { type: String, default: "Open" },
//   documentDate: { type: Date },
//   validUntil: { type: Date },
//   items: [DebitNoteItemSchema],
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

// export default mongoose.models.DebitNote || mongoose.model('DebitNote', DebitNoteSchema);




// import mongoose from 'mongoose';
// import Counter from './Counter';

// const DebitNoteItemSchema = new mongoose.Schema({
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
//   // You can include warehouse details per item if needed (optional):
//   warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse' },
//   warehouseName: { type: String },
//   warehouseCode: { type: String },
// }, { _id: false });

// const DebitNoteSchema = new mongoose.Schema({
//   noteNumber: { type: String, unique: true },
//   supplierCode: { type: String },
//   supplierName: { type: String },
//   contactPerson: { type: String },
//   postingDate: { type: Date },
//   documentDate: { type: Date },
//   // Removed the overall warehouse field per your request.
//   items: [DebitNoteItemSchema],
//   totalBeforeDiscount: { type: Number, default: 0 },
//   gstTotal: { type: Number, default: 0 },
//   grandTotal: { type: Number, default: 0 },
//   openBalance: { type: Number, default: 0 },
//   remarks: { type: String },
//   status: { 
//     type: String, 
//     enum: ["Draft", "Issued", "Adjusted", "Cancelled"],
//     default: "Draft" 
//   },
// }, { timestamps: true });

// DebitNoteSchema.pre('save', async function (next) {
//   if (!this.noteNumber) {
//     try {
//       const counter = await Counter.findOneAndUpdate(
//         { id: 'debitNote' },
//         { $inc: { seq: 1 } },
//         { new: true, upsert: true }
//       );
//       this.noteNumber = `DN-${String(counter.seq).padStart(3, '0')}`;
//       next();
//     } catch (error) {
//       next(error);
//     }
//   } else {
//     next();
//   }
// });

// export default mongoose.models.DebitNote || mongoose.model('DebitNote', DebitNoteSchema);


// import mongoose from "mongoose";

// const DebitNoteSchema = new mongoose.Schema(
//   {
//     supplierCode: { type: String, required: true },
//     supplierName: { type: String, required: true },
//     contactPerson: { type: String, required: true },
//     refNumber: { type: String },
//     status: { type: String, default: "Open" },
//     postingDate: { type: Date },
//     validUntil: { type: Date },
//     documentDate: { type: Date },
//     items: [
//       {
//         itemCode: { type: String },
//         itemName: { type: String },
//         itemDescription: { type: String },
//         quantity: { type: Number, default: 0 },
//         unitPrice: { type: Number, default: 0 },
//         discount: { type: Number, default: 0 },
//         freight: { type: Number, default: 0 },
//         gstType: { type: Number, default: 0 },
//         priceAfterDiscount: { type: Number, default: 0 },
//         totalAmount: { type: Number, default: 0 },
//         gstAmount: { type: Number, default: 0 },
//         tdsAmount: { type: Number, default: 0 },
//       },
//     ],
//     salesEmployee: { type: String },
//     remarks: { type: String },
//     freight: { type: Number, default: 0 },
//     rounding: { type: Number, default: 0 },
//     totalDownPayment: { type: Number, default: 0 },
//     appliedAmounts: { type: Number, default: 0 },
//     totalBeforeDiscount: { type: Number, default: 0 },
//     gstTotal: { type: Number, default: 0 },
//     grandTotal: { type: Number, default: 0 },
//     openBalance: { type: Number, default: 0 },
//   },
//   { timestamps: true }
// );

// // This prevents model overwrite issues during hot-reloads in development.
// export default mongoose.models.DebitNote || mongoose.model("DebitNote", DebitNoteSchema);
