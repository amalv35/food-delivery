import React, { useContext, useState } from "react";
import "./navbar.css";
import { assets } from "../../assets/assets";
import ThemeToggle from "../Themes/theme";
import { Link, useNavigate } from "react-router-dom"; 
import { StoreContext } from "../../context/StoreContext";

const Navbar = ({ setShowLoginPopup }) => {
  const [menu, setMenu] = useState("home");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
  
  const navigate = useNavigate(); 

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/"); // Redirect to home page
  };

  return (
    <nav className="navbar">
      <Link to='/'> <img src={assets.logo} alt="logo" className="logo" /> </Link>

      <ul className={`navbar-menu ${showMobileMenu ? "mobile-visible" : ""}`}>
        <Link to='/'
          onClick={() => { setMenu("home"); setShowMobileMenu(false); }}
          className={menu === "home" ? "active" : ""}
        >
          Home
        </Link>
        <a href='#explore-menu'
          onClick={() => { setMenu("menu"); setShowMobileMenu(false); }}
          className={menu === "menu" ? "active" : ""}
        >
          Menu
        </a>
        <a href='#app-download'
          onClick={() => { setMenu("mobile-app"); setShowMobileMenu(false); }}
          className={menu === "mobile-app" ? "active" : ""}
        >
          Mobile-app
        </a>
        <a href='#footer'
          onClick={() => { setMenu("contact-us"); setShowMobileMenu(false); }}
          className={menu === "contact-us" ? "active" : ""}
        >
          Contact us
        </a>
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

        <div className="search-icon" onClick={() => setShowSearch(!showSearch)}>
          {/* Using an SVG or the asset search icon */}
          <img src={assets.search_icon} alt="" />
        </div>

        <div className="navbar-search-icon">
          <Link to='/cart'> <img src={assets.basket_icon} alt="cart" /> </Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>
        
        <ThemeToggle />

        {!token ? (
          <button className="signin-btn" onClick={() => setShowLoginPopup(true)}>
            Sign in
          </button>
        ) : (
          <div className="navbar-profile">
            <img src={assets.profile_icon} alt="" />
            <ul className="nav-profile-dropdown">
              <li onClick={()=>navigate('/myorders')}>
                <img src={assets.bag_icon} alt="" />
                <p>Orders</p>
              </li>
              <hr />
              <li onClick={logout}>
                <img src={assets.logout_icon} alt="" />
                <p>Logout</p>
              </li>
            </ul>
          </div>
        )}

        {/* Hamburger Menu Icon */}
        <div
          className="hamburger"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;