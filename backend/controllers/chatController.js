const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/user");

const accessChat = asyncHandler(async (req, res) => {
	const { userId } = req.body;
	if (!userId) {
		return res.sendStatus(400);
	}

	var isChat = await Chat.find({
		isGroupChat: false,
		$and: [
			{ users: { $elemMatch: { $eq: req.user._id } } },
			{ users: { $elemMatch: { $eq: userId } } },
		],
	})
		.populate("users", "-password")
		.populate("latestMessage");

	isChat = await User.populate(isChat, {
		path: "latestMessage.sender",
		select: "name pic email",
	});

	if (isChat.length > 0) {
		res.send(isChat[0]);
	} else {
		var chatData = {
			chatName: "sender",
			isGroupChat: false,
			users: [req.user._id, userId],
		};
		try {
			const createdChat = await Chat.create(chatData);
			const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
				"users",
				"-password"
			);

			res.status(200).send(fullChat);
		} catch (error) {
			res.status(400);
			throw new Error("Error in Creating Chat");
		}
	}
});

const fetchChats = asyncHandler(async (req, res) => {
	try {
		Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
			.populate("users", "-password")
			.populate("groupAdmin", "-password")
			.populate("latestMessage")
			.sort({ updatedAt: -1 })
			.then(async (results) => {
				results = await User.populate(results, {
					path: "latestMessage.sender",
					select: "name pic email",
				});
				res.status(200).send(results);
			});
	} catch (error) {
		res.status(400);
		throw new Error(error.message);
	}
});

const createGroupChat = asyncHandler(async (req, res) => {
	if (!req.body.users || !req.body.name) {
		return res.status(400).send("Please fill all the fields...");
	}

	var users = JSON.parse(req.body.users);

	if (users.length < 2) {
		return res
			.status(400)
			.send("More than 2 users are requred to be in this group.");
	}

	users.push(req.user);
	try {
		const groupChat = await Chat.create({
			chatName: req.body.name,
			users,
			isGroupChat: true,
			groupAdmin: req.user,
		});

		const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
			.populate("users", "-password")
			.populate("groupAdmin", "-password");

		res.status(200).json(fullGroupChat);
	} catch (err) {
		res.status(400);
		throw new Error();
	}
});

// @desc    Rename Group
// @route   PUT /api/chat/rename
// @access  Protected
const renameGroup = asyncHandler(async (req, res) => {
	const { chatId, chatName } = req.body;

	const updatedChat = await Chat.findByIdAndUpdate(
		chatId,
		{
			chatName: chatName,
		},
		{
			new: true,
		}
	)
		.populate("users", "-password")
		.populate("groupAdmin", "-password");

	if (!updatedChat) {
		res.status(404);
		throw new Error("Chat Not Found");
	} else {
		res.json(updatedChat);
	}
});

// @desc    Remove user from Group
// @route   PUT /api/chat/groupremove
// @access  Protected
const removeFromGroup = asyncHandler(async (req, res) => {
	const { chatId, userId } = req.body;

	// check if the requester is admin

	const removed = await Chat.findByIdAndUpdate(
		chatId,
		{
			$pull: { users: userId },
		},
		{
			new: true,
		}
	)
		.populate("users", "-password")
		.populate("groupAdmin", "-password");

	if (!removed) {
		res.status(404);
		throw new Error("Chat Not Found");
	} else {
		res.json(removed);
	}
});

// @desc    Add user to Group / Leave
// @route   PUT /api/chat/groupadd
// @access  Protected
const addToGroup = asyncHandler(async (req, res) => {
	const { chatId, userId } = req.body;

	// check if the requester is admin

	const added = await Chat.findByIdAndUpdate(
		chatId,
		{
			$push: { users: userId },
		},
		{
			new: true,
		}
	)
		.populate("users", "-password")
		.populate("groupAdmin", "-password");

	if (!added) {
		res.status(404);
		throw new Error("Chat Not Found");
	} else {
		res.json(added);
	}
});

module.exports = {
	accessChat,
	fetchChats,
	createGroupChat,
	renameGroup,
	removeFromGroup,
	addToGroup,
};
