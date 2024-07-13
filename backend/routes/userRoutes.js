const express = require("express");
const {
	userRegisteration,
	authUser,
} = require("../controllers/userController");

const router = express.Router();

router.route("/").post(userRegisteration);
router.post("/login", authUser);

module.exports = router;
