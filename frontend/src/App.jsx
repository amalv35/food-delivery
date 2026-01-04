import React, { useState } from "react";
import Navbar from "./components/navbar/navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Footer from "./components/Footer/Footer";
import LoginPopup from "./components/LoginPopup/LoginPopup";

const App = () => {
  
const [showLoginPopup, setShowLoginPopup] = useState(false);

  return (
    <>
    {showLoginPopup?<LoginPopup isOpen={showLoginPopup} 
        onClose={() => setShowLoginPopup(false)}  />:<></>}
      <div className="app">
        <Navbar setShowLoginPopup={setShowLoginPopup} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<PlaceOrder />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;
