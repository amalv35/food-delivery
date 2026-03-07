import userModel from "../models/userModel.js";

const addToCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.userId);
        let cartData = userData.cartData;

        if (!cartData[req.body.itemId]) {
            cartData[req.body.itemId] = 1;
        } else {
            cartData[req.body.itemId] += 1;
        }

        userData.cartData = cartData;
        userData.markModified("cartData");
        await userData.save();

        return res.json({ success: true, message: "Added to cart" });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Error occurred while adding to cart" });
    }
}

const removeFromCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.userId);
        let cartData = userData.cartData;

        if (cartData[req.body.itemId] > 1) {
            cartData[req.body.itemId] -= 1;
        } else {
            delete cartData[req.body.itemId];
        }

        userData.cartData = cartData;
        userData.markModified("cartData");
        await userData.save();

        return res.json({ success: true, message: "Removed from cart" });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Error occurred while removing from cart" });
    }
}

// ✅ fully removes item regardless of quantity
const clearCartItem = async (req, res) => {
    try {
        let userData = await userModel.findById(req.userId);
        let cartData = userData.cartData;

        delete cartData[req.body.itemId];

        userData.cartData = cartData;
        userData.markModified("cartData");
        await userData.save();

        return res.json({ success: true, message: "Item cleared from cart" });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Error clearing cart item" });
    }
}

const getCartItems = async (req, res) => {
    try {
        let userData = await userModel.findById(req.userId);
        let cartData = userData.cartData;

        return res.json({ success: true, cartData });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Error occurred while fetching cart" });
    }
}

export { addToCart, removeFromCart, clearCartItem, getCartItems }