import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import citiesRouter from "./routes/cities.js";
import itinerariesRouter from "./routes/itineraries.js";
import authRoutes from "./routes/auth.js"
import usersRouter from "./routes/users.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/cities", citiesRouter);
app.use("/api/itineraries", itinerariesRouter);

app.use("/api/users", usersRouter);

app.use("/api/auth", authRoutes);

connectDB();

app.get("/", (req, res) => {
    res.json({ message: "API is running" });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});