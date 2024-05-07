const express = require("express");
const { protect } = require("../middleware/userMiddleware");
const { sendMessage, allMessages } = require("../controllers/messageControllers");
const Router = express.Router();


Router.route("/").post(protect, sendMessage);
Router.route("/:chatId").get(protect, allMessages);
module.exports = Router;