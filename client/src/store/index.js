import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./authSlice";
import LoadingSlice from "./loadingSlice";
import TicketSlice from "./ticketSlice";
import OrdertSlice from "./orderSlice";

const store = configureStore({
  reducer: {
    auth: AuthSlice.reducer,
    loading: LoadingSlice.reducer,
    tickets: TicketSlice.reducer,
    orders: OrdertSlice.reducer,
  },
});
export default store; //
