import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { io } from "socket.io-client";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const url = "http://localhost:8000";
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);
  const [socket, setSocket] = useState(null);

  const addToCart = async (itemId) => {
    if (!token) {
      toast.error("Please login to add items to cart");
      return;
    }
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
    await axios.post(
      `${url}/api/cart/add`,
      { itemId },
      { headers: { Authorization: `Bearer ${token}` } },
    );
  };

  const removeFromCart = async (itemId, clear = false) => {
    if (!token) {
      toast.error("Please login to manage your cart");
      return;
    }
    setCartItems((prev) => {
      const updated = { ...prev };
      if (clear || updated[itemId] <= 1) {
        delete updated[itemId];
      } else {
        updated[itemId] -= 1;
      }
      return updated;
    });
    if (clear) {
      await axios.post(
        `${url}/api/cart/clear`,
        { itemId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
    } else {
      await axios.post(
        `${url}/api/cart/remove`,
        { itemId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
    }
  };

  const fetchCart = async (currentToken) => {
    try {
      const response = await axios.get(`${url}/api/cart/items`, {
        headers: { Authorization: `Bearer ${currentToken}` },
      });
      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[item];
        }
      }
    }
    return totalAmount;
  };

  useEffect(() => {
    async function fetchFoodList() {
      try {
        const response = await axios.get(`${url}/api/food/list`);
        if (response.data.success) {
          setFoodList(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch food list:", error);
      }
    }
    fetchFoodList();
  }, []);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      fetchCart(savedToken);

      const newSocket = io(url);
      setSocket(newSocket);

      // decode JWT to get userId
      try {
        const decoded = JSON.parse(atob(savedToken.split(".")[1]));
        newSocket.emit("joinRoom", decoded.id);
      } catch (err) {
        console.error("Failed to decode token:", err);
      }
    }

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    fetchCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
    socket,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
