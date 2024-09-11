import React, { useEffect } from "react";
import { Container, Box, Text } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import LoginPage from "../components/Authentication/Login";
import SignupPage from "../components/Authentication/Signup";
import { useHistory } from "react-router-dom";

const HomePage = () => {
	const history = useHistory();

	useEffect(() => {
		const userInfo = JSON.parse(localStorage.getItem("userInfo"));

		if (userInfo) {
			history.push("/");
		}
	}, [history]);

	return (
		<Container maxW={"xl"} centerContent>
			<Box
				p={3}
				bg="white"
				w="100%"
				m="40px 0 15px 0"
				borderRadius={"1g"}
				borderWidth={"1px"}
			>
				<Text
					fontSize={"large"}
					color="black"
					fontFamily={"Work sans"}
					align={"center"}
				>
					Talk-A-Tive
				</Text>
			</Box>
			<Box
				bg="white"
				w="100%"
				p={4}
				borderRadius="lg"
				color="black"
				borderWidth={"1px"}
			>
				<Tabs variant="soft-rounded">
					<TabList mb="1em">
						<Tab width="50%">Login</Tab>
						<Tab width="50%">SignUp</Tab>
					</TabList>
					<TabPanels>
						<TabPanel>
							<LoginPage />
						</TabPanel>
						<TabPanel>
							<SignupPage />
						</TabPanel>
					</TabPanels>
				</Tabs>
			</Box>
		</Container>
	);
};

export default HomePage;
