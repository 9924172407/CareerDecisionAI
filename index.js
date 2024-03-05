if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
  }
  const express = require("express");
  const cors = require("cors");
  const http = require("http");
  
  const { server, passport } = require("./src/configs/index");
  
  const app = express();
  const httpServer = http.createServer(app);
  const { port } = server;
  
  app.use(cors());
  
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  
  app.use(passport.initialize());
  
  app.get("/", (req, res) => {
    res.json({ message: "Server is up and running..." });
  });
  
  app.use("/api/v1", require("./src/api"));
  
  app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Internal Server Error";
  
    res.status(statusCode).json({ type: "error", message: err.message });
  });
  
  app.all("*", (req, res) => {
    res.status(404).json({ message: "Not found! ", type: "error" });
  });
  
  httpServer.listen(port, () => {
    console.log("Server is running on port " + port);
  });
  