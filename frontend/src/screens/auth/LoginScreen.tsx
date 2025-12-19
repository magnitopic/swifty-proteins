import React, { useEffect, useState } from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

// Local imports
import { CustomButton } from '../../components/CustomButton';
import { MessageBox } from '../../components/MessageBox';
import { login } from '../../services';

interface LoginScreenProps {
	onNavigateToRegister?: () => void;
	onNavigateToHome?: () => void;
}

export default function LoginScreen({ onNavigateToRegister, onNavigateToHome }: LoginScreenProps) {
	const [username, setusername] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	// Message box states
	const [showMessage, setShowMessage] = useState(false);
	const [messageType, setMessageType] = useState<"success" | "error" | "info" | "app">("info");
	const [messageText, setMessageText] = useState("");
	const [messageButton, setMessageButton] = useState<{ text: string; onPress: () => void } | undefined>();

	const [isBiometricSupported, setIsBiometricSupported] = useState(false);

	// Check biometric support
	useEffect(() => {
		(async () => {
			const compatible = await LocalAuthentication.hasHardwareAsync();
			const enrolled = await LocalAuthentication.isEnrolledAsync();
			setIsBiometricSupported(compatible && enrolled);
		})();
	}, []);

	const handleLogin = async () => {
		// Data validation
		if (!username || !password) {
			setMessageType("error");
			setMessageText("Please fill in all fields");
			setMessageButton(undefined);
			setShowMessage(true);
			setTimeout(() => setShowMessage(false), 3000);
			return;
		}

		try {
			setIsLoading(true);

			// Call to login service
			const response = await login({
				username: username,
				password: password
			});

			// Save tokens in secure storage & redirect to home
			await SecureStore.setItemAsync('userToken', response.accessToken);
			await SecureStore.setItemAsync('refreshToken', response.refreshToken);
			await SecureStore.setItemAsync('user', JSON.stringify(response.user));
			onNavigateToHome?.();

		} catch (error: any) {
			const message = error.response?.data?.message || "An unexpected error occurred, please try again later";
			setMessageType("error");
			setMessageText(message);
			setMessageButton(undefined);
			setShowMessage(true);
			setTimeout(() => setShowMessage(false), 4000);
		} finally {
			setIsLoading(false);
		}
	};

	const handleBiometricAuth = async () => {
		try {
			const result = await LocalAuthentication.authenticateAsync({
				promptMessage: 'Login with biometry',
				fallbackLabel: 'Use password',
				disableDeviceFallback: false,
			});

			if (result.success) {
				const savedToken = await SecureStore.getItemAsync('userToken');

				if (savedToken) {
					setMessageType("success");
					setMessageText("Signing in...");
					setShowMessage(true);

					setTimeout(() => {
						setShowMessage(false);
						onNavigateToHome?.();
					}, 1500);
				} else {
					setMessageType("error");
					setMessageText("Please, sign in with your credentials");
					setShowMessage(true);
				}
			}
		} catch (error) {
			console.error(error);
			setMessageText("Error in biometric authentication");
			setShowMessage(true);
		}
	};

	return (
		<View className="flex-1 bg-white">
			<StatusBar style="dark" />

			{/* Message Box */}
			<MessageBox
				type={messageType}
				message={messageText}
				show={showMessage}
				buttonText={messageButton?.text}
				onButtonPress={messageButton?.onPress}
			/>

			<SafeAreaView className="flex-1">
				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : "height"}
					className="flex-1"
				>
					<ScrollView
						contentContainerStyle={{ flexGrow: 1 }}
						showsVerticalScrollIndicator={false}
					>
						{/* Logo  TODO: insert app logo */}
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
							{/* username input */}
							<View className="mb-4">
								<Text className="text-gray-700 font-medium ml-1 mb-1">Username</Text>
								<TextInput
									className="p-4 bg-gray-50 text-gray-700 rounded-2xl border border-gray-200 w-full"
									placeholder="username42"
									placeholderTextColor={'gray'}
									value={username}
									onChangeText={setusername}
									autoCapitalize="none"
									editable={!isLoading}
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
									editable={!isLoading}
								/>
								<TouchableOpacity className="flex items-end my-1">
									<Text className="text-primary font-semibold">
										Forgot your password?
									</Text>
								</TouchableOpacity>
							</View>

							{/* Sign in button */}
							<CustomButton
								onPress={handleLogin}
								disabled={isLoading}
							>
								{isLoading ? 'Signing in...' : 'Sign In'}
							</CustomButton>
						</View>

						{/* Add fingerprint button */}
						{isBiometricSupported && (
							<>
								<View className="flex-row justify-center items-center mt-10">
									<View className="border-b border-gray-300 w-16" />
									<Text className="text-gray-400 mx-2">Or continue with</Text>
									<View className="border-b border-gray-300 w-16" />
								</View>


								<View className="flex-row justify-center">
									<TouchableOpacity
										onPress={handleBiometricAuth}
										className="w-20 h-20 mt-2 rounded-full justify-center items-center">
										<Ionicons name="finger-print-sharp" size={54} color="#9333EA" />
									</TouchableOpacity>
								</View>
							</>
						)}

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
