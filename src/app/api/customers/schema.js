import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  customerCode: { type: String, required: true },
  customerName: { type: String, required: true },
  customerGroup: { type: String },
  customerType: { type: String },
  emailId: { type: String, required: true },
  fromLead: { type: String },
  mobileNumber: { type: String, required: true },
  fromOpportunity: { type: String },
  billingAddress1: { type: String },
  billingAddress2: { type: String },
  billingCity: { type: String },
  billingState: { type: String },
  billingZip: { type: String },
  billingCountry: { type: String },
  shippingAddress1: { type: String },
  shippingAddress2: { type: String },
  shippingCity: { type: String },
  shippingState: { type: String },
  shippingZip: { type: String },
  shippingCountry: { type: String }
}, { timestamps: true });

export default mongoose.models.Customer || mongoose.model('Customer', customerSchema);
