import { Customer, DeliveryPartner } from "../../models/index.js";

export const updateUser = async (req, reply) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;
    if (!userId || !updateData) {
      return reply
        .status(400)
        .send({ message: "User ID and update data are required" });
    }
    let user =
      (await Customer.findByIdAndUpdate(userId)) ||
      (await DeliveryPartner.findByIdAndUpdate(userId));
    if (!user) {
      return reply.status(404).send({ message: "User not found" });
    }
    let userModel;

    if (user.role === "Customer") {
      userModel = Customer;
    } else if (user.role === "DeliveryPartner") {
      userModel = DeliveryPartner;
    }
    let updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedUser) {
      return reply.status(404).send({ message: "User not found" });
    }
    return reply.status(200).send({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update user error:", error);
    return reply.status(500).send({ message: "Failed to update user", error });
  }
};
