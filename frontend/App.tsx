import React, { useState, useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";
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
	
	const appState = useRef(AppState.currentState);

	const [currentLigandId, setCurrentLigandId] = useState<string>("");
	const [currentPdbData, setCurrentPdbData] = useState<string>("");

	useEffect(() => {
		const subscription = AppState.addEventListener(
			"change",
			(nextAppState: AppStateStatus) => {
				// If the app is coming to the foreground (from background or inactive)
				if (
					appState.current.match(/inactive|background/) &&
					nextAppState === "active"
				) {
					// Reset to Login screen
					setCurrentScreen("Login");
				}

				appState.current = nextAppState;
			}
		);

		return () => {
			subscription.remove();
		};
	}, []);

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
					onNavigateToLigandView={(ligandId: string, pdbData: string) => {
						setCurrentLigandId(ligandId);
						setCurrentPdbData(pdbData);
						setCurrentScreen("LigandView");
					}}
				/>
			)}
			{currentScreen === "LigandView" && (
				<LigandViewScreen
					onNavigateBack={() => setCurrentScreen("ListProtein")}
					ligandId={currentLigandId}
					pdbData={currentPdbData}
				/>
			)}
		</>
	);
}
