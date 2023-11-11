import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import "./NavigationBar.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useNavigate } from "react-router-dom";
const OrdersTable = (props) => {
  const handleViewCellClicked = (params) => {
    const rowData = params.data; // This contains the data for the clicked row
    console.log("Clicked Row Data:", rowData);

    // Do whatever you need with the rowData, e.g., show a modal or perform an action
  };
  const columnDefs = [
    { headerName: "Title", field: "ticket.title", filter: true },
    { headerName: "Price", field: "ticket.price", filter: true },
    { headerName: "Status", field: "status", filter: true },
    {
      headerName: "Link",
      cellRenderer: CustomViewCellRenderer,
      filter: false,
      cellRendererParams: {
        onCellClicked: handleViewCellClicked,
      },
    },
  ];

  const defaultColDef = useMemo(() => ({
    sortable: true,
    flex: 1,
  }));
  const orders = useSelector((state) => {
    return state.orders;
  });
  console.log(orders, "test2", orders.orders);
  if (orders.orders.length > 0) {
    return (
      <div
        style={{ height: "100vh", width: "90vw" }}
        className="ticketListMain"
      >
        <h1>Orders</h1>
        <div
          className="ag-theme-alpine"
          style={{ height: "100%", width: "100%" }}
        >
          <AgGridReact
            defaultColDef={defaultColDef}
            rowData={orders.orders}
            columnDefs={columnDefs}
          />
        </div>
      </div>
    );
  } else {
    return (
      <div className="ticketListMain">
        <h1>No Orders Available</h1>
      </div>
    );
  }
};
const CustomViewCellRenderer = (props) => {
  const navigate = useNavigate();
  const handleClick = () => {
    const rowData = props.data; // This contains the data for the clicked row
    console.log("test Clicked Row Data:", rowData);
    navigate(`/orders/${rowData.ticket._id}`, { state: { order: rowData } });
  };

  return (
    <span
      onClick={handleClick}
      style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}
    >
      View
    </span>
  );
};
export default OrdersTable;
