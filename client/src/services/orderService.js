import axios from "axios";

const API_URL = "http://localhost:5001/orders/";

const createOrder = async (user_id, items) => {
  const total_price = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const response = await axios.post(API_URL, { user_id, total_price });
  const orderId = response.data.order_id;

  // Looping untuk menambah item pesanan
  for (const item of items) {
    await axios.post(`${API_URL}${orderId}/items`, {
      product_id: item.id,
      quantity: item.quantity,
      price: item.price,
    });
  }

  return response.data;
};

export default {
  createOrder,
};
