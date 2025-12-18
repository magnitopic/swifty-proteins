import React, { useState } from "react";
import LoginScreen from "./src/screens/auth/LoginScreen";
import SignUpScreen from "./src/screens/auth/RegisterScreen";
import ListProteinScreen from "./src/screens/main/ListProteinScreen";

const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
if (!backendUrl) {
	throw new Error(
		"EXPO_PUBLIC_BACKEND_URL environment variable is not defined"
	);
}

export default function App() {
	const [currentScreen, setCurrentScreen] = useState<
		"Login" | "Register" | "ListProtein"
	>("Login");

	return (
		<>
			{currentScreen === "Login" && (
				<LoginScreen
					onNavigateToRegister={() => setCurrentScreen("Register")}
					onNavigateToMain={() => setCurrentScreen("ListProtein")}
				/>
			)}
			{currentScreen === "Register" && (
				<SignUpScreen
					onNavigateToLogin={() => setCurrentScreen("Login")}
				/>
			)}
			{currentScreen === "ListProtein" && (
				<ListProteinScreen
					onNavigateBack={() => setCurrentScreen("Login")}
				/>
			)}
		</>
	);
}
