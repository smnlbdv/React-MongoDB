import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import { registerValidation } from "./validations/auth.js";
import { postCreateValidation } from "./validations/post.js";
import { checkAuth, handleValidationError } from "./utils/index.js";
import { UserController, PostController } from './controllers/index.js'
import cors from 'cors'

mongoose
  .connect(
    "mongodb+srv://lbdwsmn:12345@cluster0.1d800tl.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB okey"))
  .catch((err) => console.log("DB err", err));

const app = express();
app.use(express.json());
app.use(cors())
app.use("/uploads", express.static('uploads'))

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads')
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname)
  },
})

const upload = multer({storage})

app.post("/auth/login",handleValidationError, UserController.login);
app.get("/auth/me", checkAuth, UserController.getMe);
app.post("/auth/register", registerValidation, handleValidationError, UserController.register);

app.post("/upload", checkAuth, upload.single('image'), (req, res) =>{
  res.json({
    url: `/uploads/${req.file.originalname}`,
  })
})

app.get("/posts", checkAuth, PostController.getAll)
app.get("/posts/:id", PostController.getOne)
app.post("/posts", checkAuth, postCreateValidation, PostController.create)
app.delete("/posts/:id", checkAuth, PostController.remove)
app.patch("/posts:id", checkAuth, postCreateValidation,PostController.update)

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Все окей!");
});
