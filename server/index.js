const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/userRouter");
const { app, server } = require("./socket/socket.js");
dotenv.config();

// const app = express();
const port = process.env.port || 9090;

mongoose
  .connect("mongodb://127.0.0.1:27017/chat-app")
  .then((e) => console.log("connected to db"))
  .catch((e) => console.log(e));

app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({ message: "hi" });
});

//socket running at http://localhost:5173/

app.use("/api", userRouter);

server.listen(3000, () => {
  console.log("server started", port);
});
