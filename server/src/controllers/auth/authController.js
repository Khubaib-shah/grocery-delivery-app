import { Customer } from "../../models/index.js";

export const loginCustomer = async (req, reply) => {
  try {
    const { phone } = req.body;

    let customer = Customer.findOne({ phone });
    if (!customer) {
      customer = new Customer({
        phone,
        role: "Customer",
        isActivated: true,
      });
      await customer.save();
    }

    const { accessToken, refreshToken } = generateAuthToken(customer);
    return reply.status(200).send({
      message: "Login successful",
      accessToken,
      refreshToken,
      customer,
    });
  } catch (error) {
    console.error("Login error:", error);
    reply.status(500).send({ message: "Internal server error" });
  }
};
