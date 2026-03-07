import foodModel from "../models/foodModel.js";
import fs from "fs";

// add food items
const addFood = async (req, res) => {
    // 1. Check if file exists to prevent server crash
    if (!req.file) {
        return res.status(400).json({ success: false, message: "Image upload is required" });
    }

    let image_filename = `${req.file.filename}`;

    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_filename
    });

    try {
        await food.save();
        res.status(201).json({ success: true, message: "Food item added successfully", data: food });
    } catch (error) {
        console.error("Database Error:", error);

        // 2. Cleanup: Delete the uploaded image if the database save fails
        // This prevents your 'uploads' folder from filling up with "junk" images
        fs.unlink(`uploads/${image_filename}`, (err) => {
            if (err) console.error("Failed to delete orphaned file:", err);
        });

        res.status(500).json({ 
            success: false, 
            message: "Error adding food item", 
            error: error.message 
        });
    }
}


// all food items

const getAllFood = async (req, res) => {
    try {const foods = await foodModel.find({});
        res.status(200).json({ success: true, data: foods });
    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Error fetching food items", 
            error: error.message 
        });
    }
}

// remoeve food item

const removeFood = async (req, res) => {
    try {
        const { id } = req.body; 

        if (!id) {
             return res.status(400).json({ success: false, message: "ID is missing" });
        }

        const food = await foodModel.findById(id);
        
        if (food && food.image) {
            fs.unlink(`uploads/${food.image}`, () => {});
        }

        await foodModel.findByIdAndDelete(id);

        res.json({ success: true, message: "Food Removed" })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}


export { addFood, getAllFood,removeFood };