import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
  },
  imageUrl: {
    type: String,
    required: [true, "Image URL is required"],
    match: [
      /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/,
      "Please enter a valid image URL",
    ],
  },
  price: {
    type: Number,
    required: [true, "Product price is required"],
    min: [0, "Price cannot be negative"],
  },
  discountPrice: {
    type: Number,
    min: [0, "Price cannot be negative"],
  },
  quantity: {
    type: String,
    required: [true, "Product quantity is required"],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "Product category is required"],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const Product = mongoose.model("Product", productSchema);
export default Product;
