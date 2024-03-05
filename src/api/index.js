const express = require("express");
const userRoute = require("./routes/userRoutes");
const alpacaRoute = require("./routes/brokerRoute");
const apiRouter = express.Router();

apiRouter.use("/users", userRoute);
apiRouter.use("/alpaca", alpacaRoute);
module.exports = apiRouter;
