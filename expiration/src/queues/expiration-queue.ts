import Queue from "bull";
//create queue with interface with the data we need
interface Payload {
  orderId: string;
}
const expirationQueue = new Queue<Payload>("order:expiration", {
  redis: { host: process.env.REDIS_HOST },
});
expirationQueue.process(async (job) => {
  //job is like the message from nats, to get the data need to use this:
  console.log("procces in queue", job.data); //
});

export { expirationQueue };
