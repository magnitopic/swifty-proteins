import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	FlatList,
	ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system/legacy";
import LigandListItem from "../../components/LigandListItem";
import { TopBar } from "../../components/TopBar";
import { getPdb } from "../../services/pdbService";
import SearchBar from "../../components/SearchBar";

interface ListProteinScreenProps {
	onNavigateBack?: () => void;
}

export default function ListProteinScreen({
	onNavigateBack,
}: ListProteinScreenProps) {
	const [ligands, setLigands] = useState<string[]>([]);
	const [filteredLigands, setFilteredLigands] = useState<string[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
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
				asset.localUri || ""
			);

			// Split by lines and filter out empty lines
			const ligandList = fileContent
				.split("\n")
				.map((line) => line.trim())
				.filter((line) => line !== "");

			setLigands(ligandList);
			setFilteredLigands(ligandList);
			setLoading(false);
		} catch (error) {
			console.error("Error loading ligands file:", error);
			setLoading(false);
		}
	};

	const handleSearch = (query: string) => {
		setSearchQuery(query);
		if (query.trim() === "") {
			setFilteredLigands(ligands);
		} else {
			const filtered = ligands.filter((ligand) =>
				ligand.toLowerCase().includes(query.toLowerCase())
			);
			setFilteredLigands(filtered);
		}
	};

	const handleLigandPress = async (ligandName: string) => {
		console.log("Selected:", ligandName);
		try {
			const pdbFile = await getPdb(ligandName);
			console.log("PDB file:", pdbFile);
		} catch (error) {
			console.error("Error getting pdb file:", error);
		}
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
				<TopBar
					title="Protein Ligands"
					onBackPress={onNavigateBack}
					counter={ligands.length}
				/>

				{/* Search Bar */}
				{!loading && (
					<SearchBar
						value={searchQuery}
						onChangeText={handleSearch}
						placeholder="Search ligands..."
					/>
				)}

				{/* Show loading indicator while loading */}
				{loading ? (
					<View className="flex-1 justify-center items-center">
						<ActivityIndicator size="large" color="#0EA5E9" />
					</View>
				) : (
					<FlatList
						data={filteredLigands}
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
