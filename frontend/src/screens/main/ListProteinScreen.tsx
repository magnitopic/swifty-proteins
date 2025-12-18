import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	FlatList,
	ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system/legacy";
import LigandListItem from "../../components/LigandListItem";

interface ListProteinScreenProps {
	onNavigateBack?: () => void;
}

export default function ListProteinScreen({
	onNavigateBack,
}: ListProteinScreenProps) {
	const [ligands, setLigands] = useState<string[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		loadLigandsFromFile();
	}, []);

	const loadLigandsFromFile = async () => {
		try {
			// Load the text file from assets
			const asset = Asset.fromModule(require("../../../assets/ligands.txt"));
			await asset.downloadAsync();

			// Read the file content using legacy API
			const fileContent = await FileSystem.readAsStringAsync(
				asset.localUri
			);

			// Split by lines and filter out empty lines
			const ligandList = fileContent
				.split("\n")
				.map((line) => line.trim())
				.filter((line) => line !== "");

			setLigands(ligandList);
			setLoading(false);
		} catch (error) {
			console.error("Error loading ligands file:", error);
			setLoading(false);
		}
	};

	const handleLigandPress = (ligandName: string) => {
		console.log("Selected:", ligandName);
		// TODO: Navigate to ligand detail screen
	};

	const renderLigandItem = ({ item }: { item: string }) => (
		<LigandListItem ligandName={item} onPress={handleLigandPress} />
	);

	return (
		<View className="flex-1 bg-background-main">
			<StatusBar style="dark" />
			<SafeAreaView className="flex-1">
				{/* Header with back button */}
				<View className="flex-row items-center px-4 py-3 bg-white border-b border-border-color">
					<TouchableOpacity onPress={onNavigateBack} className="p-2">
						<Ionicons name="arrow-back" size={24} color="#0EA5E9" />
					</TouchableOpacity>
					<Text className="text-xl font-semibold text-gray-800 ml-2">
						Protein Ligands
					</Text>
					<View className="ml-auto bg-primary-light px-3 py-1 rounded-full">
						<Text className="text-primary font-semibold text-sm">
							{ligands.length}
						</Text>
					</View>
				</View>

				{/* Show loading indicator while loading */}
				{loading ? (
					<View className="flex-1 justify-center items-center">
						<ActivityIndicator size="large" color="#0EA5E9" />
					</View>
				) : (
					<FlatList
						data={ligands}
						renderItem={renderLigandItem}
						keyExtractor={(item, index) => `${item}-${index}`}
						contentContainerStyle={{
							paddingTop: 16,
							paddingBottom: 16,
						}}
						ListEmptyComponent={
							<View className="flex-1 justify-center items-center py-20">
								<Text className="text-gray-400 text-lg">
									No ligands found
								</Text>
							</View>
						}
						showsVerticalScrollIndicator={false}
					/>
				)}
			</SafeAreaView>
		</View>
	);
}
