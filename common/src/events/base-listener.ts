import { Message, Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";

//the abstruct class that all listeners will extend
export abstract class Listen<T extends Event> {
  abstract subject: T["subject"];
  private client: Stan;
  abstract groupName: string;
  protected ackWait = 5000; // miliseconds

  constructor(client: Stan) {
    this.client = client;
  }
  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setManualAckMode(true)
      .setDeliverAllAvailable()
      .setAckWait(this.ackWait)
      .setDurableName(this.groupName);
  }
  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.groupName,
      this.subscriptionOptions()
    );
    subscription.on("message", (msg: Message) => {
      console.log(msg.getData(), msg.getSequence(), msg.getSubject());

      const parseMsg = this.parseMessage(msg);
      this.onMessage(parseMsg, msg);
    });
  }
  parseMessage(msg: Message) {
    //we will check the type of message:
    const data = msg.getData();
    return typeof data === "string"
      ? JSON.parse(data)
      : JSON.parse(data.toString("utf-8"));
  }
  abstract onMessage(data: T["data"], msg: Message): void;
}

interface Event {
  subject: Subjects;
  data: any;
}
