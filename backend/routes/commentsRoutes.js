const express = require("express");
const { protect } = require("../middleware/userMiddleware")
const Router = express.Router();
const multer = require('multer');
const upload = multer();
const { createComment, getComment, deleteComment } = require("../controllers/commentsControllers")

Router.route("/:postId").post(upload.single("file"), protect, createComment);
Router.route("/:postId").get(protect, getComment);
Router.route("/:commentId").delete(protect, deleteComment);

module.exports = Router;
