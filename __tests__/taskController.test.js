const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const Task = require("../models/Task");
const Group = require("../models/Group");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use("/", require("../routes"));

describe("Task Controller", () => {
  let groupId;

  // Connect to the database before all tests
  beforeAll(async () => {
    const url = process.env.mongo_URI;
    await mongoose.connect(url);
  });

  // Cleanup the database after all tests
  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  // Before each test, create a new group for isolation
  beforeEach(async () => {
    const group = await Group.create({ name: "Test Group" });
    groupId = group._id;
  });

  // Drop all tasks and groups after each test to isolate test data
  afterEach(async () => {
    await Task.deleteMany({});
    await Group.deleteMany({});
  });

  // Test for creating a new task
  test("should create a new task for the specified group", async () => {
    const response = await request(app)
      .post(`/groups/${groupId}/tasks`)
      .send({ description: "Test Task" });

    expect(response.status).toBe(201);
    expect(response.body.task).toHaveProperty("_id");
    expect(response.body.task.description).toBe("Test Task");
  });

  // Test for error handling when no description is provided
  test("should return 400 Bad Request if description is missing", async () => {
    const response = await request(app)
      .post(`/groups/${groupId}/tasks`)
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Task description is required");
  });

  // Test for retrieving a task by ID
  test("should return a task by ID for the specified group", async () => {
    const task = await Task.create({ description: "Test Task", groupId });
    const response = await request(app).get(
      `/groups/${groupId}/tasks/${task._id}`
    );

    expect(response.status).toBe(200);
    expect(response.body.task).toHaveProperty("_id");
    expect(response.body.task.description).toBe("Test Task");
  });

  // Test for handling invalid task ID
  test("should return 404 if task does not exist", async () => {
    const fakeTaskId = mongoose.Types.ObjectId(); // Generate a random task ID
    const response = await request(app).get(
      `/groups/${groupId}/tasks/${fakeTaskId}`
    );

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Task not found");
  });

  // Test for retrieving all tasks for a group
  test("should return all tasks for the specified group", async () => {
    await Task.create({ description: "Test Task 1", groupId });
    await Task.create({ description: "Test Task 2", groupId });

    const response = await request(app).get(`/groups/${groupId}/tasks`);

    expect(response.status).toBe(200);
    expect(response.body.tasks.length).toBe(2);
    expect(response.body.tasks[0].description).toBe("Test Task 1");
    expect(response.body.tasks[1].description).toBe("Test Task 2");
  });

  // Test for retrieving tasks for a non-existent group
  test("should return 404 if the group does not exist", async () => {
    const fakeGroupId = mongoose.Types.ObjectId();
    const response = await request(app).get(`/groups/${fakeGroupId}/tasks`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Group not found");
  });
});
