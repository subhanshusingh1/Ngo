// import modules
import express from "express";
// evironment variables
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import logger from "./config/logger.js";

const app = express();

// import files
import eventRoutes from "./routes/eventRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
// import volunteerRoutes from "./routes/volunteerRoutes.js";
import formRoutes from "./routes/formRoutes.js";
// import paymentRoutes from "./routes/paymentRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";

import rateLimit from 'express-rate-limit';
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});

// security middleware
app.use(helmet());
app.use(compression());
// app.use(cors());
app.use(cors({
  origin: 'https://yourfrontenddomain.com', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(limiter);

// parse JSON bodies
app.use(express.json());
// parse URL_ENCODED Bodies
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// app.get("/", (req, res) => {
//   res.status(200).send("Welcome to Backend Development With MERN Stack");
// });


// routes
app.use("/api/v1/events", eventRoutes);
// app.use("/api/v1/volunteer", volunteerRoutes);
app.use("/api/v1/form", formRoutes);
app.use("/api/v1/admin", adminRoutes);
// app.use("/api/v1/donation", paymentRoutes);
app.use("/api/v1/blogs", blogRoutes);

// for undefined routes and handling errors
app.use(notFound);
app.use(errorHandler);

app.use((req, res, next) => {
  logger.error(`404 Not Found - ${req.originalUrl}`);
  res.status(404).send("Route not found");
});

app.use((err, req, res, next) => {
  logger.error(`Error occurred: ${err.message}`);
  res.status(500).send("Internal Server Error");
});

const startServer = () => {
  app.listen(process.env.PORT, () => {
    console.log(`Server is listening on Port: ${process.env.PORT}`);
  });
};

const startApp = async () => {
  try {
    await connectDB();
    startServer();
  } catch (error) {
    console.log(`Error connecting server: ${error.message}`);
  }
};

startApp();
