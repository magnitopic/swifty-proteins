import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	FlatList,
	TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import LigandListItem from "../../components/LigandListItem";

interface ListProteinScreenProps {
	onNavigateBack?: () => void;
}

export default function ListProteinScreen({
	onNavigateBack,
}: ListProteinScreenProps) {
	const [ligands, setLigands] = useState<string[]>(["ATP", "NADH", "FAD"]);

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

				{/* Ligands List */}
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
			</SafeAreaView>
		</View>
	);
}
