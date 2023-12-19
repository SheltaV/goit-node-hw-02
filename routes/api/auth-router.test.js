import mongoose from "mongoose";
import request from "supertest";

import { app } from "../../app.js";

const { HOST_DB, PORT=3000 } = process.env;

const loginData = {
    email: 'anastasi@mail.com',
    password: '123456'
};

describe("test /users/login route", () => {
    let server = null;

        
    beforeAll(async () => {
        await mongoose.connect(HOST_DB);
        server = app.listen(PORT);
    })

    afterAll(async () => {
        await mongoose.connection.close();
        server.close();
    })

    // test("test /users/register with correctData", async () => {
    //     const { body, statusCode } = await request(app).post("/users/register").send(loginData);
        
    //     expect(statusCode).toBe(201);
    //     expect(body.password).toBe(loginData.password);
    //     expect(body.email).toBe(loginData.email);

    //     const user = await User.findOne({ email: loginData.email });
    //     expect(user.email).toBe(loginData.email);
    // })
    
    test("Should return statusCode 200", async () => {
    const { statusCode } = await request(app)
      .post("/users/login")
      .send(loginData);
    expect(statusCode).toBe(200);
    });

    test("Should return token", async () => {
    const { body } = await request(app).post("/users/login").send(loginData);
    expect(body.token).toBeDefined();
    });
    
    test("Should return an object with 2 fields and type String", async () => {
    const { body } = await request(app).post("/users/login").send(loginData);
    expect(body.user).toEqual({
        email: body.user.email,
        subscription: body.user.subscription
        })
    expect(typeof body.user.email === "string").toBe(true)
    expect(typeof body.user.subscription === "string").toBe(true)
    });
})