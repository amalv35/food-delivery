import React, { useState } from "react";
import "./navbar.css";
import { assets } from "../../assets/assets";

const Navbar = () => {
  const [menu, setMenu] = useState("home");
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <nav className="navbar">
      <img src={assets.logo} alt="logo" className="logo" />

      {/* The navbar menu now toggles a class based on state */}
      <ul className={`navbar-menu ${showMobileMenu ? "mobile-visible" : ""}`}>
        <li 
          onClick={() => { setMenu("home"); setShowMobileMenu(false); }} 
          className={menu === "home" ? "active" : ""}
        >
          Home
        </li>
        <li 
          onClick={() => { setMenu("menu"); setShowMobileMenu(false); }} 
          className={menu === "menu" ? "active" : ""}
        >
          Menu
        </li>
        <li 
          onClick={() => { setMenu("mobile-app"); setShowMobileMenu(false); }} 
          className={menu === "mobile-app" ? "active" : ""}
        >
          Mobile-app
        </li>
        <li 
          onClick={() => { setMenu("contact-us"); setShowMobileMenu(false); }} 
          className={menu === "contact-us" ? "active" : ""}
        >
          Contact us
        </li>
      </ul>

      <div className="navbar-right">
        <img src={assets.search_icon} alt="search" className="search-icon-img" />
        <div className="navbar-cart-container">
          <img src={assets.basket_icon} alt="cart" />
          <div className="dot"></div>
        </div>
        <button className="signin-btn">Sign in</button>

        {/* Hamburger Menu Icon (Visible only on mobile) */}
        <div className="hamburger" onClick={() => setShowMobileMenu(!showMobileMenu)}>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;