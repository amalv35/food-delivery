import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../src/context/StoreContext";
import { toast } from "react-toastify";
import "./MyOrders.css";

const statusClassMap = {
  "Food Processing": "food-processing",
  "Out for Delivery": "out-for-delivery",
  Delivered: "delivered",
  Pending: "pending",
  Cancelled: "cancelled",
};

const MyOrders = () => {
  const { url, token, food_list, socket } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${url}/api/order/userorders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        const sorted = [...response.data.data].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
        setOrders(sorted);
      } else {
        setError("Failed to load orders. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong while fetching your orders.");
      console.error("Order fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("orderStatusUpdate", ({ orderId, status }) => {
      // update that specific order in state instantly
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status } : o)),
      );
      toast.info(`🚀 Order status updated: ${status}`, {
        position: "top-right",
        autoClose: 4000,
      });
    });

    // cleanup listener on unmount
    return () => {
      socket.off("orderStatusUpdate");
    };
  }, [socket]);

  useEffect(() => {
    if (token) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [token]);

  const getFoodImage = (itemId) => {
    const food = food_list.find((f) => f._id === itemId);
    return food ? `${url}/images/${food.image}` : null;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusClass = (status) => statusClassMap[status] || "pending";

  if (loading) {
    return (
      <div className="my-orders">
        <h2>My Orders</h2>
        <div className="orders-loading">
          <div className="spinner" />
          <p>Fetching your orders...</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="my-orders">
        <h2>My Orders</h2>
        <div className="orders-empty">
          <div className="orders-empty-icon">🔒</div>
          <h3>You're not logged in</h3>
          <p>Please log in to view your order history.</p>
          <button onClick={() => navigate("/")}>Go to Home</button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-orders">
        <h2>My Orders</h2>
        <div className="orders-error">
          <p>⚠️ {error}</p>
          <button onClick={fetchOrders}>Retry</button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="my-orders">
        <h2>My Orders</h2>
        <div className="orders-empty">
          <div className="orders-empty-icon">🛍️</div>
          <h3>No orders yet</h3>
          <p>Looks like you haven't placed any orders. Start exploring!</p>
          <button onClick={() => navigate("/")}>Browse Menu</button>
        </div>
      </div>
    );
  }

  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      <div className="my-orders-container">
        {orders.map((order) => (
          <div key={order._id} className="order-card">
            <div className="order-card-header">
              <div className="order-card-header-left">
                <p className="order-id">
                  Order ID: <span>#{order._id.slice(-8).toUpperCase()}</span>
                </p>
                <p className="order-date">{formatDate(order.createdAt)}</p>
              </div>
              <div className={`order-status ${getStatusClass(order.status)}`}>
                <span className="status-dot" />
                {order.status || "Pending"}
              </div>
            </div>

            <div className="order-items-list">
              {order.items.map((item, index) => {
                const imgSrc = getFoodImage(item._id || item.itemId);
                return (
                  <div key={index} className="order-item-row">
                    {imgSrc ? (
                      <img src={imgSrc} alt={item.name} />
                    ) : (
                      <div
                        style={{
                          width: 62,
                          height: 62,
                          borderRadius: 12,
                          background: "var(--border-color)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 22,
                          flexShrink: 0,
                        }}
                      >
                        🍽️
                      </div>
                    )}
                    <div className="order-item-info">
                      <p className="order-item-name">{item.name}</p>
                      <p className="order-item-qty">Qty: {item.quantity}</p>
                    </div>
                    <p className="order-item-price">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="order-card-footer">
              <div className="order-total-section">
                <p className="order-items-count">
                  {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                </p>
                <p className="order-total-amount">
                  Total: <span>${order.amount?.toFixed(2)}</span>
                </p>
              </div>
              <button className="track-order-btn" onClick={fetchOrders}>
                Refresh
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
