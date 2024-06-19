import "dotenv/config";
import "express-async-errors";
import 'src/db'
import express from "express";
import authRouter from "./route/auth";

const app = express();

app.use(express.static("src/public"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API
app.use("/auth", authRouter)

app.use(function (err, req, res, next) {
    res.status(500).json({ message: err.message });
  } as express.ErrorRequestHandler);
   
  app.listen(6000, () => {
    console.log("Server is running on http://localhost:6000");
  });
  