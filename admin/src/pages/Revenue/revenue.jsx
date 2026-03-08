import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { FaRupeeSign } from "react-icons/fa";
import { MdShoppingBag, MdFastfood, MdTrendingUp } from "react-icons/md";
import "./revenue.css";

const Revenue = ({ url }) => {
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState("line"); // "line" | "bar"

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const res = await axios.get(`${url}/api/order/revenue`);
        if (res.data.success) {
          // Sort oldest → newest for chart
          const sorted = [...res.data.data].sort((a, b) =>
            a.month.localeCompare(b.month),
          );
          setRevenueData(sorted);
        } else {
          setError("Failed to load revenue data.");
        }
      } catch (err) {
        setError("Error connecting to server.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRevenue();
  }, [url]);

  if (loading) {
    return (
      <div className="revenue">
        <p className="revenue-title">Revenue & Statistics</p>
        <div className="revenue-loading">
          <div className="revenue-spinner" />
          <p>Loading revenue data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="revenue">
        <p className="revenue-title">Revenue & Statistics</p>
        <div className="revenue-empty">
          <p style={{ color: "#dc3545" }}>⚠️ {error}</p>
        </div>
      </div>
    );
  }

  if (revenueData.length === 0) {
    return (
      <div className="revenue">
        <p className="revenue-title">Revenue & Statistics</p>
        <div className="revenue-empty">
          <MdTrendingUp style={{ fontSize: 48, color: "#333" }} />
          <p>No revenue data yet. Orders will appear here after delivery.</p>
        </div>
      </div>
    );
  }

  // ── Aggregate totals ──
  const totalRevenue = revenueData.reduce((s, m) => s + m.totalRevenue, 0);
  const totalOrders = revenueData.reduce((s, m) => s + m.totalOrders, 0);
  const totalItems = revenueData.reduce((s, m) => s + m.totalItems, 0);
  const avgOrderVal = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // ── Category breakdown across all months ──
  const allCategories = {};
  revenueData.forEach((m) => {
    Object.entries(m.categoryBreakdown || {}).forEach(([cat, val]) => {
      allCategories[cat] = (allCategories[cat] || 0) + val;
    });
  });
  const maxCatVal = Math.max(...Object.values(allCategories), 1);
  const sortedCats = Object.entries(allCategories).sort((a, b) => b[1] - a[1]);

  // ── Chart data ──
  const chartData = revenueData.map((m) => ({
    month: m.month,
    Revenue: parseFloat(m.totalRevenue.toFixed(2)),
    Orders: m.totalOrders,
  }));

  // Recent months (last 6, newest first)
  const recentMonths = [...revenueData].reverse().slice(0, 6);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            background: "#1a1a2e",
            border: "1px solid #ff6b35",
            borderRadius: 10,
            padding: "12px 16px",
            fontSize: 13,
          }}
        >
          <p style={{ color: "#ff6b35", fontWeight: 700, margin: "0 0 8px" }}>
            {label}
          </p>
          {payload.map((p) => (
            <p key={p.name} style={{ color: p.color, margin: "4px 0" }}>
              {p.name}:{" "}
              {p.name === "Revenue" ? `₹${p.value.toLocaleString()}` : p.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="revenue">
      <p className="revenue-title">Revenue & Statistics</p>

      {/* ── Stat Cards ── */}
      <div className="revenue-cards">
        <div className="revenue-card">
          <FaRupeeSign className="revenue-card-icon" />
          <span className="revenue-card-label">Total Revenue</span>
          <span className="revenue-card-value accent">
            ₹
            {totalRevenue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
          </span>
          <span className="revenue-card-sub">All time</span>
        </div>

        <div className="revenue-card">
          <MdShoppingBag className="revenue-card-icon" />
          <span className="revenue-card-label">Total Orders</span>
          <span className="revenue-card-value">
            {totalOrders.toLocaleString()}
          </span>
          <span className="revenue-card-sub">Delivered & paid</span>
        </div>

        <div className="revenue-card">
          <MdFastfood className="revenue-card-icon" />
          <span className="revenue-card-label">Items Sold</span>
          <span className="revenue-card-value">
            {totalItems.toLocaleString()}
          </span>
          <span className="revenue-card-sub">Across all orders</span>
        </div>

        <div className="revenue-card">
          <MdTrendingUp className="revenue-card-icon" />
          <span className="revenue-card-label">Avg Order Value</span>
          <span className="revenue-card-value accent">
            ₹{avgOrderVal.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
          </span>
          <span className="revenue-card-sub">Per order</span>
        </div>
      </div>

      {/* ── Chart ── */}
      <div className="revenue-chart-section">
        <div className="revenue-chart-header">
          <h3>Monthly Revenue</h3>
          <div className="revenue-chart-tabs">
            <button
              className={`revenue-tab ${chartType === "line" ? "active" : ""}`}
              onClick={() => setChartType("line")}
            >
              Line
            </button>
            <button
              className={`revenue-tab ${chartType === "bar" ? "active" : ""}`}
              onClick={() => setChartType("bar")}
            >
              Bar
            </button>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={280}>
          {chartType === "line" ? (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
              <XAxis
                dataKey="month"
                stroke="#555"
                tick={{ fill: "#888", fontSize: 12 }}
              />
              <YAxis stroke="#555" tick={{ fill: "#888", fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: "#888", fontSize: 13 }} />
              <Line
                type="monotone"
                dataKey="Revenue"
                stroke="#ff6b35"
                strokeWidth={2.5}
                dot={{ fill: "#ff6b35", r: 4 }}
                activeDot={{ r: 7 }}
              />
              <Line
                type="monotone"
                dataKey="Orders"
                stroke="#ffc107"
                strokeWidth={2}
                dot={{ fill: "#ffc107", r: 3 }}
              />
            </LineChart>
          ) : (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
              <XAxis
                dataKey="month"
                stroke="#555"
                tick={{ fill: "#888", fontSize: 12 }}
              />
              <YAxis stroke="#555" tick={{ fill: "#888", fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: "#888", fontSize: 13 }} />
              <Bar dataKey="Revenue" fill="#ff6b35" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Orders" fill="#ffc107" radius={[6, 6, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* ── Bottom: Category + Recent Months ── */}
      <div className="revenue-bottom">
        {/* Category Breakdown */}
        <div className="revenue-panel">
          <h3>Revenue by Category</h3>
          {sortedCats.length === 0 ? (
            <p style={{ color: "#555", fontSize: 14 }}>No category data yet.</p>
          ) : (
            sortedCats.map(([cat, val]) => (
              <div key={cat} className="category-row">
                <div className="category-row-header">
                  <span>{cat}</span>
                  <span>
                    ₹{val.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                  </span>
                </div>
                <div className="category-bar-track">
                  <div
                    className="category-bar-fill"
                    style={{ width: `${(val / maxCatVal) * 100}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Recent Months Table */}
        <div className="revenue-panel">
          <h3>Recent Months</h3>
          <table className="revenue-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Orders</th>
                <th>Items</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {recentMonths.map((m) => (
                <tr key={m.month}>
                  <td>{m.month}</td>
                  <td>{m.totalOrders}</td>
                  <td>{m.totalItems}</td>
                  <td>
                    ₹
                    {m.totalRevenue.toLocaleString("en-IN", {
                      maximumFractionDigits: 0,
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Revenue;
