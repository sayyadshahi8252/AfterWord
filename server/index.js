import express from "express";
import dotenv from "dotenv";
import connectdb from "./config/db.js";
import userRoutes from "./routes/user.route.js";
import bookRoutes from "./routes/book.route.js"
import reviewRoutes from "./routes/review.route.js"
import commentRoutes from "./routes/comment.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";


dotenv.config();  

const app = express();

connectdb();

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser())


app.use("/api/user", userRoutes);
app.use("/api/book",bookRoutes);
app.use("/api/post",reviewRoutes)
app.use("/api/comments", commentRoutes);

app.get("/", (req, res) => {
  res.send("sayyad shahi");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});

// app.listen(PORT, '0.0.0.0', () => {
//   console.log(`Server running on port ${PORT}`);
// });