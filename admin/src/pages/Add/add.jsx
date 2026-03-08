import React, { useState } from "react";
import "./add.css";
import { MdCloudUpload, MdClose } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";

const Add = ({ url }) => {
  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Salad",
    prepTime: 15,
  });

  const removeImage = (e) => {
    e.preventDefault();
    setImage(false);
  };

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category", data.category);
    formData.append("prepTime", Number(data.prepTime));
    formData.append("image", image);

    const response = await axios.post(`${url}/api/food/add`, formData);
    if (response.data.success) {
      setData({
        name: "",
        description: "",
        price: "",
        category: "Salad",
        prepTime: 15,
      });
      setImage(false);
      toast.success(`response : ${response.data.message}`);
    } else {
      toast.error(`response: ${response.data.message}`);
    }
  };

  return (
    <div className="add">
      <form className="flex-col" onSubmit={onSubmitHandler}>
        <div className="add-img-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="image">
            {image ? (
              <div className="image-preview-wrapper">
                <img src={URL.createObjectURL(image)} alt="preview" />
                <button onClick={removeImage} className="remove-img-btn">
                  <MdClose />
                </button>
              </div>
            ) : (
              <MdCloudUpload />
            )}
          </label>
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            hidden
            required
          />
        </div>

        <div className="add-form-inputs flex-col">
          <p>Product Name</p>
          <input
            onChange={onChangeHandler}
            value={data.name}
            type="text"
            name="name"
            placeholder="Type here"
          />
        </div>

        <div className="add-product-description flex-col">
          <p>Product Description</p>
          <textarea
            name="description"
            onChange={onChangeHandler}
            value={data.description}
            rows="6"
            placeholder="Write content here"
            required
          ></textarea>
        </div>

        <div className="add-category-size flex-col">
          <p>Product Category</p>
          <select
            onChange={onChangeHandler}
            value={data.category}
            name="category"
          >
            <option value="Salad">Salad</option>
            <option value="Rolls">Rolls</option>
            <option value="Desert">Desert</option>
            <option value="Sandwich">Sandwich</option>
            <option value="Cake">Cake</option>
            <option value="Pure Veg">Pure Veg</option>
            <option value="Pasta">Pasta</option>
            <option value="Noodles">Noodles</option>
          </select>
        </div>

        <div className="add-price flex-col">
          <p>Product Price</p>
          <input
            onChange={onChangeHandler}
            value={data.price}
            type="number"
            name="price"
            placeholder="$20"
          />
        </div>

        <div className="add-price flex-col">
          <p>Preparation Time (minutes)</p>
          <input
            onChange={onChangeHandler}
            value={data.prepTime}
            type="number"
            name="prepTime"
            placeholder="e.g. 20"
            min="1"
            max="120"
          />
        </div>

        <button type="submit" className="add-btn">
          ADD
        </button>
      </form>
    </div>
  );
};

export default Add;
