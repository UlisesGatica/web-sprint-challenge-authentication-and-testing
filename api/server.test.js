const request = require("supertest");
const db = require("../data/dbConfig");
const server = require("../api/server");
const User = require("./model/users-model");

const user1 = {
  id: 1,
  username: "ulisestester",
  password: "1234",
};
const user2 = {
  id: 2,
  username: "ulisestester2",
  password: "1234",
};

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

beforeEach(async () => {
  await db("users").truncate();
});

afterAll(async () => {
  await db.destroy();
});

test('sanity', () => {
  expect(true).toBe(true)
})

describe("[Post] Register", () => {
  let res
  beforeEach(async () => {
    res = await request(server)
      .post('/api/auth/register')
      .send({
      username: "ulisestesterunique",
      password: "1234" })
  })
  test("responds with a 210", async () => {
    expect(res.status).toBe(201)
  })
  test('responds with new user', async () => {
    expect(res.body).toMatchObject({ username: "ulisestesterunique"})
  })
})

describe("[Get] Login", () => {
  let res
  beforeEach(async () => {
    res = await request(server)
      .post('/api/auth/register')
      .send({
      username: "ulisestest",
      password: "1234" })
  })
  test("responds with a 210", async () => {
    const login = await request(server)
      .post("/api/auth/login")
      .send({
      username: "ulisestest",
      password: "1234" })
    expect(login.status).toBe(200)
  })
  test('responds with new user', async () => {
    const login = await request(server)
    .post("/api/auth/login")
    .send({
    username: "ulisestest",
    password: "1234" })
    expect(login.body.message).toMatch("welcome, ulisestest")
  })
})