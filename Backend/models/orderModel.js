import mongoose from "mongoose";

const orderschema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  items: { type: Array, required: true },
  amount: { type: Number, required: true },
  address: { type: Object, required: true },
  status: { type: String, default: "processing" },
  date: { type: Date, default: Date.now },
  payment: { type: Boolean, default: false },
});

const orderModel =
  mongoose.models.order || mongoose.model("Order", orderschema);

export default orderModel;
