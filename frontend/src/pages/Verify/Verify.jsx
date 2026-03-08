import React, { useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import "./Verify.css";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const navigate = useNavigate();
  const { url } = useContext(StoreContext);

  const verifyPayment = async () => {
    try {
      const response = await axios.post(`${url}/api/order/verify`, {
        success,
        orderId,
      });
      4;

      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (response.data.success) {
        navigate("/myorders");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Verification failed:", error);
      navigate("/");
    }
  };

  useEffect(() => {
    verifyPayment();
  }, []);

  return (
    <div className="verify">
      <div className="spinner"></div>
      <p className="verify-text">Verifying your payment...</p>
    </div>
  );
};

export default Verify;
