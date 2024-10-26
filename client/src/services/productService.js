import axios from "axios";

const API_URL = "http://localhost:5001/products/";

const getAllProducts = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const addProduct = async (name, price, stock) => {
  const response = await axios.post(API_URL, { name, price, stock });
  return response.data;
};

export default {
  getAllProducts,
  addProduct,
};
