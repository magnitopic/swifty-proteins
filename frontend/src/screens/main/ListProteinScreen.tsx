import React, { useState, useEffect } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system/legacy";
import LigandListItem from "../../components/LigandListItem";
import { TopBar } from "../../components/TopBar";
import * as SecureStore from "expo-secure-store";
import { getPdb } from "../../services/pdbService";
import SearchBar from "../../components/SearchBar";
import { MessageBox } from "../../components/MessageBox";

interface ListProteinScreenProps {
	onNavigateBack?: () => void;
	onNavigateToLigandView?: (ligandId: string, pdbData: string) => void;
}

interface UserProps {
	username: string;
}

export default function ListProteinScreen({
	onNavigateBack,
	onNavigateToLigandView,
}: ListProteinScreenProps) {
	const [ligands, setLigands] = useState<string[]>([]);
	const [ligandsCount, setLigandsCount] = useState(0);
	const [filteredLigands, setFilteredLigands] = useState<string[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [loading, setLoading] = useState(true);
	const [loadingLigand, setLoadingLigand] = useState(false);
	const [user, setUser] = useState<UserProps>();
	const [errorMessage, setErrorMessage] = useState("");
	const [showError, setShowError] = useState(false);

	useEffect(() => {
		loadLigandsFromFile();
		getLoggedUser();
	}, []);

	const getLoggedUser = async () => {
		const user = await SecureStore.getItemAsync("user");
		setUser(JSON.parse(user || "{}"));
	};

	const loadLigandsFromFile = async () => {
		try {
			// Load the text file from assets
			const asset = Asset.fromModule(
				require("../../../assets/ligands.txt")
			);
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
			setLigandsCount(ligandList.length);
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
			setLigandsCount(ligands.length);
		} else {
			const filtered = ligands.filter((ligand) =>
				ligand.toLowerCase().includes(query.toLowerCase())
			);
			setFilteredLigands(filtered);
			setLigandsCount(filtered.length);
		}
	};

	const handleLigandPress = async (ligandName: string) => {
		console.log("Selected:", ligandName);
		setLoadingLigand(true);
		setShowError(false);
		try {
			const pdbData = await getPdb(ligandName);
			onNavigateToLigandView?.(ligandName, pdbData);
		} catch (error: any) {
			setErrorMessage("Failed to load ligand data");
			setShowError(true);
			console.log("Error loading ligand:", error);
		} finally {
			setLoadingLigand(false);
		}
	};

	const renderLigandItem = ({ item }: { item: string }) => (
		<LigandListItem ligandName={item} onPress={handleLigandPress} />
	);

	return (
		<View className="flex-1 bg-background-main">
			<StatusBar style="dark" />
			<MessageBox
				type="error"
				message={errorMessage}
				show={showError}
				buttonText="Dismiss"
				onButtonPress={() => setShowError(false)}
			/>
			<SafeAreaView className="flex-1">
				{/* Header with back button */}
				<TopBar
					title="Protein Ligands"
					onBackPress={onNavigateBack}
					counter={ligandsCount}
				/>

				{user?.username && (
					<Text className="self-center text-xl font-medium text-font-main mt-3">
						Hi {user?.username}!
					</Text>
				)}

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

				{/* Loading overlay when fetching ligand data */}
				{loadingLigand && (
					<View className="absolute inset-0 bg-black/50 justify-center items-center z-40 w-full h-full">
						<View className="bg-white rounded-lg p-6 items-center">
							<ActivityIndicator size="large" color="#0EA5E9" />
							<Text className="text-gray-800 mt-4 text-base">
								Loading ligand data...
							</Text>
						</View>
					</View>
				)}
			</SafeAreaView>
		</View>
	);
}
