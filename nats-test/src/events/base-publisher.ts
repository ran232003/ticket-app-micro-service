import { Message, Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";

//the abstruct class that all listeners will extend
export abstract class Publisher<T extends Event> {
  abstract subject: T["subject"];
  private client: Stan;

  constructor(client: Stan) {
    this.client = client;
  }

  publish(data: T["data"]): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.publish(this.subject, JSON.stringify(data), (err) => {
        if (err) {
          return reject();
        }
        console.log("event publish ", this.subject);

        resolve();
      });
    });
  }
}

export interface Event {
  subject: Subjects;
  data: any;
}