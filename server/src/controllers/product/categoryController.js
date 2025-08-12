import Category from "../../models/categoryModel.js";

export const getAllCategories = async (req, reply) => {
  try {
    const categories = await Category.find();
    return reply.status(200).send({
      message: "Categories fetched successfully",
      categories,
    });
  } catch (error) {
    console.error("Fetch categories error:", error);
    return reply.status(500).send({ message: "Internal server error" });
  }
};
