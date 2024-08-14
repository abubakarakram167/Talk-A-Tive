const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const Chat = require("../models/chatModel");
const User = require("../models/user");

const sendMessage = asyncHandler(async (req, res) => {
	const { content, chatId } = req.body;

	if (!content || !chatId) {
		return res.status(400);
	}

	var message = {
		sender: req.user._id,
		content,
		chat: chatId,
	};

	try {
		var newMessage = await Message.create(message);

		newMessage = await newMessage.populate("sender", "name pic");
		newMessage = await newMessage.populate("chat");
		newMessage = await User.populate(newMessage, {
			path: "chat.users",
			select: "name, email, pic",
		});

		await Chat.findByIdAndUpdate(chatId, {
			latestMessage: newMessage,
		});
		res.status(200).json(newMessage);
	} catch (err) {
		console.log("the error happening", err);
		res.status(400);
		throw new Error(err.message);
	}
});

const allMessages = asyncHandler(async (req, res) => {
	console.log("thr req. params", req.params);
	try {
		var fetchMessages = await Message.find({ chat: req.params.chatId })
			.populate("sender", "name pic")
			.populate("chat");
		console.log("the all Messages", fetchMessages);

		res.status(200).json(fetchMessages);
	} catch (err) {
		console.log("the error happening", err);
		res.status(400);
		throw new Error(err.message);
	}
});

module.exports = { sendMessage, allMessages };
