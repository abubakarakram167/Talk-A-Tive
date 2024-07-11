const express = require("express");
const dotenv = require("dotenv");
const data = require("./data/data");

const app = express();
dotenv.config();

app.get("/api/chats", (req, res) => {
	res.send(data.chat);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`server started on port ${PORT}`));
