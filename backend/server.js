const express = require("express");
const dotenv = require("dotenv");
const data = require("./data/data");
const connectDB = require("./config/db");
const colors = require("colors");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const path = require("path");

const app = express();
dotenv.config();
connectDB();

app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// --------------------------deployment------------------------------

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname1, "/frontend/build")));

	app.get("*", (req, res) =>
		res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
	);
} else {
	app.get("/", (req, res) => {
		res.send("API is running..");
	});
}

// --------------------------deployment------------------------------

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(
	PORT,
	console.log(`server started on port ${PORT}`.yellow.bold)
);

const io = require("socket.io")(server, {
	pingTimeout: 60000,
	cors: {
		origin: ["http://localhost:3000", "https://talk-a-tive-3sur.onrender.com"],
	},
});

io.on("connection", (socket) => {
	console.log("socket.io is connected...");

	socket.on("setup", (userData) => {
		socket.join(userData._id);
		socket.emit("connected");
	});

	socket.on("join chat", (room) => {
		socket.join(room);
		console.log("User joined room", room);
	});

	socket.on("start typing", (room) => {
		socket.in(room).emit("start typing");
	});

	socket.on("stop typing", (room) => {
		socket.in(room).emit("stop typing");
	});

	socket.on("new message", (newMessageReceived) => {
		var chat = newMessageReceived.chat; // this socket is for new message to be received from client.
		console.log("on new Message", newMessageReceived);
		if (!chat.users) return console.log("chat.users not defined.");

		chat.users.forEach((user) => {
			if (user._id === newMessageReceived.sender._id) return; // broadcast new received messages to room except sender of the message.
			socket.in(user._id).emit("message receieved", newMessageReceived);
		});
	});

	socket.off("setup", () => {
		console.log("User Disconnected!!!"); // Disconnnected from socket to make sure to save the unecessary bandwidth.
		socket.leave(userData._id);
	});
});
