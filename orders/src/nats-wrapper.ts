import { MyError } from "@ranmicroserviceapp/common";
import nats, { Stan } from "node-nats-streaming";

class NatsWarrper {
  //give us option to make it undefiend
  private _client?: Stan;

  getClient() {
    if (!this._client) {
      throw new MyError("Cannot acces Nats", 500);
    }
    return this._client;
  }
  connect(clusterId: string, clientId: string, url: string) {
    //  this._client = nats.connect("tickets", "abc", { url: "http://localhost:4222" });
    this._client = nats.connect(clusterId, clientId, {
      url: url,
      //   waitOnFirstConnect: true,
    });

    return new Promise<void>((resolve, reject) => {
      this._client!.on("connect", () => {
        console.log("Connected to NATS");
        resolve();
      });
      this._client!.on("error", (err) => {
        console.log("err is", err);
        reject(err);
      });
    });
  }
}
export const natsWrraper = new NatsWarrper();
