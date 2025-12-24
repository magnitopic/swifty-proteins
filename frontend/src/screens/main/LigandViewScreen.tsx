import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { TopBar } from "../../components/TopBar";
import { getPdb } from "../../services/pdbService";
import * as SecureStore from "expo-secure-store";

interface LigandViewScreenProps {
	onNavigateBack?: () => void;
	ligandId: string;
}

interface UserProps {
	username: string;
}

export default function LigandViewScreen({
	onNavigateBack,
	ligandId,
}: LigandViewScreenProps) {
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState<UserProps>();

	useEffect(() => {
		getLigandStructure();
		getLoggedUser();
	}, []);

	const getLigandStructure = async () => {
		setLoading(true);
		try {
			const pdbFile = await getPdb(ligandId);
			console.log("PDB file:\n" + pdbFile);
			console.log("_________________________");
		} catch (error) {
			console.log("Error getting pdb file:", error);
		} finally {
			setLoading(false);
		}
	};

	const getLoggedUser = async () => {
		const user = await SecureStore.getItemAsync("user");
		setUser(JSON.parse(user || "{}"));
	};

	return (
		<View className="flex-1 bg-background-main">
			<StatusBar style="dark" />
			<SafeAreaView className="flex-1">
				{/* Header with back button */}
				<TopBar
					title={`Ligand: ${ligandId}`}
					onBackPress={onNavigateBack}
				/>

				{/* Show loading indicator while loading */}
				{loading ? (
					<View className="flex-1 justify-center items-center">
						<ActivityIndicator size="large" color="#0EA5E9" />
					</View>
				) : (
					<View className="flex-1 justify-center items-center">
						{/* Model render */}
						<Text className="text-font-main text-xl text-center">
							.pdb loaded successfully in this Screen
						</Text>
						<Text className="text-primary font-medium text-xl text-center">
							Render ligand 3d
						</Text>
					</View>
				)}

				{/* Share button */}
				<View className="absolute bottom-20 right-6">
					<TouchableOpacity className="bg-primary border-2 border-primary-dark rounded-full p-3 text-center items-center justify-center">
						<Ionicons
							name="share-outline"
							size={36}
							color="white"
						/>
					</TouchableOpacity>
				</View>

				{/* Models buttons */}
				<View className="flex flex-row justify-center absolute bottom-40 gap-3 right-0 left-0">
					<TouchableOpacity className="border border-gray-400 bg-gray-100 p-1 px-2 rounded-full items-center justify-center">
						<Text className="text-gray-400 font-medium text-md">
							Model 1
						</Text>
					</TouchableOpacity>
					<TouchableOpacity className="border border-gray-400 bg-gray-100 p-1 px-2 rounded-full items-center justify-center">
						<Text className="text-gray-400 font-medium text-md">
							Model 2
						</Text>
					</TouchableOpacity>
					<TouchableOpacity className="border border-gray-400 bg-gray-100 p-1 px-2 rounded-full items-center justify-center">
						<Text className="text-gray-400 font-medium text-md">
							Model 3
						</Text>
					</TouchableOpacity>
				</View>
			</SafeAreaView>
		</View>
	);
}
