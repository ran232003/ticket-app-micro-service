import nats, { Message, Stan } from "node-nats-streaming";
//build a client will connect to nats streamin server and exchange info with it
import crypto from "crypto";
import { ticketCreatedListner } from "./events/ticket-created-listener";
//generate random id
var id = crypto.randomBytes(4).toString("hex");
console.clear();
//we need to connect to the kuberneties cluster
const client = nats.connect("tickets", id, { url: "http://localhost:4222" });
console.log();
client.on("connect", () => {
  console.log("listening connect to nats");

  new ticketCreatedListner(client).listen();
  //setManualAckMode: when this is true, we are not sending right away to
  //nats that we recive the message. becasue if we have fail we will not get the msg agian
  //
  // const options = client
  //   .subscriptionOptions()
  //   .setManualAckMode(true)
  //   .setDeliverAllAvailable()
  //   .setDurableName("test-dur"); //will help us to take event that were missed
  //need to be together with setDeliverAllAvailable
  //listen to a specific topic,and que group
  // const subscribe = client.subscribe(
  //   "ticket:created",
  //   "listenerQueGroup",
  //   options
  // );
  // subscribe.on("message", (msg: Message) => {
  //   //getSubject()=>will return the topic name
  //   //getSequence() will return the number of message
  //   //getData() will return the payload
  //   console.log(msg.getData(), msg.getSequence(), msg.getSubject());
  //   //getting the data

  //   //sending ok response to nats
  //   msg.ack();
  // });
});

// abstract class Listen {
//   abstract topic: string;
//   private client: Stan;
//   abstract groupName: string;
//   protected ackWait = 5000; // miliseconds

//   constructor(client: Stan) {
//     this.client = client;
//   }
//   subscriptionOptions() {
//     return this.client
//       .subscriptionOptions()
//       .setManualAckMode(true)
//       .setDeliverAllAvailable()
//       .setAckWait(this.ackWait)
//       .setDurableName(this.groupName);
//   }
//   listen() {
//     const subscription = this.client.subscribe(
//       this.topic,
//       this.groupName,
//       this.subscriptionOptions()
//     );
//     subscription.on("message", (msg: Message) => {
//       console.log(msg.getData(), msg.getSequence(), msg.getSubject());

//       const parseMsg = this.parseMessage(msg);
//       this.onMessage(parseMsg, msg);
//     });
//   }
//   parseMessage(msg: Message) {
//     //we will check the type of message:
//     const data = msg.getData();
//     return typeof data === "string"
//       ? JSON.parse(data)
//       : JSON.parse(data.toString("utf-8"));
//   }
//   abstract onMessage(data: any, msg: Message): void;
// }

// class ticketCreatedListner extends Listen {
//   topic = "ticket:created";
//   groupName = "payment-service";

//   onMessage(data: any, msg: nats.Message): void {
//     console.log("onMessage", data);
//     msg.ack();
//   }
// }
