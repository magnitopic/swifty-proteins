import React from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { Atom } from "../utils/pdbParser";

interface AtomTooltipProps {
	atom: Atom | null;
	visible: boolean;
	onClose: () => void;
}

export default function AtomTooltip({ atom, visible, onClose }: AtomTooltipProps) {
	if (!atom) return null;

	return (
		<Modal
			visible={visible}
			transparent
			animationType="fade"
			onRequestClose={onClose}
		>
			<TouchableOpacity
				style={{
					flex: 1,
					backgroundColor: "rgba(0,0,0,0.5)",
					justifyContent: "center",
					alignItems: "center",
				}}
				activeOpacity={1}
				onPress={onClose}
			>
				<View className="bg-white rounded-lg p-4 mx-6 shadow-lg border border-gray-300">
					<Text className="text-xl font-bold text-primary mb-3">
						Atom Information
					</Text>

					<View className="space-y-2">
						<View className="flex-row justify-between">
							<Text className="text-gray-600">Element:</Text>
							<Text className="text-gray-800 font-semibold">
								{atom.element}
							</Text>
						</View>

						<View className="flex-row justify-between">
							<Text className="text-gray-600">Atom Name:</Text>
							<Text className="text-gray-800 font-semibold">
								{atom.name}
							</Text>
						</View>

						<View className="flex-row justify-between">
							<Text className="text-gray-600">Serial:</Text>
							<Text className="text-gray-800 font-semibold">
								{atom.serial}
							</Text>
						</View>

						<View className="flex-row justify-between">
							<Text className="text-gray-600">Residue:</Text>
							<Text className="text-gray-800 font-semibold">
								{atom.resName}
							</Text>
						</View>

						<View className="flex-row justify-between">
							<Text className="text-gray-600">Chain:</Text>
							<Text className="text-gray-800 font-semibold">
								{atom.chainId || "N/A"}
							</Text>
						</View>

						<View className="flex-row justify-between">
							<Text className="text-gray-600">Position:</Text>
							<Text className="text-gray-800 font-semibold text-xs">
								({atom.x.toFixed(2)}, {atom.y.toFixed(2)}, {atom.z.toFixed(2)})
							</Text>
						</View>
					</View>

					<TouchableOpacity
						onPress={onClose}
						className="bg-primary mt-4 py-2 px-4 rounded-lg"
					>
						<Text className="text-white text-center font-semibold">
							Close
						</Text>
					</TouchableOpacity>
				</View>
			</TouchableOpacity>
		</Modal>
	);
}
