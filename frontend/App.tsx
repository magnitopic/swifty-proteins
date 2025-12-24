import React, { useState } from "react";
import LoginScreen from "./src/screens/auth/LoginScreen";
import SignUpScreen from "./src/screens/auth/RegisterScreen";
import ListProteinScreen from "./src/screens/main/ListProteinScreen";
import LigandViewScreen from "./src/screens/main/LigandViewScreen";

const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
if (!backendUrl) {
	throw new Error(
		"EXPO_PUBLIC_BACKEND_URL environment variable is not defined"
	);
}

export default function App() {
	const [currentScreen, setCurrentScreen] = useState<
		"Login" | "Register" | "ListProtein" | "LigandView"
	>("Login");

	const [currentLigandId, setCurrentLigandId] = useState<string>("");

	return (
		<>
			{currentScreen === "Login" && (
				<LoginScreen
					onNavigateToRegister={() => setCurrentScreen("Register")}
					onNavigateToListProtein={() => setCurrentScreen("ListProtein")}
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
					onNavigateToLigandView={(ligandId: string) => {
						setCurrentLigandId(ligandId);
						setCurrentScreen("LigandView");
					}}
				/>
			)}
			{currentScreen === "LigandView" && (
				<LigandViewScreen
					onNavigateBack={() => setCurrentScreen("ListProtein")}
					ligandId={currentLigandId}
				/>
			)}
		</>
	);
}
