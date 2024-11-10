const connectDB = require("./db");
const express = require("express");
const routes = require("./routes");
const swaggerSetup = require("./swagger");
require("dotenv").config();

const app = express();

app.use(express.json());
swaggerSetup(app);

const port = 3000;

app.use(routes);

const start = async () => {
  try {
    await connectDB(process.env.mongo_URI);
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
