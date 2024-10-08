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

	if (userExists) {
		res.status(400);
		throw new Error("user already exists.");
	}

	const newUser = await User.create({ name, email, password, pic });

	if (newUser) {
		res.status(201).json({
			_id: newUser._id,
			name: newUser.name,
			email: newUser.email,
			pic,
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

	if (!userExists) {
		res.status(400);
		throw new Error("User Not Found!");
	}
	const isPasswordMatch = await userExists.matchPassword(password);

	if (userExists && isPasswordMatch) {
		res.status(201).json({
			_id: userExists._id,
			name: userExists.name,
			email: userExists.email,
			password: userExists.password,
			pic: userExists.pic,
			token: generateToken(userExists._id),
		});
	} else {
		res.status(400);
		throw new Error("Error in Authorizing User.");
	}
});

const allUsers = asyncHandler(async (req, res) => {
	const keyword = req.query.search
		? {
				$or: [
					{ name: { $regex: req.query.search, $options: "i" } },
					{ email: { $regex: req.query.search, $options: "i" } },
				],
		  }
		: {};

	const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
	res.send(users);
});

module.exports = { userRegisteration, authUser, allUsers };
