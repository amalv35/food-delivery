import React, { useContext, useState } from "react";
import "./navbar.css";
import { assets } from "../../assets/assets";
import ThemeToggle from "../Themes/theme"
import { Link } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

const Navbar = ({setShowLoginPopup}) => {
  const [menu, setMenu] = useState("home");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const {getTotalCartAmount} = useContext(StoreContext)
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
      {showSearch && (
  <input 
    type="text" 
    placeholder="Search..." 
    className="search-input"
    autoFocus
    onBlur={() => setShowSearch(false)}
  />
)}

<svg
  width={24}
  height={24}
  viewBox="0 0 24 24"
  fill="none"
  stroke="var(--text-primary)"
  strokeWidth="2"
  strokeLinecap="round"
  strokeLinejoin="round"
  className="search-icon-svg"
  onClick={() => setShowSearch(!showSearch)}
>
  <circle cx="11" cy="11" r="8" />
  <path d="m21 21-4.35-4.35" />
</svg>
        <div className="navbar-cart-container">
       <Link to='/cart'>   <img src={assets.basket_icon} alt="cart" /></Link>
          <div className={getTotalCartAmount()===0?"":"dot"}></div>
        </div>
          <ThemeToggle />
        <button className="signin-btn"
        onClick={() => setShowLoginPopup(true)}>Sign in</button>

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