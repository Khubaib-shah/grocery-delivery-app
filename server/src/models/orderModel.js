import mongoose from "mongoose";
import Counter from "./counterModel";

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: [true, "Order ID is required"],
      unique: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: [true, "Customer is required"],
    },
    deliveryPartner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryPartner",
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: [true, "Branch is required"],
    },
    items: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "Item ID is required"],
        },
        item: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
      },
    ],
    count: {
      type: Number,
      required: [true, "Item count is required"],
    },
    deliveryLocation: {
      latitude: {
        type: Number,
        required: [true, "Latitude is required"],
      },
      longitude: {
        type: Number,
        required: [true, "Longitude is required"],
      },
      address: { type: String },
    },

    pickupLocation: {
      latitude: {
        type: Number,
        required: [true, "Pickup latitude is required"],
      },
      longitude: {
        type: Number,
        required: [true, "Pickup longitude is required"],
      },
      address: { type: String },
    },
    deliveryPersonLocation: {
      latitude: { type: Number },
      longitude: { type: Number },
      address: { type: String },
    },
    status: {
      type: String,
      enum: ["available", "confirmed", "delivered", "cancelled"],
      default: "available",
    },
    totalPrice: {
      type: Number,
      required: [true, "Total price is required"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

async function getNextSequenceValue(sequenceName) {
  const sequenceDocument = await Counter.findOneAndUpdate(
    { name: sequenceName },
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true }
  );
  return sequenceDocument.sequence_value;
}

orderSchema.pre("save", async function (next) {
  if (this.isNew) {
    this.orderId = await getNextSequenceValue("orderId");
    this.orderId = `ORD${this.orderId.toString().padStart(6, "0")}`;
  }
  next();
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
