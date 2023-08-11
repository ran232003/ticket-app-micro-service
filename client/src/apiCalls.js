export const signUp = async (payload) => {
  console.log("signUp", payload);

  try {
    const response = await fetch("/api/user/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return { status: "fail", message: "Internal Error" };
  }
};
export const login = async (payload) => {
  console.log("login", payload);
  try {
    const response = await fetch("/api/user/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return { status: "fail", message: "Internal Error" };
  }
};
export const getCurrentUser = async () => {
  console.log("currentuser");
  try {
    const response = await fetch("/api/user/currentuser", {
      method: "GET",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return { status: "fail", message: "Internal Error" };
  }
};
export const signout = async () => {
  console.log("signout");
  try {
    const response = await fetch("/api/user/signout", {
      method: "GET",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return { status: "fail", message: "Internal Error" };
  }
};
export const apiCall = async (method, url, payload) => {
  console.log("apiCall", method, url, payload);
  let data, response;
  try {
    switch (method) {
      case "GET":
        console.log(url, payload);
        response = await fetch(url, {
          credentials: "include",
        });
        break;
      case "POST":
        console.log(url, payload, method);

        response = await fetch(url, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        break;
      case "Papayas":
        console.log("Mangoes and papayas are $2.79 a pound.");
        // Expected output: "Mangoes and papayas are $2.79 a pound."
        break;
      default:
        console.log(`Sorry, we are out of.`);
    }
    data = await response.json();
    return data;
  } catch (error) {}
};
