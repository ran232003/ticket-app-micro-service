import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = (props) => {
  const isLoggin = useSelector((state) => {
    return state.auth.isLoggin;
  });
  console.log(isLoggin);
  // const user2 = props.user;
  // const u = props.u;

  return isLoggin ? <Outlet /> : <Navigate to="/auth/login" />;
};

export default ProtectedRoutes;
