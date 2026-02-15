const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const hpp = require("hpp");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

dotenv.config({ path: ".env" });

const dbConnection = require("./src/config/db");
const { webhookCheckout } = require("./src/services/order.service");
const ApiError = require("./src/utils/apiError");
const globalError = require("./src/middlewares/errorMiddleware");
const mountRoutes = require("./src/routes/index");

dbConnection();

const app = express();

app.use(cors());
app.use(compression());

app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  webhookCheckout,
);

app.use(express.json({ limit: "20kb" }));
app.use(express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

mountRoutes(app);

app.all("", (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

app.use(globalError);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});

process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error("Shutting down....");
    process.exit(1);
  });
});
