import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface LigandListItemProps {
	ligandName: string;
	onPress: (ligandName: string) => void;
}

export default function LigandListItem({
	ligandName,
	onPress,
}: LigandListItemProps) {
	return (
		<TouchableOpacity
			className="bg-white border border-border-color rounded-xl p-4 mx-4 mb-3 active:bg-primary-light"
			onPress={() => onPress(ligandName)}
		>
			<View className="flex-row items-center justify-between">
				<View className="flex-row items-center flex-1">
					<View className="w-12 h-12 bg-primary-light rounded-full items-center justify-center mr-3">
						<Text className="text-primary font-bold text-lg">
							🧬
						</Text>
					</View>
					<View>
						<Text className="text-lg font-semibold text-gray-800">
							{ligandName}
						</Text>
						<Text className="text-sm text-gray-500">Ligand</Text>
					</View>
				</View>
				<Ionicons name="chevron-forward" size={20} color="#64748B" />
			</View>
		</TouchableOpacity>
	);
}
