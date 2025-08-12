import Product from "../../models/productModel.js";

export const getProductsByCategoryId = async (req, res) => {
  const { categoryId } = req.params;
  if (!categoryId) {
    return res.status(400).send({ message: "Category ID is required" });
  }

  try {
    const products = await Product.find({ category: categoryId })
      .select("-category")
      .exec();
    if (!products || products.length === 0) {
      return res
        .status(404)
        .send({ message: "No products found for this category" });
    }
    return res.status(200).send({
      message: "Products fetched successfully",
      products,
    });
  } catch (error) {
    console.error("Fetch products by category error:", error);
    return res.status(500).send({ message: "Internal server error" });
  }
};
