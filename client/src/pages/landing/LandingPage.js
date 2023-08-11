import React, { useEffect } from "react";
import { apiCall, getCurrentUser } from "../../apiCalls";
import { useSelector } from "react-redux";
import Button from "react-bootstrap/esm/Button";
import { createTicketUrl, getTicketUrl } from "../../URLS";

const LandingPage = (props) => {
  const user = useSelector((state) => {
    return state.auth.user;
  });
  const handleClick = async () => {
    const data = await apiCall("GET", getTicketUrl);
    console.log(data);
  };
  const handleClick2 = async () => {
    const data = await apiCall("POST", createTicketUrl, {
      title: "hello",
      price: "there",
    });
    console.log(data);
  };
  return (
    <div>
      landing {user.email}
      <Button onClick={handleClick}>getTickets</Button>
      <Button onClick={handleClick2}>create</Button>
    </div>
  );
};

export default LandingPage;
