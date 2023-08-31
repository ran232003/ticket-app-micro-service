import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";
//build a client will connect to nats streamin server and exchange info with it

//we need to connect to the kuberneties cluster
const client = nats.connect("tickets", "abc", { url: "http://localhost:4222" });

client.on("connect", async () => {
  console.log("publish connect to nats"); //
  let data = {
    id: "123",
    title: "testTitle",
    price: 30,
  };
  let ticketCreatedPublisher = new TicketCreatedPublisher(client);
  try {
    const response = await ticketCreatedPublisher.publish({
      id: "123",
      title: "ran",
      price: 200,
    });
  } catch (error) {
    console.log(error);
  }

  // let jsonData = JSON.stringify(data); //
  // //creating data, need to be json//
  // //publish(topic,data)
  // client.publish("ticket:created", jsonData, () => {
  //   console.log("event publish");
  // });
});
