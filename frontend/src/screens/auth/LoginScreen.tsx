import React, { useState } from "react";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { CustomButton } from "../../components/CustomButton";
import { Ionicons } from "@expo/vector-icons";

interface LoginScreenProps {
	onNavigateToRegister?: () => void;
	onNavigateToMain?: () => void;
}

export default function LoginScreen({
	onNavigateToRegister,
	onNavigateToMain,
}: LoginScreenProps) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	return (
		<View className="flex-1 bg-white">
			<StatusBar style="dark" />

			<SafeAreaView className="flex-1">
				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : "height"}
					className="flex-1"
				>
					<ScrollView
						contentContainerStyle={{ flexGrow: 1 }}
						showsVerticalScrollIndicator={false}
					>
						{/* Logo */}
						<View className="flex-row justify-center mt-10 mb-8">
							<View className="w-24 h-24 rounded-xl justify-center items-center overflow-hidden">
								<Image
									source={require("../../../assets/icons/favicon.png")}
									className="w-20 h-20"
									resizeMode="contain"
								/>
							</View>
						</View>

						<View className="px-8 mb-8">
							<Text className="text-3xl font-bold text-gray-800 text-center">
								Hello again!
							</Text>
							<Text className="text-gray-500 text-center mt-2">
								Enter your credentials to continue
							</Text>
						</View>

						{/* Form */}
						<View className="px-8">
							{/* Email input */}
							<View className="mb-4">
								<Text className="text-gray-700 font-medium ml-1 mb-1">
									Email
								</Text>
								<TextInput
									className="p-4 bg-gray-50 text-gray-700 rounded-2xl border border-gray-200 w-full"
									placeholder="example@email.com"
									placeholderTextColor={"gray"}
									value={email}
									onChangeText={setEmail}
									keyboardType="email-address"
									autoCapitalize="none"
								/>
							</View>
							{/* Password input */}
							<View className="mb-4">
								<Text className="text-gray-700 font-medium ml-1 mb-1">
									Password
								</Text>
								<TextInput
									className="p-4 bg-gray-50 text-gray-700 rounded-2xl border border-gray-200 w-full"
									placeholder="********"
									placeholderTextColor={"gray"}
									value={password}
									onChangeText={setPassword}
									secureTextEntry
								/>
								<TouchableOpacity className="flex items-end my-1">
									<Text className="text-primary font-semibold">
										Forgot your password?
									</Text>
								</TouchableOpacity>
							</View>

							{/* Sign in button */}
							<CustomButton onPress={() => onNavigateToMain?.()}>
								Sign In
							</CustomButton>
						</View>

						{/* Or continue with */}
						<View className="flex-row justify-center items-center mt-10">
							<View className="border-b border-gray-300 w-16" />
							<Text className="text-gray-400 mx-2">
								Or continue with
							</Text>
							<View className="border-b border-gray-300 w-16" />
						</View>

						{/* Add fingerprint button */}
						<View className="flex-row justify-center">
							<TouchableOpacity
								onPress={() =>
									console.log("Fingerprint Pressed")
								}
								className="w-20 h-20 mt-2 rounded-full justify-center items-center"
							>
								<Ionicons
									name="finger-print-sharp"
									size={54}
									color="#0EA5E9"
								/>
							</TouchableOpacity>
						</View>

						{/* Sign up button */}
						<View className="flex-row justify-center mt-6">
							<Text className="text-gray-500 font-medium">
								Don't have an account?{" "}
							</Text>
							<TouchableOpacity onPress={onNavigateToRegister}>
								<Text className="font-bold text-primary">
									Sign Up
								</Text>
							</TouchableOpacity>
						</View>
					</ScrollView>
				</KeyboardAvoidingView>
			</SafeAreaView>
		</View>
	);
}
