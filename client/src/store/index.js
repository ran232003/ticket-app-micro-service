import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./authSlice";
import LoadingSlice from "./loadingSlice";

const store = configureStore({
  reducer: {
    auth: AuthSlice.reducer,
    loading: LoadingSlice.reducer,
  },
});
export default store;
