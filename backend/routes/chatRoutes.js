const express = require("express");
const { protect } = require("../middleware/userMiddleware");
const { accessChat, fetchGroups, fetchChats, createGroupChat, renameGroup, removeFromGroup, addToGroup } = require("../controllers/chatControllers");

const Router = express.Router();
Router.route("/",).post(protect, accessChat);
Router.route("/",).get(protect, fetchChats);
Router.route("/group",).post(protect, createGroupChat);
Router.route("/rename",).put(protect, renameGroup);
Router.route("/groupremove",).put(protect, removeFromGroup);
Router.route("/groupadd",).put(protect, addToGroup);
Router.route("/fetchgroups/:userId",).get(fetchGroups);
module.exports = Router;