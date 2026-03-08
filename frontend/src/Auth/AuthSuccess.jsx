import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { StoreContext } from "../context/StoreContext";

const AuthSuccess = () => {
  const [params]              = useSearchParams();
  const navigate              = useNavigate();
  const { setToken, fetchCart } = useContext(StoreContext);

  useEffect(() => {
    const token = params.get("token");
    if (token) {
      setToken(token);
      localStorage.setItem("token", token);
      fetchCart(token);
      navigate("/");        
    } else {
      navigate("/");       
    }
  }, []);

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      color: "white"
    }}>
      <p>Signing you in...</p>
    </div>
  );
};

export default AuthSuccess;