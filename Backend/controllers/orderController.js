import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import foodModel from "../models/foodModel.js";
import revenueModel from "../models/revenueModel.js";
import stripe from "stripe";
import { io } from "../server.js";

const Stripe = new stripe(process.env.STRIPE_SECRET_KEY);

const snapshotRevenue = async (order) => {
  const date = new Date(order.date || order.createdAt);
  const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  const year = date.getFullYear();

  // build category breakdown from items
  const categoryBreakdown = {};
  for (const item of order.items) {
    const food = await foodModel.findById(item._id).select("category");
    const cat = food?.category || "Other";
    categoryBreakdown[cat] =
      (categoryBreakdown[cat] || 0) + item.price * item.quantity;
  }

  // upsert into revenue collection
  await revenueModel.findOneAndUpdate(
    { month },
    {
      $inc: {
        totalRevenue: order.amount,
        totalOrders: 1,
        totalItems: order.items.reduce((sum, i) => sum + i.quantity, 0),
      },
      $set: { year },
      // merge category breakdown
      ...Object.fromEntries(
        Object.entries(categoryBreakdown).map(([cat, val]) => [
          `categoryBreakdown.${cat}`,
          { $add: [{ $ifNull: [`$categoryBreakdown.${cat}`, 0] }, val] },
        ]),
      ),
    },
    { upsert: true, new: true },
  );
};
const deleteOrder = async (orderId) => {
  const order = await orderModel.findById(orderId);
  if (!order) return;

  // only snapshot paid/delivered orders
  if (order.payment && order.status === "Delivered") {
    await snapshotRevenue(order);
  }

  await orderModel.findByIdAndDelete(orderId);
  console.log(`Order ${orderId} deleted and revenue snapshotted`);
};

const scheduleOrderDeletion = (orderId) => {
  const FIVE_YEARS = 5 * 365 * 24 * 60 * 60 * 1000;
  setTimeout(() => {
    deleteOrder(orderId);
    console.log(`Order ${orderId} auto-deleted after 5 years`);
  }, FIVE_YEARS);
};

const scheduleOrderUpdates = (orderId, prepTimeMinutes, userId) => {
  const uid = userId.toString();

  setTimeout(async () => {
    await orderModel.findByIdAndUpdate(orderId, { status: "Food Processing" });
    io.to(uid).emit("orderStatusUpdate", {
      orderId,
      status: "Food Processing",
    });
    io.to("admin").emit("orderStatusUpdate", {
      orderId,
      status: "Food Processing",
    });
    console.log(`Order ${orderId} → Food Processing`);
  }, 1000);

  setTimeout(
    async () => {
      await orderModel.findByIdAndUpdate(orderId, {
        status: "Out for Delivery",
      });
      io.to(uid).emit("orderStatusUpdate", {
        orderId,
        status: "Out for Delivery",
      });
      io.to("admin").emit("orderStatusUpdate", {
        orderId,
        status: "Out for Delivery",
      });
      console.log(`Order ${orderId} → Out for Delivery`);
    },
    prepTimeMinutes * 60 * 1000,
  );

  setTimeout(
    async () => {
      await orderModel.findByIdAndUpdate(orderId, { status: "Delivered" });
      io.to(uid).emit("orderStatusUpdate", { orderId, status: "Delivered" });
      io.to("admin").emit("orderStatusUpdate", {
        orderId,
        status: "Delivered",
      });
      console.log(`Order ${orderId} → Delivered`);

      scheduleOrderDeletion(orderId);
    },
    (prepTimeMinutes + 30) * 60 * 1000,
  );
};

const placeorder = async (req, res) => {
  try {
    const prepTimes = await Promise.all(
      req.body.items.map(async (item) => {
        const food = await foodModel.findById(item._id);
        return food?.prepTime || 15;
      }),
    );
    const totalPrepTime = Math.max(...prepTimes);

    const neworder = new orderModel({
      userId: req.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      prepTime: totalPrepTime,
    });
    await neworder.save();
    await userModel.findByIdAndUpdate(req.userId, { cartData: {} });

    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100 * 80),
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: "inr",
        product_data: { name: "Delivery Charges" },
        unit_amount: Math.round(2 * 100 * 80),
      },
      quantity: 1,
    });

    const session = await Stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `http://localhost:5173/verify?success=true&orderId=${neworder._id}`,
      cancel_url: `http://localhost:5173/verify?success=false&orderId=${neworder._id}`,
    });

    res.json({ success: true, url: session.url });
  } catch (error) {
    console.error("Stripe error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success == "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      const order = await orderModel.findById(orderId);
      scheduleOrderUpdates(orderId, order.prepTime || 15, order.userId);
      res.json({ success: true, message: "paid" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: true, message: "not paid" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const userOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ userId: req.userId })
      .sort({ date: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const listOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find()
      .sort({ date: -1 })
      .populate("userId", "name email");
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, {
      status: req.body.status,
    });
    const order = await orderModel.findById(req.body.orderId);

    if (req.body.status === "Delivered" && order.payment) {
      await snapshotRevenue(order);
    }

    io.to(order.userId.toString()).emit("orderStatusUpdate", {
      orderId: req.body.orderId,
      status: req.body.status,
    });
    io.to("admin").emit("orderStatusUpdate", {
      orderId: req.body.orderId,
      status: req.body.status,
    });
    res.json({ success: true, message: "Status updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteOrderHandler = async (req, res) => {
  try {
    await deleteOrder(req.body.orderId);
    io.to("admin").emit("orderDeleted", { orderId: req.body.orderId });
    res.json({ success: true, message: "Order deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getRevenue = async (req, res) => {
  try {
    const revenue = await revenueModel.find().sort({ month: -1 });
    res.json({ success: true, data: revenue });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  placeorder,
  verifyOrder,
  userOrders,
  listOrders,
  updateStatus,
  deleteOrderHandler,
  getRevenue,
};
