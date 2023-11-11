import React from "react";
import { useSelector } from "react-redux";
import "./NavigationBar.css";
const TicketList = (props) => {
  const tickets = useSelector((state) => {
    return state.tickets;
  });
  console.log(tickets);
  if (tickets.tickets) {
    return (
      <div className="ticketListMain">
        <h1>Tickets</h1>
        <table className="table">
          <thead>
            <th>Title</th>
            <th>price</th>
          </thead>
          <tbody>
            {tickets.tickets.map((ticket) => {
              return (
                <tr className="ticketLisRow" key={ticket._id}>
                  <td>{ticket.title}</td>
                  <td>{ticket.price}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  } else {
    <div>
      <h1>No Tickets Available</h1>
    </div>;
  }
};

export default TicketList;
