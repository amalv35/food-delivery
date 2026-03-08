import React from "react";
import "./SideBar.css";
import { CiCirclePlus } from "react-icons/ci";
import { FaClipboardList } from "react-icons/fa";
import { FaLuggageCart, FaChartLine } from "react-icons/fa";
import { NavLink } from "react-router-dom";
const SideBar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-options">
        <NavLink to="/add" className="sidebar-option">
          <CiCirclePlus className="sidebar-icon" />
          <span className="sidebar-text">Add Item</span>
        </NavLink>
        <NavLink to="/list" className="sidebar-option">
          <FaClipboardList className="sidebar-icon" />
          <span className="sidebar-text">List Item</span>
        </NavLink>
        <NavLink to="/orders" className="sidebar-option">
          <FaLuggageCart className="sidebar-icon" />
          <span className="sidebar-text">orders</span>
        </NavLink>
        <NavLink to="/revenue" className="sidebar-option">
          <FaChartLine className="sidebar-icon" />
          <span className="sidebar-text">revenue</span>
        </NavLink>
      </div>
    </div>
  );
};

export default SideBar;
