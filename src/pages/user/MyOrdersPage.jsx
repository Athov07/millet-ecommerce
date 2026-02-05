import { useEffect, useState } from "react";
import MyOrders from "../../components/profile/MyOrders";
import { getMyOrdersAPI } from "../../services/orderService";

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getMyOrdersAPI();
        setOrders(res.data.orders);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Loading orders...</p>;

  return <MyOrders orders={orders} />;
};

export default MyOrdersPage;
