import mongoose from "mongoose";

export const connectDB = async (uri) => {
  try {
    const db = await mongoose.connect(uri);
    console.log("DB Connected");
  } catch (error) {
    console.log(error);
  }
};
