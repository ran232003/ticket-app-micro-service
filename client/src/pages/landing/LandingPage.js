import React, { useEffect } from "react";
import { apiCall, getCurrentUser } from "../../apiCalls";
import { useDispatch, useSelector } from "react-redux";
import Button from "react-bootstrap/esm/Button";
import { createTicketUrl, getTicketUrl } from "../../URLS";
import TicketList from "../../components/TicketList";
import { ticketAction } from "../../store/ticketSlice";
import TicketsTable from "../../components/TicketsTable";

const LandingPage = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => {
    return state.auth.user;
  });
  const getTickets = async () => {
    const data = await apiCall("GET", getTicketUrl);
    console.log(data);
    if (data.msg === "fail") {
      return;
    }
    dispatch(ticketAction.setTickets(data.tickets));
  };
  useEffect(() => {
    getTickets();
  }, []);
  const handleClick = async () => {
    const data = await apiCall("GET", getTicketUrl);
    console.log(data);
  };
  const handleClick2 = async () => {
    const data = await apiCall("POST", createTicketUrl, {
      title: "hello",
      price: 123,
    });
    console.log(data);
  };
  return (
    <div>
      <TicketsTable />
    </div>
  );
};

export default LandingPage;
