const express = require("express");
const {
	userRegisteration,
	authUser,
	allUsers,
} = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/").post(userRegisteration).get(protect, allUsers);
router.post("/login", authUser);

module.exports = router;
