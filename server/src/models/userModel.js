import mongoose from "mongoose";

// User schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  role: {
    type: String,
    enum: ["Customer", "Admin", "DeliveryPartner"],
    required: [true, "Role is required"],
  },
  isActivated: {
    type: Boolean,
    default: true,
  },
});

// Custom schema

const customerSchema = new mongoose.Schema({
  ...userSchema.obj,
  phone: {
    type: String,
    unique: true,
    required: [true, "Phone number is required"],
  },
  role: {
    type: String,
    enum: ["Customer"],
    required: [true, "Role is required"],
  },
  liveLocation: {
    letitude: {
      type: Number,
      required: [true, "Latitude is required"],
    },
    longitude: {
      type: Number,
      required: [true, "Longitude is required"],
    },
  },
});

// Delivery partner schema
const deliveryPartnerSchema = new mongoose.Schema({
  ...userSchema.obj,
  phone: {
    type: String,
    unique: true,
    required: [true, "Phone number is required"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"],
  },
  role: {
    type: String,
    enum: ["DeliveryPartner"],
    required: [true, "Role is required"],
  },
  liveLocation: {
    latitude: {
      type: Number,

      required: [true, "Latitude is required"],
    },
    longitude: {
      type: Number,
      required: [true, "Longitude is required"],
    },
  },
  address: { type: String, required: [true, "Address is required"] },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
  },
});

// Admin schema
const adminSchema = new mongoose.Schema({
  ...userSchema.obj,
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"],
  },
  role: {
    type: String,
    enum: ["Admin"],
    required: [true, "Role is required"],
  },
});

export const Customer = mongoose.model("Customer", customerSchema);

export const DeliveryPartner = mongoose.model(
  "DeliveryPartner",
  deliveryPartnerSchema
);

export const Admin = mongoose.model("Admin", adminSchema);
