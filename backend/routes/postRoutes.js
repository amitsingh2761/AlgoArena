const express = require("express");
const { protect } = require("../middleware/userMiddleware")
const { createPost, allPosts, getPost, deletePost, updateReactions, sendReport, fetchAll } = require("../controllers/postControllers")
const Router = express.Router();
const multer = require('multer');
const upload = multer();



Router.route("/").get(allPosts);
Router.route("/create").post(upload.array('files', 10), protect, createPost);
Router.route("/:id").get(getPost);
Router.route("/delete").post(protect, deletePost);
Router.route("/:id").put(protect, updateReactions);
Router.route("/report/:postId").post(protect, sendReport);
Router.route("/allposts/:userId").get(fetchAll);





module.exports = Router;

