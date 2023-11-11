import React, { useEffect } from "react";
import { apiCall } from "../apiCalls";
import { getOrdersUrl } from "../URLS";
import { useDispatch } from "react-redux";
import { orderAction } from "../store/orderSlice";
import OrdersTable from "../components/OrdersTable";

const Orders = () => {
  const dispatch = useDispatch();
  const getOrders = async () => {
    const data = await apiCall("GET", getOrdersUrl);
    if (!data.status === "ok") {
      return;
    }
    dispatch(orderAction.setOrders(data.orders));
  };
  useEffect(() => {
    getOrders();
  }, []);
  return (
    <div>
      <OrdersTable />
    </div>
  );
};

export default Orders;
