import React, { useState, useEffect } from "react";
import { ChatState } from "../Context/ChatProvider";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { Box, Button, Stack, Text } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";
import { getSender, getReceiverUserPic } from "../config/ChatLogics";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import { Avatar } from "@chakra-ui/avatar";

const MyChats = () => {
	const { user, chats, selectedChat, setSelectedChat, setChats } = ChatState();
	const [loggedUser, setLoggedUser] = useState();

	const toast = useToast();

	const fetchChats = async () => {
		try {
			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			};

			const { data } = await axios.get("/api/chat", config);
			console.log("the data::", data);

			setChats(data);
		} catch (error) {
			toast({
				title: "Error Occured!",
				description: "Failed to Load the chats",
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom-left",
			});
		}
	};

	useEffect(() => {
		setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
		fetchChats();
		// eslint-disable-next-line
	}, []);

	return (
		<Box
			display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
			flexDirection="column"
			alignItems="center"
			padding={3}
			backgroundColor="white"
			width={{ base: "100%", md: "31%" }}
			borderRadius="lg"
			borderWidth="1px"
		>
			<Box
				paddingBottom={3}
				paddingX={3}
				fontSize={{ base: "28px", md: "30px" }}
				fontFamily="Work sans"
				display="flex"
				width="100%"
				justifyContent="space-between"
				alignItems="center"
			>
				My Chats
				<GroupChatModal>
					<Button
						rightIcon={<AddIcon />}
						fontSize={{ base: "17px", md: "10px", lg: "17px" }}
					>
						New Group Chat
					</Button>
				</GroupChatModal>
			</Box>
			<Box
				d="flex"
				flexDir="column"
				p={3}
				bg="#F8F8F8"
				w="100%"
				h="100%"
				borderRadius="lg"
				overflowY="hidden"
			>
				{chats ? (
					<Stack overflowY={"scroll"}>
						{chats.map((chat) => {
							console.log("the chat", chat);
							return (
								<Box
									onClick={() => setSelectedChat(chat)}
									cursor="pointer"
									bg={selectedChat === chat._id ? "#38B2AC" : "#E8E8E8"}
									color={selectedChat === chat._id ? "white" : "black"}
									display={"flex"}
									px={3}
									py={2}
									borderRadius="lg"
									key={chat._id}
								>
									<Avatar
										name={
											!chat.isGroupChat
												? getSender(loggedUser, chat.users)
												: chat.chatName
										}
										src={
											!chat.isGroupChat
												? getReceiverUserPic(loggedUser, chat.users)
												: ""
										}
									/>
									<Text style={{ paddingLeft: 10, paddingTop: 10 }}>
										{!chat.isGroupChat
											? getSender(loggedUser, chat.users)
											: chat.chatName}
									</Text>
								</Box>
							);
						})}
						)
					</Stack>
				) : (
					<ChatLoading />
				)}
			</Box>
		</Box>
	);
};

export default MyChats;
