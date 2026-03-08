import React, { useState } from "react";
import Navbar from "./components/navbar/navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Footer from "./components/Footer/Footer";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Verify from "./pages/Verify/Verify";
import MyOrders from "../pages/MyOrders/MyOrders.";
import AuthSuccess from "./Auth/AuthSuccess";
import ChatBot from "./components/ChatBot/ChatBot";

const App = () => {
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  return (
    <>
      {showLoginPopup ? (
        <LoginPopup
          isOpen={showLoginPopup}
          onClose={() => setShowLoginPopup(false)}
        />
      ) : (
        <></>
      )}
      <div className="app">
        <ToastContainer />
        <Navbar setShowLoginPopup={setShowLoginPopup} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<PlaceOrder />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="*" element={<MyOrders />} />
          <Route path="/auth/success" element={<AuthSuccess />} />
        </Routes>
      </div>
      <Footer />
      <ChatBot /> 
    </>
  );
};

export default App;
