const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const generateToken = require("../config/jwtToken");

const userRegisteration = asyncHandler(async (req, res) => {
	const { name, email, password, pic } = req.body;

	if (!name || !email || !password) {
		res.status(400);
		throw new Error("Please Enter all the fields.");
	}

	const userExists = await User.findOne({ email });
	console.log("the user exists", userExists);
	if (userExists) {
		res.status(400);
		throw new Error("user already exists.");
	}

	const newUser = await User.create({ name, email, password, pic });
	console.log("after the new user created", newUser);

	if (newUser) {
		res.status(201).json({
			_id: newUser._id,
			name: newUser.name,
			email: newUser.email,
			password: newUser.password,
			token: generateToken(newUser._id),
		});
	} else {
		res.status(400);
		throw new Error("Error in creating User.");
	}
});

const authUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;
	const userExists = await User.findOne({ email });
	console.log("the userExists in login", userExists);
	if (userExists && userExists.matchPassword(password)) {
		res.status(201).json({
			_id: userExists._id,
			name: userExists.name,
			email: userExists.email,
			password: userExists.password,
			token: generateToken(userExists._id),
		});
	} else {
		res.status(400);
		throw new Error("Error in creating User.");
	}
});

module.exports = { userRegisteration, authUser };
