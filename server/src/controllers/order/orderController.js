import Branch from "../../models/branchModel.js";
import Customer from "../../models/categoryModel.js";
import { DeliveryPartner } from "../../models/userModel.js";

export const createOrder = async (req, reply) => {
  try {
    const { userId } = req.user;

    const { items, branch, totalPrice } = req.body;

    if (!items || !branch || !totalPrice) {
      return reply.status(400).send({ message: "All fields are required" });
    }

    let customerData = await Customer.findById(userId);
    let branchData = await Branch.findById(branch);
    if (!customerData) {
      return reply.status(404).send({ message: "Customer not found" });
    }

    const order = new Order({
      user: userId,
      items: items.map((item) => ({
        id: item.id,
        items: item.item,
        count: item.count,
      })),
      branch,
      totalPrice,
      deliveryLocation: {
        latitude: customerData.liveLocation.latitude,
        longitude: customerData.liveLocation.longitude,
        address: customerData.address || "No address available",
      },

      pickupLocation: {
        latitude: branchData.location.latitude,
        longitude: branchData.location.longitude,
        address: branchData.address || "No address available",
      },
    });

    const savedOrder = await order.save();
    return reply.status(201).send({
      message: "Order created successfully",
      order: savedOrder,
    });
    console.log(savedOrder);
  } catch (error) {
    console.error("Create order error:", error);
    return reply.status(500).send({ message: "Failed to create order", error });
  }
};

export const confirmOrder = async (req, reply) => {
  try {
    const { orderId } = req.params;
    const { userId } = req.user;
    const { deliveryPersonLocation } = req.body;
    if (!orderId || !deliveryPersonLocation) {
      return reply.status(400).send({
        message: "Order ID and delivery person location are required",
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return reply.status(404).send({ message: "Order not found" });
    }

    if (order.status !== "available") {
      return reply.status(400).send({ message: "Order already confirmed" });
    }
    order.status = "confirmed";
    order.deliveryPartner = userId;
    order.deliveryPersonLocation = {
      latitude: deliveryPersonLocation.latitude,
      longitude: deliveryPersonLocation.longitude,
      address: deliveryPersonLocation.address || "No address available",
    };
    req.server.io.to(orderId).emit("orderConfirmed", order);
    await order.save();
    return reply.status(200).send(order);
  } catch (error) {
    console.log("Confirm order error:", error);
    return reply
      .status(500)
      .send({ message: "Failed to confirm order", error });
  }
};

export const updateOrderStatus = async (req, reply) => {
  try {
    const { orderId } = req.params;
    const { userId } = req.user;
    const { status, deliveryPersonLocation } = req.body;

    const deliveryPartner = await DeliveryPartner.findById(userId);
    if (!deliveryPartner) {
      return reply.status(404).send({ message: "Delivery partner not found" });
    }
    const order = await Order.findById(orderId);

    if (["cancelled", "delivered"].includes(order.status)) {
      return reply
        .status(400)
        .send({ message: "Order already cancelled or delivered" });
    }

    if (order.deliveryPartner.toString() !== userId) {
      return reply
        .status(403)
        .send({ message: "Not authorized to update this order" });
    }

    order.status = status;
    order.deliveryPersonLocation = deliveryPersonLocation;
    await order.save();
    req.server.io.to(orderId).emit("liveTrackingUpdates", order);
    return reply.status(200).send({
      message: `Order status updated to ${status}`,
      order,
    });
  } catch (error) {
    console.error("Update order status error:", error);
    return reply
      .status(500)
      .send({ message: "Failed to update order status", error });
  }
};

export const getOrders = async (req, reply) => {
  try {
    const { status, customerId, deliveryPartnerId, branchId } = req.query;

    let query;
    if (status) {
      query.status = status;
    }
    if (customerId) {
      query.customerId = customerId;
    }
    if (deliveryPartnerId) {
      query.deliveryPartner = deliveryPartnerId;
      query.branch = branchId;
    }
    const order = await Order.find(query).populate(
      " customer branch items.item deliveryPartner"
    );
    return order;
  } catch (error) {
    console.error("get orders error:", error);
    return reply.status(500).send({ message: "Failed to get orders", error });
  }
};

export const getOrdersById = async (req, reply) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate(
      " customer branch items.item deliveryPartner"
    );
    if (!orderId) {
      return reply.status(404).send({ message: "Order not found" });
    }
    return order;
  } catch (error) {
    console.error("get orders error:", error);
    return reply.status(500).send({ message: "Failed to get orders", error });
  }
};
