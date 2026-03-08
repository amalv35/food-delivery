import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  prepTime: { type: Number, default: 15 },
});

const foodModel = mongoose.models.food || mongoose.model("Food", foodSchema);

export default foodModel;
