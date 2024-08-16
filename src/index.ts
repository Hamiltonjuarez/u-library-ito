import express, { Request, Response } from "express";
import connectDB from "./config/mongodb";

const routes = require("./routes/index");
const app = express();
const port = 3000;

connectDB();


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api', routes)

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript with Express!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
