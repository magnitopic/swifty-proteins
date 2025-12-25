import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	ActivityIndicator,
	Share,
	Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { TopBar } from "../../components/TopBar";
import * as SecureStore from "expo-secure-store";
import AtomTooltip from "../../components/AtomTooltip";
import { parsePDB, Atom, PDBData } from "../../utils/pdbParser";

interface LigandViewScreenProps {
	onNavigateBack?: () => void;
	ligandId: string;
	pdbData: string;
}

interface UserProps {
	username: string;
}

export default function LigandViewScreen({
	onNavigateBack,
	ligandId,
	pdbData,
}: LigandViewScreenProps) {
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState<UserProps>();
	const [parsedData, setParsedData] = useState<PDBData | null>(null);
	const [selectedAtom, setSelectedAtom] = useState<Atom | null>(null);
	const [showTooltip, setShowTooltip] = useState(false);

	useEffect(() => {
		setLoading(true);
		getLoggedUser();
		// Parse PDB data
		try {
			const parsed = parsePDB(pdbData);
			setParsedData(parsed);
			console.log(
				`Parsed ${parsed.atoms.length} atoms and ${parsed.bonds.length} bonds`
			);
		} catch (error) {
			console.error("Error parsing PDB data:", error);
			Alert.alert("Error", "Failed to parse protein structure");
		}
		setLoading(false);
	}, [pdbData]);

	const getLoggedUser = async () => {
		const user = await SecureStore.getItemAsync("user");
		setUser(JSON.parse(user || "{}"));
	};

	const handleShare = async () => {
		try {
			await Share.share({
				message: `Check out this protein ligand: ${ligandId}\n\nAtoms: ${
					parsedData?.atoms.length || 0
				}\nBonds: ${parsedData?.bonds.length || 0}`,
				title: `Protein Ligand: ${ligandId}`,
			});
		} catch (error) {
			console.error("Error sharing:", error);
		}
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

				{/* Atom Tooltip */}
				<AtomTooltip
					atom={selectedAtom}
					visible={showTooltip}
					onClose={() => setShowTooltip(false)}
				/>

				{/* Share button */}
				<View className="absolute bottom-20 right-6">
					<TouchableOpacity
						onPress={handleShare}
						className="bg-primary border-2 border-primary-dark rounded-full p-3 shadow-lg"
					>
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
