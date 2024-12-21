import { NextResponse } from 'next/server';
import connectDb from '../../../lib/db';
import Customer from './schema';// Customer model

// Validation function to check if the form data is correct
const validateCustomerData = (data) => {
  const errors = {};

  // Required fields
  if (!data.customerCode) errors.customerCode = 'Customer Code is required';
  if (!data.customerName) errors.customerName = 'Customer Name is required';
  if (!data.emailId) errors.emailId = 'Email is required';
  if (!data.mobileNumber) errors.mobileNumber = 'Mobile Number is required';

  // Validate email format
  if (data.emailId && !/\S+@\S+\.\S+/.test(data.emailId)) {
    errors.emailId = 'Email is not valid';
  }

  // Validate mobile number (simple check, update as needed)
  if (data.mobileNumber && !/^\d{10}$/.test(data.mobileNumber)) {
    errors.mobileNumber = 'Mobile Number must be 10 digits';
  }

  return errors;
};

export async function POST(request) {
  try {
    await connectDb(); // Connect to database

    // Parse the form data from the request body
    const formData = await request.json();

    // Validate the form data
    const validationErrors = validateCustomerData(formData);

    // If there are validation errors, return them
    if (Object.keys(validationErrors).length > 0) {
      return NextResponse.json(
        { message: 'Validation failed', errors: validationErrors },
        { status: 400 }
      );
    }

    // If no validation errors, create the customer object
    const newCustomer = new Customer(formData);

    // Save the new customer to the database
    await newCustomer.save();

    // Respond with success message and customer data
    return NextResponse.json(
      { message: 'Customer created successfully', customer: newCustomer },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating customer:', error);

    // Return error if something goes wrong
    return NextResponse.json(
      { message: 'Failed to create customer', error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDb(); // Connect to database

    // Fetch all customers from the database
    const customers = await Customer.find();

    // Return the list of customers
    return NextResponse.json({ customers }, { status: 200 });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { message: 'Failed to fetch customers', error: error.message },
      { status: 500 }
    );
  }
}
