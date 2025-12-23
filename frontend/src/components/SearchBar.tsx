import React from "react";
import { View, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SearchBarProps {
	value: string;
	onChangeText: (text: string) => void;
	placeholder?: string;
}

export default function SearchBar({
	value,
	onChangeText,
	placeholder = "Search...",
}: SearchBarProps) {
	return (
		<View className="flex-row items-center bg-white mx-4 my-3 px-4 py-3 rounded-lg border border-border-color shadow-sm">
			<Ionicons name="search" size={20} color="#9CA3AF" />
			<TextInput
				value={value}
				onChangeText={onChangeText}
				placeholder={placeholder}
				placeholderTextColor="#9CA3AF"
				className="flex-1 ml-2 text-base text-gray-800"
				autoCapitalize="none"
				autoCorrect={false}
			/>
			{value.length > 0 && (
				<Ionicons
					name="close-circle"
					size={20}
					color="#9CA3AF"
					onPress={() => onChangeText("")}
				/>
			)}
		</View>
	);
}
