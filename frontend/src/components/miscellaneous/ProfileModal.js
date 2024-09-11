import { useDisclosure, IconButton, Image } from "@chakra-ui/react";
import React from "react";
import { ViewIcon } from "@chakra-ui/icons";
import { Button, Text, Box } from "@chakra-ui/react";

import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
} from "@chakra-ui/react";

const ProfileModal = ({ user, children }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();

	return (
		<>
			{children ? (
				<span onClick={onOpen}>{children}</span>
			) : (
				<IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
			)}
			<Modal
				size={"lg"}
				isCentered
				blockScrollOnMount={false}
				isOpen={isOpen}
				onClose={onClose}
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader
						fontSize="20px"
						fontFamily="Work sans"
						display="flex"
						justifyContent="center"
					>
						{user.name}
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody
						display={"flex"}
						flexDirection={"row"}
						justifyContent={"center"}
					>
						<Image
							src={user.pic}
							alt={user.name}
							borderRadius={"full"}
							boxSize="150px"
						/>
					</ModalBody>
					<Box alignItems={"center"} justifyContent={"center"} display="flex">
						Email : <span> {user.email}</span>
					</Box>
					<ModalFooter>
						<Button colorScheme="blue" mr={3} onClick={onClose}>
							Close
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default ProfileModal;
