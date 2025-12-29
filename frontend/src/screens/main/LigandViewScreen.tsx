import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Share, Alert } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { TopBar } from "../../components/TopBar";
import * as SecureStore from "expo-secure-store";
import ProteinVisualizer from "../../components/ProteinVisualizer";
import AtomTooltip from "../../components/balls_and_sticks_model/AtomTooltip";
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
	const [user, setUser] = useState<UserProps>();
	const [parsedData, setParsedData] = useState<PDBData | null>(null);
	const [selectedAtom, setSelectedAtom] = useState<Atom | null>(null);
	const [showTooltip, setShowTooltip] = useState(false);
	const [displayMode, setDisplayMode] = useState<
		"space-filling" | "ribbon" | "ball-stick"
	>("ball-stick");

	useEffect(() => {
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
	}, [pdbData]);

	const getLoggedUser = async () => {
		const user = await SecureStore.getItemAsync("user");
		setUser(JSON.parse(user || "{}"));
	};

	const handleAtomClick = (atom: Atom) => {
		setSelectedAtom(atom);
		setShowTooltip(true);
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

	const handleModelChange = (
		mode: "space-filling" | "ribbon" | "ball-stick"
	) => {
		setDisplayMode(mode);
		// TODO: Implement different display modes
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

				{/* 3D Protein Visualization */}
				{parsedData ? (
					<View className="flex-1">
						<ProteinVisualizer
							pdbData={parsedData}
							onAtomClick={handleAtomClick}
						/>

						{/* Info overlay */}
						<View className="absolute top-4 left-4 bg-white/90 rounded-lg p-2 px-3">
							<Text className="text-gray-700 text-xs">
								Atoms: {parsedData.atoms.length}
							</Text>
							<Text className="text-gray-700 text-xs">
								Bonds: {parsedData.bonds.length}
							</Text>
						</View>
					</View>
				) : (
					<View className="flex-1 justify-center items-center">
						<Text className="text-gray-500">
							Loading structure...
						</Text>
					</View>
				)}

				{/* Atom Tooltip */}
				<AtomTooltip
					atom={selectedAtom}
					visible={showTooltip}
					onClose={() => setShowTooltip(false)}
				/>

				{/* Display Mode buttons */}
				<View className="flex flex-row justify-center absolute bottom-40 gap-3 right-0 left-0">
					<TouchableOpacity
						onPress={() => handleModelChange("space-filling")}
						className={`border ${
							displayMode === "space-filling"
								? "border-primary bg-primary-light"
								: "border-gray-400 bg-gray-100"
						} p-1 px-3 rounded-full`}
					>
						<Text
							className={`${
								displayMode === "space-filling"
									? "text-primary"
									: "text-gray-400"
							} font-medium text-sm`}
						>
							Space-filling
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => handleModelChange("ball-stick")}
						className={`border ${
							displayMode === "ball-stick"
								? "border-primary bg-primary-light"
								: "border-gray-400 bg-gray-100"
						} p-1 px-3 rounded-full`}
					>
						<Text
							className={`${
								displayMode === "ball-stick"
									? "text-primary"
									: "text-gray-400"
							} font-medium text-sm`}
						>
							Ball & Stick
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => handleModelChange("ribbon")}
						className={`border ${
							displayMode === "ribbon"
								? "border-primary bg-primary-light"
								: "border-gray-400 bg-gray-100"
						} p-1 px-3 rounded-full`}
					>
						<Text
							className={`${
								displayMode === "ribbon"
									? "text-primary"
									: "text-gray-400"
							} font-medium text-sm`}
						>
							Ribbon
						</Text>
					</TouchableOpacity>
				</View>

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
				
			</SafeAreaView>
		</View>
	);
}
