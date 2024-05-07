const express = require("express");
const { protect } = require("../middleware/userMiddleware")
const Router = express.Router();
const { registerUser, people, setFollowers, setFriends, setUnFollowers, authUser, allUsers, fetchUser } = require("../controllers/userControllers");

Router.route("/signup").post(registerUser);
Router.route("/login").post(authUser);
Router.route("/").get(protect, allUsers);
Router.route("/:id").get(fetchUser);
Router.route("/people/:userId").get(people);
Router.route("/follow").put(setFollowers);
Router.route("/unfollow").put(setUnFollowers);
Router.route("/friend").put(setFriends);

module.exports = Router;