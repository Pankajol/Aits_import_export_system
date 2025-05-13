import mongoose from "mongoose";

const SupplierSchema = new mongoose.Schema({
  supplierCode: { type: String, required: true, unique: true },
  supplierName: { type: String, required: true },
  supplierType: { type: String, required: true },
  emailId: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  billingAddress1: { type: String, required: true },
  billingAddress2: { type: String },
  billingCountry: { type: String, required: true },
  billingState: { type: String, required: true },
  billingCity: { type: String, required: true },
  billingZip: { type: String, required: true },
  shippingAddress1: { type: String, required: true },
  shippingAddress2: { type: String },
  shippingCountry: { type: String, required: true },
  shippingState: { type: String, required: true },
  shippingCity: { type: String, required: true },
  shippingZip: { type: String, required: true },
  paymentTerms: { type: String, required: true },
  gstNumber: { type: String, required: true },
  pan: { type: String, required: true },
  contactPersonName: { type: String, required: true },
  bankAccountNumber: { type: String, required: true },
  ifscCode: { type: String, required: true },
  leadTime: { type: Number, required: true },
  qualityRating: { type: String, enum: ["A", "B", "C", "D"] },
  supplierCategory: { type: String, default: "" },
  supplierGroup: { type: String, required: true },
  gstCategory: { type: String, required: true },
}, { timestamps: true });

const Supplier = mongoose.models.Supplier || mongoose.model("Supplier", SupplierSchema);

export default Supplier;


// import mongoose from "mongoose";

// const SupplierSchema = new mongoose.Schema({
//   supplierCode: { type: String, required: true, unique: true },
//   supplierName: { type: String, required: true },
//   supplierType: { type: String, required: true }, // Ensure this is provided
//   emailId: { type: String, required: true },
//   mobileNumber: { type: String, required: true },
  
//   billingAddress: {
//     address1: { type: String, required: true },
//     address2: { type: String },
//     country: { type: String, required: true },
//     state: { type: String, required: true },
//     city: { type: String, required: true },
//     zip: { type: String, required: true },
//   },

//   shippingAddress: {
//     address1: { type: String, required: true },
//     address2: { type: String },
//     country: { type: String, required: true },
//     state: { type: String, required: true },
//     city: { type: String, required: true },
//     zip: { type: String, required: true },
//   },

//   paymentTerms: { type: String },
//   gstNumber: { type: String, required: true },
//   pan: { type: String, required: true },
//   contactPersonName: { type: String, required: true },

//   bankDetails: {
//     accountNumber: { type: String, required: true },
//     ifscCode: { type: String, required: true },
//   },

//   leadTime: { type: Number, required: true },
//   qualityRating: { type: String, required: true }, // Change to string if needed
//   supplierCategory: { type: String },
//   supplierGroup: { type: String, required: true },
//   gstCategory: { type: String, required: true },
// });

// export default mongoose.models.Supplier || mongoose.model("Supplier", SupplierSchema);

