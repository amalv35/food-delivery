import React, { useContext, } from "react";
import "./foodItem.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";

const FoodItem = ({ _id, name, price, description, image }) => {
  
  const {cartItems , addToCart, removeFromCart} = useContext(StoreContext);
   console.log(cartItems , "cart items in food item");
   console.log(addToCart , "add to cart function in food item");
  console.log("Item Name:", name, "ID:", _id); 
   return (
    <div className="food-item">
      <div className="food-item-img-container">
        <img className="food-item-image" src={image} alt={name} />
        {!cartItems[_id] ? (
          <img 
            className="add-food-item" 
            onClick={() => addToCart(_id)} 
            src={assets.add_icon_white} 
            alt="Add to cart"
          />
        ) : (
          <div className="food-item-counter">
            <img 
              onClick={() => removeFromCart(_id)} 
              src={assets.remove_icon_red} 
              alt="Remove" 
            />
            <p>{cartItems[_id]}</p>
            <img 
              onClick={() => addToCart(_id)} 
              src={assets.add_icon_green} 
              alt="Add more" 
            />
          </div> 
        )}
      </div>
  
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="ratings" />
        </div>
        <p className="food-item-desc">{description}</p>
        <p className="food-item-price">${price}</p>
      </div>
    </div>
  );
};

export default FoodItem;