import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../index";
import request from "supertest";
//Async Hooks are a core module in Node. js that provides an API to track the lifetime of asynchronous resources in a Node application.
//hook function that will start before all tests

let mongo: MongoMemoryServer;
beforeAll(async () => {
  jest.setTimeout(30000);
  //this secret only exist in kubernties so for testing
  //we will put dummy value
  console.log("beforeAll");
  process.env.JWT_KEY = "secret";
  //mongo is the memory server db
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();
  await mongoose.connect(mongoUri, {});
  //mongoose will connect to the memory db
});

beforeEach(async () => {
  //before each test
  jest.setTimeout(30000);
  //we will delete all the data from the last test

  //getting all the collections
  const collections = await mongoose.connection.db.collections();

  //delete them
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  //after all tests
  jest.setTimeout(30000);
  await mongo.stop();
  await mongoose.connection.close();
});

//signup befor every test
export const testSignup = async () => {
  const email = "test@email.com";
  const password = "123456";
  const res = await request(app)
    .post("/api/user/signup")
    .send({ email, password })
    .expect(200);
  const cookie = res.get("Set-Cookie");
  return cookie;
};
