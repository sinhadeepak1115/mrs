import express from "express";
import user from "./routes/user";
import movie from "./routes/movie";
import theater from "./routes/theater";
import screen from "./routes/screen";
import show from "./routes/show";
import booking from "./routes/booking";

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.use("/api/v1/user", user);
app.use("/api/v1/movie", movie);
app.use("/api/v1/theater", theater);
app.use("/api/v1/screen", screen);
app.use("/api/v1/show", show);
app.use("/api/v1/booking", booking);

app.listen(PORT);
