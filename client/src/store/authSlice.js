import { createSlice } from "@reduxjs/toolkit";
const AuthSlice = createSlice({
  name: "auth",
  initialState: { user: null, friends: [], isLoggin: null },
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    setLogin(state, action) {
      state.isLoggin = true;
    },
    setLogout(state) {
      state.isLoggin = false;
    },
    removeUser(state) {
      state.user = null;
    },
    setFriends(state, action) {
      state.friends = action.payload;
    },
  },
});

export default AuthSlice;

export const authAction = AuthSlice.actions;
