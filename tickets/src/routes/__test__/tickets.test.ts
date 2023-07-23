import request from "supertest";
import { app } from "../../index";
import { Response } from "express";

it("return 200 code when listing to api/tickets post", async () => {
  const response = await request(app)
    .post("/api/tickets/createTicket")
    .send({});
  expect(response.status).not.toEqual(404);
});
