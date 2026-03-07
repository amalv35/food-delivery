import React, { useEffect, useState } from "react";
import "./list.css";
import axios from "axios";
import { toast } from "react-toastify";

const List = ({url}) => {
  const [list, setList] = useState([]);

 

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      console.log(response.data);
      if (response.data.success) {
        setList(response.data.data);

        toast.success("Food list loaded successfully ");
      } else {
        toast.error("Failed to load food list");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    }
  };
  const removeFoodItem = async (foodId) => {
    const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
    await fetchList();
    if (response.data.success) {
      toast.success("Food item removed successfully");
    } else {
      toast.error("Failed to remove food item");
    }
    
  }

  useEffect(() => {
    (async () => {
      await fetchList();
    })();
  }, []);

  return (
    <div className="list add flex col">
      <p>all food list</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>image</b>
          <b>name</b>
          <b>category</b>
          <b>price</b>
          <b>action</b>
        </div>

        {list.map((item, index) => {
          return (
            <div className="list-table-format" key={index}>
              <img src={`${url}/images/${item.image}`} alt={item.name} />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>${item.price}</p>
              <p onClick={() => removeFoodItem(item._id)} className="cursor">x</p> 
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default List;
