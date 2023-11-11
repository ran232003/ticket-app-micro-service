import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { apiCall } from "../apiCalls";
import { createOrderUrl } from "../URLS";
import { useDispatch } from "react-redux";
import { orderAction } from "../store/orderSlice";

const Ticket = () => {
  const [ticketReserved, setTicketReserved] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const rndInt = Math.floor(Math.random() * 3) + 1;
  const location = useLocation();
  const handleClick = async () => {
    const payload = { ticketId: location.state.ticket._id };
    const data = await apiCall("POST", createOrderUrl, payload);
    if (data.status !== "ok") {
      return setTicketReserved(true);
    }
    dispatch(orderAction.setOrder(data.order));
    dispatch(orderAction.setOrders(data.orders));
    navigate(`/orders/${data.order._id}`, { state: { order: data.order } });
    return setTicketReserved(false);
  };
  return (
    <div className="mainTicket">
      <div className="ticketCard">
        <h2 className="headline">Ticket Details</h2>
        <hr />
        <div className="data">
          <div className="mainImageTicket">
            <img
              src={require(`../../public/pics/${rndInt}.jpeg`)}
              className="imgTicketDetail"
              alt="missing Ticket"
            />
          </div>
          <div className="mainTicketData">
            <div>
              <h4>{location.state.ticket.title}</h4>
            </div>
            <div>
              <span>
                is simply dummy text of the printing and typesetting industry.
                Lorem Ipsum has been the industry's standard dummy text ever
                since the 1500s, when an unknown printer took a galley
              </span>{" "}
            </div>
            <div className="price">
              <h4>Price:&nbsp;{location.state.ticket.price}$</h4>
            </div>{" "}
            {ticketReserved === true ? (
              <h2 style={{ color: "red" }}>Sorry, Ticket is Reserved....</h2>
            ) : null}
            <Button variant="primary" onClick={handleClick}>
              Purchase
            </Button>{" "}
          </div>
        </div>
      </div>{" "}
    </div>
  );
};

export default Ticket;
