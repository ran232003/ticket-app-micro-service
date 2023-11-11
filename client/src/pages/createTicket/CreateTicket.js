import "./CreateTicket.css";
import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import { Formik, Field } from "formik";
import Button from "react-bootstrap/Button";

import * as Yup from "yup";
import ToastMessage from "../../components/ToastMessage";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createTicketUrl } from "../../URLS";
import { apiCall } from "../../apiCalls";
const CreateTicket = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState({
    message: "",
    color: "",
  });
  const initialValues = {
    title: "",
    price: null,
  };
  const SignupSchema = Yup.object().shape({
    title: Yup.string()

      .max(50, "*Title must be less than 100 characters")
      .required("*Title is required"),
    price: Yup.number("*Price Must Be A Number")
      .positive("*Price Must Be Greater Than Zero")
      .required("*Price is reqiuerd"),
  });
  const handleFormSubmit = async (values, errors) => {
    const data = await apiCall("POST", createTicketUrl, values);
    if (data.status === "fail") {
      setErrorMessage(data.message);
    } else {
      //moving to next page

      return navigate("/landing");
    }
  };
  const nullErrorMessage = () => {
    setErrorMessage({ message: "", color: "" });
  };
  return (
    <div className="createTicket">
      <div className="ticketHeader">
        <h1>Create A Ticket</h1>
      </div>
      <div className="form">
        <Formik
          validationSchema={SignupSchema}
          initialValues={initialValues}
          onSubmit={handleFormSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
            setFieldValue,
            resetForm,
          }) => (
            <Form
              onSubmit={handleSubmit}
              className="inputs"
              style={{ marginTop: "60px" }}
            >
              <Form.Group
                className="mx-auto inp"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.title}
                  name="title"
                  error={!!touched.title && !!errors.title}
                  className={touched.title && errors.title ? "error" : null}
                />
                {touched.title && errors.title ? (
                  <div className="error-message">{errors.title}</div>
                ) : null}
              </Form.Group>

              <Form.Group
                className="mb-3 inp"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Price</Form.Label>
                <Form.Control
                  name="price"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.price}
                  className={touched.price && errors.price ? "error" : null}
                  type="number"
                  placeholder="Price"
                />
                {touched.price && errors.price ? (
                  <div className="error-message">{errors.price}</div>
                ) : null}
              </Form.Group>
              <Button
                type="submit"
                className="btnCreateTicket"
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </Form>
          )}
        </Formik>
      </div>
      {errorMessage.message ? (
        <div style={{ display: "block" }} className="toast">
          <ToastMessage
            nullErrorMessage={nullErrorMessage}
            errorMessage={errorMessage.message}
            color={errorMessage.color}
          />
        </div>
      ) : null}
    </div>
  );
};

export default CreateTicket;
