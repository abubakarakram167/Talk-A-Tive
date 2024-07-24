const express = require("express");
const {
	accessChat,
	fetchChats,
	createGroupChat,
	renameGroup,
	removeFromGroup,
	addToGroup,
} = require("../controllers/chatController");

//Authentication Middleware.
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/").get(protect, fetchChats);
router.route("/").post(protect, accessChat);
router.route("/creategroupchat").post(protect, createGroupChat);
router.route("/renameGroup").put(protect, renameGroup);
router.route("/addToGroup").post(protect, addToGroup);
router.route("/removeFromGroup").put(protect, removeFromGroup);

module.exports = router;
