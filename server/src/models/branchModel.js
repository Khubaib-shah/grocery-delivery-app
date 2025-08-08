import mongoose from "mongoose";
import { DeliveryPartner } from "./userModel";

const branchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Branch name is required"],
    trim: true,
  },
  location: {
    type: {
      type: String,
    },
    longitude: {
      type: Number,
    },
    latitude: {
      type: Number,
    },
  },
  address: {
    type: String,
    required: [true, "Branch address is required"],
  },
  deliveryPartners: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryPartner",
    },
  ],
});

const Branch = mongoose.model("Branch", branchSchema);
export default Branch;
