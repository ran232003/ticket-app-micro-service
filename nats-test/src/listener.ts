import nats, { Message } from "node-nats-streaming";
//build a client will connect to nats streamin server and exchange info with it

//we need to connect to the kuberneties cluster
const client = nats.connect("tickets", "123", { url: "http://localhost:4222" });

client.on("connect", () => {
  console.log("listening connect to nats");
  //listen to a specific topic
  const subscribe = client.subscribe("ticket:created");
  subscribe.on("message", (msg: Message) => {
    //getSubject()=>will return the topic name
    //getSequence() will return the number of message
    //getData() will return the payload
    console.log(msg.getData(), msg.getSequence(), msg.getSubject());
    //getting the data
  });
});
