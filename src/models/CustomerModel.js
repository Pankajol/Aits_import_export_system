// models/Customer.js
import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    customerCode: {
      type: String,
      required: [true, "Customer code is required"],
      unique: true,
      trim: true,
      uppercase: true
    },
    customerName: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true
    },
    customerGroup: {
      type: String,
      trim: true
    },
    customerType: {
      type: String,
      required: [true, "Customer type is required"],
      enum: {
        values: ['Individual', 'Business', 'Government'],
        message: '{VALUE} is not a valid customer type'
      },
      default: 'Individual'
    },
    emailId: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Invalid email format"]
    },
    fromLead: {
      type: String,
      trim: true
    },
    mobileNumber: {
      type: String,
      required: [true, "Mobile number is required"],
      match: [/^[0-9]{10}$/, "Invalid mobile number format"]
    },
    fromOpportunity: {
      type: String,
      trim: true
    },
    // Billing Address
    billingAddress1: {
      type: String,
      trim: true
    },
    billingAddress2: {
      type: String,
      trim: true
    },
    billingCity: {
      type: String,
      trim: true
    },
    billingState: {
      type: String,
      trim: true
    },
    billingZip: {
      type: String,
      trim: true,
      match: [/^[0-9]{6}$/, "Invalid zip code format"]
    },
    billingCountry: {
      type: String,
      trim: true
    },
    // Shipping Address
    shippingAddress1: {
      type: String,
      trim: true
    },
    shippingAddress2: {
      type: String,
      trim: true
    },
    shippingCity: {
      type: String,
      trim: true
    },
    shippingState: {
      type: String,
      trim: true
    },
    shippingZip: {
      type: String,
      trim: true,
      match: [/^[0-9]{6}$/, "Invalid zip code format"]
    },
    shippingCountry: {
      type: String,
      trim: true
    },
    // Financial Details
    paymentTerms: {
      type: String,
      trim: true
    },
    gstNumber: {
      type: String,
      trim: true,
      uppercase: true,
      match: [/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GST format"]
    },
    gstCategory: {
      type: String,
      trim: true,
      enum: ["Regular", "Composition", "Unregistered", "Other"]
    },
    pan: {
      type: String,
      trim: true,
      uppercase: true,
      match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format"]
    },
    contactPersonName: {
      type: String,
      trim: true
    },
    commissionRate: {
      type: String,
      trim: true
    },
    glAccount: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true,
    collection: "customers"
  }
);

// Add indexes for frequently queried fields
customerSchema.index({ customerCode: 1 });
customerSchema.index({ emailId: 1 });
customerSchema.index({ mobileNumber: 1 });

// Handle duplicate key errors
customerSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0];
    next(new Error(`${field} already exists`));
  } else {
    next(error);
  }
});

const Customer = mongoose.models.Customer || mongoose.model("Customer", customerSchema);

export default Customer;