import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import StripeCheckout from "react-stripe-checkout";
import { apiCall } from "../apiCalls";
import { payOrderUrl } from "../URLS";

const Order = () => {
  const [order, setOrder] = useState(null);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const navigate = useNavigate();
  const auth = useSelector((state) => {
    return state.auth;
  });
  const orderSlice = useSelector((state) => {
    return state.orders;
  });
  const location = useLocation();

  const setMyOrder = () => {
    if (!location.state.order) {
      // Handle the case where there's no order in the location state.
      return;
    }
    setOrder(location.state.order);
  };

  useEffect(() => {
    setMyOrder();
  }, []);

  useEffect(() => {
    if (order) {
      const findTimeLeft = () => {
        const msLeft = new Date(order.expireAt) - new Date();
        const totalSeconds = Math.max(Math.round(msLeft / 1000), 0);
        const remainingMinutes = Math.floor(totalSeconds / 60);
        const remainingSeconds = totalSeconds % 60;
        setMinutes(remainingMinutes);
        setSeconds(remainingSeconds);
      };

      findTimeLeft(); // Call initially to set the initial time remaining.

      const timerId = setInterval(findTimeLeft, 1000);

      return () => {
        clearInterval(timerId); // Cleanup the timer on unmount.
      };
    }
  }, [order]);
  const handlePayment = async (token) => {
    console.log("handlePayment");

    //stripe
    //pk_test_51O3GtWCPnrx9Ir46IhMeYUuik6oLaM7HG6aZhJRwrrRJGSNtOMYDXmhAghcFPU7mXyvBBMz04ssREQ8kangkRrnz005VWdFR0X
    const data = await apiCall("POST", payOrderUrl, {
      orderId: order._id,
      token: token.id,
    });
    console.log(data);
    if (!data.msg !== "ok") {
      return;
    }
    navigate("/orders");
  };
  return (
    <div className="order-container">
      {order ? (
        <div className="order-content">
          <h1>Your Order for {order.ticket.title}</h1>
          {minutes === 0 && seconds === 0 && order.status !== "complete" ? (
            <h5>Time is up! Order is Canceled</h5>
          ) : (
            <div>
              {order.status === "complete" ? (
                <div>
                  {" "}
                  <h5>Is Complete!</h5>
                </div>
              ) : (
                <div>
                  <h5>
                    Time until order expires: {String(minutes).padStart(2, "0")}
                    :{String(seconds).padStart(2, "0")}
                  </h5>

                  <StripeCheckout
                    //dummy credit card number:  4242 4242 4242 4242
                    token={(token) => {
                      handlePayment(token);
                      console.log(token); //token.id token.email
                    }}
                    stripeKey="pk_test_51O3GtWCPnrx9Ir46IhMeYUuik6oLaM7HG6aZhJRwrrRJGSNtOMYDXmhAghcFPU7mXyvBBMz04ssREQ8kangkRrnz005VWdFR0X"
                    amount={order.ticket.price * 100} //originally its cents so need to multiply
                    email={auth.user}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <h5>Loading...</h5>
      )}
    </div>
  );
};

export default Order;
