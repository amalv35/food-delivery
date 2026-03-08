import mongoose from "mongoose";

const revenueSchema = new mongoose.Schema({
  month: { type: String },
  year: { type: Number },
  totalRevenue: { type: Number, default: 0 },
  totalOrders: { type: Number, default: 0 },
  totalItems: { type: Number, default: 0 },
  categoryBreakdown: { type: Object, default: {} },
});

const revenueModel =
  mongoose.models.revenue || mongoose.model("Revenue", revenueSchema);
export default revenueModel;
