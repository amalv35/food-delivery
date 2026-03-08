import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import "./order.css";
import { FaUser } from "react-icons/fa";

const statusClassMap = {
  Pending: "pending",
  "Food Processing": "food-processing",
  "Out for Delivery": "out-for-delivery",
  Delivered: "delivered",
  Cancelled: "cancelled",
};

const MANUAL_STATUSES = ["Out for Delivery", "Delivered", "Cancelled"];

const Order = ({ url }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${url}/api/order/list`);
      if (res.data.success) {
        setOrders(res.data.data);
      } else {
        setError("Failed to load orders.");
      }
    } catch (err) {
      setError("Error connecting to server.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    setOrders((prev) =>
      prev.map((o) => (o._id === orderId ? { ...o, status } : o)),
    );
    try {
      const res = await axios.post(`${url}/api/order/status`, {
        orderId,
        status,
      });
      if (res.data.success) {
        toast.success("Order status updated");
      } else {
        toast.error("Failed to update status");
        fetchOrders();
      }
    } catch (err) {
      toast.error("Error updating status");
      fetchOrders();
    }
  };

  const handleDelete = async (orderId) => {
    if (
      !window.confirm("Delete this order? Revenue will be saved if delivered.")
    )
      return;
    try {
      const res = await axios.post(`${url}/api/order/delete`, { orderId });
      if (res.data.success) {
        setOrders((prev) => prev.filter((o) => o._id !== orderId));
        toast.success("Order deleted successfully");
      } else {
        toast.error("Failed to delete order");
      }
    } catch (err) {
      toast.error("Error deleting order");
      console.error(err);
    }
  };

  useEffect(() => {
    const socket = io(url);

    socket.on("connect", () => {
      socket.emit("joinRoom", "admin");
    });

    socket.on("orderStatusUpdate", ({ orderId, status }) => {
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status } : o)),
      );
      toast.info(`Order auto-updated → ${status}`, {
        position: "bottom-right",
        autoClose: 3000,
      });
    });

    socket.on("orderDeleted", ({ orderId }) => {
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
      toast.info("An old order was auto-deleted", {
        position: "bottom-right",
        autoClose: 3000,
      });
    });

    return () => socket.disconnect();
  }, [url]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatItems = (items = []) =>
    items.map((i) => `${i.name} x${i.quantity}`).join(", ");

  const renderStatusControl = (order) => {
    const status = order.status || "Pending";
    const isAutoManaged = status === "Pending" || status === "Food Processing";
    const isFinalState = status === "Delivered" || status === "Cancelled";

    if (isAutoManaged) {
      return (
        <div className={`auto-status-badge ${statusClassMap[status]}`}>
          <span className="auto-dot" />
          {status}
          <span className="auto-label">auto</span>
        </div>
      );
    }

    if (isFinalState) {
      return (
        <div className={`auto-status-badge ${statusClassMap[status]}`}>
          <span className="auto-dot" />
          {status}
        </div>
      );
    }

    return (
      <select
        className={`order-status-select ${statusClassMap[status]}`}
        value={status}
        onChange={(e) => updateStatus(order._id, e.target.value)}
      >
        {MANUAL_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    );
  };

  if (loading) {
    return (
      <div className="order">
        <p>All Orders</p>
        <div className="order-spinner" />
        <p className="order-status-msg">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order">
        <p>All Orders</p>
        <p className="order-status-msg">⚠️ {error}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="order">
        <p>All Orders</p>
        <p className="order-status-msg">No orders found.</p>
      </div>
    );
  }

  return (
    <div className="order">
      <p>All Orders</p>
      <div className="order-table">
        <div className="order-table-format title">
          <b>Icon</b>
          <b>User</b>
          <b>Items</b>
          <b>Total</b>
          <b>Payment</b>
          <b>Status</b>
          <b>Del</b>
        </div>

        {orders.map((order) => (
          <div key={order._id} className="order-table-format">
            <FaUser className="order-icon" />

            <div className="order-user-info">
              <span>{order.userId?.name || "N/A"}</span>
              <span>{order.userId?.email || ""}</span>
            </div>

            <p className="order-items-text">{formatItems(order.items)}</p>

            <p>${order.amount?.toFixed(2)}</p>

            <span
              className={`payment-badge ${order.payment ? "paid" : "unpaid"}`}
            >
              {order.payment ? "Paid" : "Unpaid"}
            </span>

            {renderStatusControl(order)}

            <p onClick={() => handleDelete(order._id)} title="Delete order">
              ✕
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Order;
