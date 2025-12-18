import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

interface ListProteinScreenProps {
	onNavigateBack?: () => void;
}

export default function ListProteinScreen({
	onNavigateBack,
}: ListProteinScreenProps) {
	return (
		<View className="flex-1 bg-white">
			<StatusBar style="dark" />
			<SafeAreaView className="flex-1">
				{/* Header with back button */}
				<View className="flex-row items-center px-4 py-2">
					<TouchableOpacity onPress={onNavigateBack} className="p-2">
						<Ionicons name="arrow-back" size={24} color="#0EA5E9" />
					</TouchableOpacity>
					<Text className="text-xl font-semibold text-gray-800 ml-2">
						Protein List
					</Text>
				</View>

				<View className="flex-1 justify-center items-center px-8">
					<Text className="text-4xl font-bold text-primary mb-4">
						Hello World! 🧬
					</Text>
					<Text className="text-lg text-gray-600 text-center">
						Welcome to the Protein List Screen
					</Text>
				</View>
			</SafeAreaView>
		</View>
	);
}
