import express from "express";
import user from "./routes/user.js";
import movie from "./routes/movie.js";

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.use("/api/v1/user", user);
app.use("/api/v1/movie", movie);

app.listen(PORT);
