import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Toast from "react-bootstrap/Toast";

function ToastMessage(props) {
  const [show, setShow] = useState(true);
  const { errorMessage, cssMessage, nullErrorMessage, color } = props;
  const close = () => {
    console.log("close");
    setShow(false);
    nullErrorMessage();
  };
  useEffect(() => {
    //setShow(true);
  }, []);

  return (
    <Row>
      <Col xs={12}>
        <Toast bg="danger" onClose={close} show={show} delay={3000} autohide>
          <Toast.Body>{errorMessage}</Toast.Body>
        </Toast>
      </Col>
    </Row>
  );
}

export default ToastMessage;
