import React, { useState } from "react";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useHistory } from "react-router-dom";

const Login = () => {
	const [email, setEmail] = useState();
	const [password, setPassword] = useState();
	const [show, setShow] = useState(false);
	const [loading, setLoading] = useState(false);

	const toast = useToast();
	const history = useHistory();

	const submitHandler = async () => {
		setLoading(true);
		if (!email || !password) {
			toast({
				title: "Please Fill all the fields!",
				status: "warning",
				duration: 5000,
				isClosable: true,
				position: "top",
			});
			return;
		}

		try {
			const config = {
				headers: {
					"Content-type": "application/json",
				},
			};

			const { data } = await axios.post(
				"/api/user/login",
				{ email, password },
				config
			);

			toast({
				title: "Login Successfully",
				status: "success",
				duration: 2000,
				isClosable: true,
				position: "bottom",
			});

			localStorage.setItem("userInfo", JSON.stringify(data));
			setLoading(false);
			history.push("/chats");
		} catch (err) {
			console.log("the error", err);
			toast({
				title: "Invalid Username or password",
				status: "error",
				duration: 4000,
				isClosable: true,
				position: "bottom",
			});
			setLoading(false);
		}
	};

	return (
		<VStack spacing="5px" color="black">
			<FormControl id="email" isRequired>
				<FormLabel>Email</FormLabel>
				<Input
					type="email"
					placeholder="Enter Your Email Address"
					onChange={(e) => setEmail(e.target.value)}
					value={email}
				/>
			</FormControl>
			<FormControl id="password" isRequired>
				<FormLabel>Password</FormLabel>
				<InputGroup size="md">
					<Input
						type={show ? "text" : "password"}
						placeholder="Password"
						onChange={(e) => setPassword(e.target.value)}
						value={password}
					/>
					<InputRightElement width="4.5rem">
						<Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
							{show ? "Hide" : "Show"}
						</Button>
					</InputRightElement>
				</InputGroup>
			</FormControl>
			<Button
				colorScheme="blue"
				width="100%"
				style={{ marginTop: 15 }}
				onClick={submitHandler}
				isLoading={loading}
			>
				Login
			</Button>
			<Button
				colorScheme="red"
				width="100%"
				style={{ marginTop: 15 }}
				onClick={() => {
					setEmail("visitor2024@gmail.com");
					setPassword("visitor25#");
				}}
			>
				Get Visitor Credentials
			</Button>
		</VStack>
	);
};

export default Login;
