import { Customer, DeliveryPartner } from "../../models/index.js";

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

export const loginDeliveryPartner = async (req, reply) => {
  const { email, password } = req.body;

  try {
    const deliveryPartner = await DeliveryPartner.find({ email });
    if (!deliveryPartner) {
      return reply.status(404).send({ message: "Delivery partner not found" });
    }

    const isMatch = password === deliveryPartner.password;
    if (!isMatch) {
      return reply.status(401).send({ message: "Invalid credentials" });
    }

    const { accessToken, refreshToken } = generateAuthToken(deliveryPartner);
    return reply.status(200).send({
      message: "Login successful",
      accessToken,
      refreshToken,
      deliveryPartner,
    });
  } catch (error) {
    console.error("Login error:", error);
    reply.status(500).send({ message: "Internal server error" });
  }
};

export const refreshToken = async (req, reply) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return reply.status(400).send({ message: "Refresh token is required" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    let user =
      (await Customer.findById(decoded.id)) ||
      (await DeliveryPartner.findById(decoded.id));

    if (!user) {
      return reply.status(404).send({ message: "User not found" });
    }

    if (user.role !== "Customer" && user.role !== "DeliveryPartner") {
      return reply.status(403).send({ message: "Invalid user role" });
    }
    const { accessToken, refreshToken: newRefreshToken } = generateToken(user);
    return reply.status(200).send({
      accessToken,
      refreshToken: newRefreshToken,
      message: "Token refreshed successfully",
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    return reply.status(500).send({ message: "Internal server error" });
  }
};

export const fetchUser = async (req, reply) => {
  const { userId, role } = req.user;

  try {
    let user;

    if (role === "Customer") {
      user = await Customer.findById(userId);
    } else if (role === "DeliveryPartner") {
      user = await DeliveryPartner.findById(userId);
    }
    if (!user) {
      return reply.status(404).send({ message: "User not found" });
    }
    return reply.status(200).send({
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    console.error("Fetch user error:", error);
    return reply.status(500).send({ message: "Internal server error" });
  }
};
