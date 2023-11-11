import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import "./NavigationBar.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signout } from "../apiCalls";
import { authAction } from "../store/authSlice";
const NavigationBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggin = useSelector((state) => {
    return state.auth.isLoggin;
  });
  const handleSignOut = async () => {
    const data = await signout();
    if (data.status === "ok") {
      dispatch(authAction.setLogout());
      dispatch(authAction.setUser(null));

      return navigate("/auth/login");
    }
  };
  console.log("isLoggin", isLoggin);
  return (
    <Navbar bg="light" expand="lg" className="navbar">
      <Navbar.Brand as={Link} to="/landing" className="brand">
        Tickets
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        {isLoggin ? (
          <Nav className="me-auto">
            <Nav.Link as={Link} className="navLink" to="/orders">
              My Orders
            </Nav.Link>
            <Nav.Link className="navLink" as={Link} to="/createTicket">
              Sell Tickets
            </Nav.Link>
            <Nav.Link onClick={handleSignOut} className="navLink" as={Link}>
              SignOut
            </Nav.Link>
          </Nav>
        ) : (
          <Nav className="me-auto">
            <Nav.Link className="navLink" as={Link} to="/auth/signup">
              SignUp
            </Nav.Link>
            <Nav.Link className="navLink" as={Link} to="/auth/login">
              Login
            </Nav.Link>
          </Nav>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavigationBar;
