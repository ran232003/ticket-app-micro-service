import React, { useEffect } from "react";
import { getCurrentUser } from "../../apiCalls";
import { useSelector } from "react-redux";

const LandingPage = (props) => {
  const user = useSelector((state) => {
    return state.auth.user;
  });
  return <div>landing {user.email}</div>;
};

export default LandingPage;
