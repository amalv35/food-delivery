import React, { useContext, useState } from "react";
import "./placeorder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } =
    useContext(StoreContext);
  const navigate = useNavigate();

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const orderItems = food_list
      .filter((item) => cartItems[item._id] > 0)
      .map((item) => ({ ...item, quantity: cartItems[item._id] }));

    const orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2,
    };

    try {
      const response = await axios.post(`${url}/api/order/add`, orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        window.location.replace(response.data.url);
      }
    } catch (error) {
      console.error("Order failed:", error);
    }
  };

  return (
    <form className="place-order" onSubmit={onSubmitHandler}>
      {/* ── Left: Delivery Form ── */}
      <div className="place-order-left">
        <p className="title">Delivery Information</p>

        <div className="multi-fields">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            onChange={onChangeHandler}
            value={data.firstName}
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            onChange={onChangeHandler}
            value={data.lastName}
            required
          />
        </div>

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          onChange={onChangeHandler}
          value={data.email}
          required
        />
        <input
          type="text"
          name="street"
          placeholder="Street"
          onChange={onChangeHandler}
          value={data.street}
          required
        />

        <div className="multi-fields">
          <input
            type="text"
            name="city"
            placeholder="City"
            onChange={onChangeHandler}
            value={data.city}
            required
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            onChange={onChangeHandler}
            value={data.state}
            required
          />
        </div>

        <div className="multi-fields">
          <input
            type="text"
            name="zipCode"
            placeholder="Zip Code"
            onChange={onChangeHandler}
            value={data.zipCode}
            required
          />
          <input
            type="text"
            name="country"
            placeholder="Country"
            onChange={onChangeHandler}
            value={data.country}
            required
          />
        </div>

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          onChange={onChangeHandler}
          value={data.phone}
          required
        />
      </div>

      {/* ── Right: Order Summary ── */}
      <div className="place-order-right">
        <h2>Order Summary</h2>

        <div className="order-summary">
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${getTotalCartAmount()}</span>
          </div>
          <div className="summary-row">
            <span>Delivery Fee</span>
            <span>{getTotalCartAmount() === 0 ? "—" : "$2.00"}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>
              $
              {getTotalCartAmount() === 0
                ? "0.00"
                : (getTotalCartAmount() + 2).toFixed(2)}
            </span>
          </div>
        </div>

        <button type="submit">Proceed to Payment</button>

        <div className="secure-badge">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          Secured by Stripe
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
