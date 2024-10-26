import axios from "axios";

const API_URL = "http://localhost:5001/orders/report";

const getOrderReport = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export default {
  getOrderReport,
};
