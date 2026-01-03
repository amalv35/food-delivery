import React from "react";
import "./footer.css";
import { assets } from "../../assets/assets";

const Footer = () => {
  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
            <img src={assets.logo} alt="" />
            <p>jhasjhjhbcjhzxbcjhxhcbzxjhcbzjxbcjhzxbcjhzxbjchzxbjhcbzjcbzjhbcjzhbxcj</p>
           <div className="footer-social-icons">
            <img src={assets.facebook_icon} alt="facebook" />   
            <img src={assets.twitter_icon} alt="twitter" />
            <img src={assets.linkedin_icon} alt="linkedIn" />
           </div>
        </div>
                <div className="footer-content-center">
                    <h2>COMPANY</h2>
                    <ul>
                        <li>Home</li>
                        <li>About Us</li>
                        <li>Delivery</li>
                        <li>Privacy Policy</li>
                    </ul>
                </div>
        <div className="footer-content-right">
        <h2>GET IN TOUCH</h2>
        <ul>
        <li>1234567890</li>
        <li>amal@contact.com</li>
        </ul>
        </div>
      
      </div>
      <hr />
      <p className="footer-copyright">copyright 2025 @ amal.com - all rights reserved</p>
    </div>
  );
};

export default Footer;
