import request from "supertest";
import { app } from "../../index";
import { Response } from "express";
import { testSignup } from "../../test/setup";

//signup testing
it("return 200 code when success signup", async () => {
  return request(app)
    .post("/api/user/signup")
    .send({
      email: "test2s@test.com",
      password: "123456",
    })
    .expect(200);
});
it("return 500 FAILD VALIDATION password", async () => {
  return request(app)
    .post("/api/user/signup")
    .send({
      email: "test2s@test.com",
      password: "1",
    })
    .expect(400);
});
it("return 500 FAILD VALIDATION email", async () => {
  return request(app)
    .post("/api/user/signup")
    .send({
      email: "test2stest",
      password: "1asdasdasd",
    })
    .expect(400);
});
it("duplicate email", async () => {
  await request(app)
    .post("/api/user/signup")
    .send({
      email: "test2s@test.com",
      password: "1asdasdasd23",
    })
    .expect(200);
  await request(app)
    .post("/api/user/signup")
    .send({
      email: "test2s@test.com",
      password: "1asdasdasd23",
    })
    .expect(500);
});
it("check coockie", async () => {
  const res: any = await request(app).post("/api/user/signup").send({
    email: "test2s@test.com",
    password: "1asdasdasd23",
  });
  expect(res.get("Set-Cookie")).toBeDefined();
});

//signIn testing

it("return 400 FAILD VALIDATION email", async () => {
  return request(app)
    .post("/api/user/signin")
    .send({
      email: "test2stest",
      password: "1asdasdasd",
    })
    .expect(400);
});
it("return 400 FAILD VALIDATION password", async () => {
  return request(app)
    .post("/api/user/signin")
    .send({
      email: "test2stest",
      password: "s",
    })
    .expect(400);
});
it("return 200 successful signIn", async () => {
  await request(app)
    .post("/api/user/signup")
    .send({
      email: "test2s@test.com",
      password: "1asdasdasd23",
    })
    .expect(200);
  await request(app)
    .post("/api/user/signin")
    .send({
      email: "test2s@test.com",
      password: "1asdasdasd23",
    })
    .expect(200);
});
it("return 500 faild signIn email", async () => {
  await request(app)
    .post("/api/user/signup")
    .send({
      email: "test2s@tst.com",
      password: "1asdasdasd23",
    })
    .expect(200);
  await request(app)
    .post("/api/user/signin")
    .send({
      email: "test2s@test.com",
      password: "1asdasdasd23",
    })
    .expect(500);
});
it("return 500 faild signIn password", async () => {
  await request(app)
    .post("/api/user/signup")
    .send({
      email: "test2s@test.com",
      password: "1asdasdasd23",
    })
    .expect(200);
  await request(app)
    .post("/api/user/signin")
    .send({
      email: "test2s@test.com",
      password: "1asdasdasd2",
    })
    .expect(500);
});
it("return 500 User Not Exist", async () => {
  return request(app)
    .post("/api/user/signin")
    .send({
      email: "test2s@test.com",
      password: "1asdasdasd2",
    })
    .expect(500);
});

//getCurrent user
//signup send token as cookie from current user
//check token
//check current user
it("return 200 get signup user", async () => {
  //   const res = await request(app)
  //     .post("/api/user/signup")
  //     .send({
  //       email: "test2s@test.com",
  //       password: "1asdasdasd23",
  //     })
  //     .expect(200);
  //   const cookie = res.get("Set-Cookie");
  const cookie = await testSignup();
  const res2 = await request(app)
    .get("/api/user/currentuser")
    .set("Cookie", cookie)
    .send()
    .expect(200);
  console.log(res2.body.user);
  expect(res2.body.user.email).toEqual("test@email.com");
  //res2.body. the json response for current user
});
it("return 500 Error User Require", async () => {
  const res = await request(app).get("/api/user/currentuser").send();

  expect(500);
  expect(res.body.message).toEqual("Error User Require");
});
