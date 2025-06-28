"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_js_1 = __importDefault(require("./routes/user.js"));
const movie_js_1 = __importDefault(require("./routes/movie.js"));
const PORT = process.env.PORT || 3000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/api/v1/user", user_js_1.default);
app.use("/api/v1/movie", movie_js_1.default);
app.listen(PORT);
