import nats from "node-nats-streaming";
//build a client will connect to nats streamin server and exchange info with it

//we need to connect to the kuberneties cluster
const client = nats.connect("tickets", "abc", { url: "http://localhost:4222" });

client.on("connect", () => {
  console.log("publish connect to nats");
  let data = {
    id: "123",
    title: "testTitle",
    price: 30,
  };
  let jsonData = JSON.stringify(data);
  //creating data, need to be json
  //publish(topic,data)
  client.publish("ticket:created", jsonData, () => {
    console.log("event publish");
  });
});
