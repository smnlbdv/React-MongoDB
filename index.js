import express from "express";
import mongoose from "mongoose";
import { registerValidation } from "./validations/auth.js";
import { postCreateValidation } from "./validations/post.js";
import checkAuth from "./utils/checkAuth.js";
import * as UserController from "./controllers/UserController.js";
import * as PostController from "./controllers/PostController.js";

mongoose
  .connect(
    "mongodb+srv://lbdwsmn:12345@cluster0.1d800tl.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB okey"))
  .catch((err) => console.log("DB err", err));

const app = express();
app.use(express.json());

app.post("/auth/login",  UserController.login);
app.get("/auth/me", checkAuth, UserController.getMe);
app.post("/auth/register", registerValidation, UserController.register);

app.get("/posts", checkAuth, PostController.getAll)
// app.get("/posts/:id", PostController.getOne)
app.post("/posts", checkAuth, postCreateValidation, PostController.create)
// app.delete("/posts", PostController.remove)
// app.patch("/posts", PostController.update)

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Все окей!");
});
