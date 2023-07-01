import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import "./Auth.css";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import Button from "react-bootstrap/esm/Button";
import { login, signUp } from "../../apiCalls";
import ToastMessage from "../../components/ToastMessage";
import { useDispatch } from "react-redux";
import { authAction } from "../../store/authSlice";
const Auth = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let { status } = useParams();
  const [errorMessage, setErrorMessage] = useState("");
  status = status.toUpperCase();
  const initialValues = {
    email: "",
    password: "",
  };
  const SignupSchema = Yup.object().shape({
    email: Yup.string()
      .email("Not Valid Email")
      .max(100, "*Email must be less than 100 characters")
      .required("*Email is required"),
    password: Yup.string()
      .min(6, "Password must be more then 6 characters")
      .max(40, "Password can't be longer than 40 characters"),
  });
  const handleFormSubmit = async (values, errors) => {
    let data;
    if (status === "LOGIN") {
      data = await login(values);
    } else {
      data = await signUp(values);
    }
    if (data.status === "fail") {
      setErrorMessage(data.message);
    } else {
      //moving to next page
      dispatch(authAction.setUser(data.user));
      dispatch(authAction.setLogin());
      navigate("/landing");
    }
  };
  const nullErrorMessage = () => {
    setErrorMessage(null);
  };
  return (
    <div className="mainAuth">
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
              <div className="header">
                <h2>{status}</h2>
              </div>

              <Form.Group
                className="mx-auto inp"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  name="email"
                  error={!!touched.email && !!errors.email}
                  placeholder="name@example.com"
                  className={touched.email && errors.email ? "error" : null}
                />
                {touched.email && errors.email ? (
                  <div className="error-message">{errors.email}</div>
                ) : null}
              </Form.Group>

              <Form.Group
                className="mb-3 inp"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Password</Form.Label>
                <Form.Control
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  className={
                    touched.password && errors.password ? "error" : null
                  }
                  type="password"
                  placeholder="Password"
                />
                {touched.password && errors.password ? (
                  <div className="error-message">{errors.password}</div>
                ) : null}
              </Form.Group>
              <Button type="submit" onClick={handleSubmit}>
                Submit
              </Button>
            </Form>
          )}
        </Formik>
      </div>
      {errorMessage ? (
        <div style={{ display: "block" }} className="toast">
          <ToastMessage
            nullErrorMessage={nullErrorMessage}
            errorMessage={errorMessage}
          />
        </div>
      ) : null}
    </div>
  );
};

export default Auth;
