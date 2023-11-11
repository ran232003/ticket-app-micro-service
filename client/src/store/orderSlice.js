import { createSlice } from "@reduxjs/toolkit";
const OrdertSlice = createSlice({
  name: "orders",
  initialState: { orders: [] },
  reducers: {
    setOrders(state, action) {
      state.orders = action.payload;
    },
    setOrder(state, action) {
      state.orders = action.payload;
    },
  },
});

export default OrdertSlice;

export const orderAction = OrdertSlice.actions;
