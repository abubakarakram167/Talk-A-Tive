import React, { useState } from "react";
import {
	Avatar,
	Tooltip,
	useDisclosure,
	Input,
	Button,
	Box,
	Text,
	Spinner,
} from "@chakra-ui/react";
import {
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerHeader,
	DrawerOverlay,
} from "@chakra-ui/modal";
import {
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	MenuDivider,
} from "@chakra-ui/react";
import { getSender } from "../../config/ChatLogics";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useHistory } from "react-router-dom";
import { useToast } from "@chakra-ui/toast";
import ChatLoading from "../ChatLoading";
import axios from "axios";
import UserListItem from "../UserAvatar/UserListItem";
import NotificationBadge, { Effect } from "react-notification-badge";

const SideDrawer = () => {
	const [search, setSearch] = useState("");
	const [searchResult, setSearchResult] = useState([]);
	const [loading, setLoading] = useState(false);
	const [loadingChat, setLoadingChat] = useState(false);

	const {
		user,
		chats,
		selectedChat,
		setSelectedChat,
		setChats,
		notification,
		setNotification,
	} = ChatState();
	const history = useHistory();
	const toast = useToast();
	const { isOpen, onOpen, onClose } = useDisclosure();

	const logOut = () => {
		localStorage.removeItem("userInfo");
		history.push("/");
	};

	const handleSearch = async (e) => {
		if (!search.length) {
			toast({
				title: "Please Enter value for Search.!",
				status: "warning",
				duration: 5000,
				isClosable: true,
				position: "top-left",
			});
			return;
		}

		try {
			setLoading(true);

			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			};

			const { data } = await axios.get(`/api/user?search=${search}`, config);

			setLoading(false);
			setSearchResult(data);
		} catch (error) {
			toast({
				title: "Error Occured!",
				description: "Failed to Load the Search Results",
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom-left",
			});
		}
	};

	const accessChat = async (userId) => {
		console.log(userId);

		try {
			setLoadingChat(true);
			const config = {
				headers: {
					"Content-type": "application/json",
					Authorization: `Bearer ${user.token}`,
				},
			};
			const { data } = await axios.post(`/api/chat`, { userId }, config);

			if (!chats.find((chat) => chat._id === data._id))
				setChats([data, ...chats]);

			setSelectedChat(data);
			setLoadingChat(false);
			onClose();
		} catch (error) {
			toast({
				title: "Error fetching the chat",
				description: error.message,
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom-left",
			});
		}
	};

	return (
		<div>
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
				bg="white"
				w="100%"
				p="5px 10px 5px 10px"
				borderWidth="5px"
			>
				<Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
					<Button onClick={onOpen} variant="ghost">
						<i class="fa-solid fa-magnifying-glass"></i>
						<Text d={{ base: "none", md: "flex" }} px="4">
							Search User
						</Text>
					</Button>
				</Tooltip>
				<Text>Talk-A-Tive</Text>
				<div>
					<Menu>
						<MenuButton>
							<NotificationBadge
								count={notification?.length}
								effect={Effect.SCALE}
							/>
							<BellIcon boxSize={5} md={1} />
						</MenuButton>
						<MenuList pl={2}>
							{!notification && "No New Messages"}
							{notification?.map((notIf) => (
								<MenuItem
									key={notIf._id}
									onClick={() => {
										setSelectedChat(notIf.chat);
										setNotification(notification.filter((n) => n !== notIf));
									}}
								>
									{" "}
									{notIf.isGroupChat
										? `Message Received From ${notIf.chat.chatName}`
										: `New Message from ${getSender(user, notIf.chat.users)}`}
								</MenuItem>
							))}
						</MenuList>
					</Menu>
					<Menu>
						<MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
							<Avatar
								size="sm"
								cursor={"pointer"}
								name={user.name}
								src={user.pic}
							/>
						</MenuButton>
						<MenuList>
							<ProfileModal user={user}>
								<MenuItem> My Profile </MenuItem>
							</ProfileModal>
							<MenuDivider />
							<MenuItem onClick={logOut}> Log Out </MenuItem>
						</MenuList>
					</Menu>
				</div>
			</Box>
			<Drawer placement="left" onClose={onClose} isOpen={isOpen}>
				<DrawerOverlay />
				<DrawerContent>
					<DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
					<DrawerBody>
						<Box display="flex" pb={2}>
							<Input
								placeholder="Search by name or email"
								mr={2}
								value={search}
								onChange={(e) => {
									setSearch(e.target.value);
								}}
							/>
							<Button onClick={handleSearch}>Go</Button>
						</Box>
						{loading ? (
							<ChatLoading />
						) : (
							searchResult?.map((user) => (
								<UserListItem
									user={user}
									key={user._id}
									handleFunction={() => accessChat(user._id)}
								/>
							))
						)}
						{loadingChat && (
							<Spinner display={"flex"} ml="auto" justifyContent="center" />
						)}
					</DrawerBody>
				</DrawerContent>
			</Drawer>
		</div>
	);
};

export default SideDrawer;
