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
import { BiometricSetupModal } from './BiometricSetupModal';
import { login } from '../../services';

interface LoginScreenProps {
	onNavigateToRegister?: () => void;
	onNavigateToListProtein?: () => void;
}

export default function LoginScreen({ onNavigateToRegister, onNavigateToListProtein }: LoginScreenProps) {
	const [username, setusername] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	// Message box states
	const [showMessage, setShowMessage] = useState(false);
	const [messageType, setMessageType] = useState<"success" | "error" | "info" | "app">("info");
	const [messageText, setMessageText] = useState("");
	const [messageButton, setMessageButton] = useState<{ text: string; onPress: () => void } | undefined>();

	const [isBiometricSupported, setIsBiometricSupported] = useState(false);
	// Biometric setup modal state
	const [showBiometricSetupModal, setShowBiometricSetupModal] = useState(false);

	// Check biometric support
	useEffect(() => {
		(async () => {
			const biometricEnabled = await SecureStore.getItemAsync('biometricEnabled');
			if (biometricEnabled) {
				handleBiometricAuth();
			}
		})();
	}, []);

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

			// Save tokens in secure storage
			await SecureStore.setItemAsync('userToken', response.accessToken);
			await SecureStore.setItemAsync('refreshToken', response.refreshToken);
			await SecureStore.setItemAsync('user', JSON.stringify(response.user));

			// Check if we should show biometric setup modal
			if (isBiometricSupported) {
				const hasBiometricToken = await SecureStore.getItemAsync('biometricEnabled');
				if (!hasBiometricToken) {
					// Show modal to ask if user wants to enable biometric auth
					setShowBiometricSetupModal(true);
					return; // Don't navigate yet, wait for user's choice
				}
			}

			// Navigate to home if biometric modal is not shown
			onNavigateToListProtein?.();
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
			// Check if biometric is enabled first
			const biometricEnabled = await SecureStore.getItemAsync('biometricEnabled');

			if (!biometricEnabled) {
				setMessageType("info");
				setMessageText("Please sign in with your credentials first to enable biometric login");
				setShowMessage(true);
				setTimeout(() => setShowMessage(false), 3000);
				return;
			}

			const result = await LocalAuthentication.authenticateAsync({
				promptMessage: 'Login with biometry',
				cancelLabel: 'Use Password',
				disableDeviceFallback: true,
			});

			if (result.success) {
				const savedToken = await SecureStore.getItemAsync('refreshToken');

				if (savedToken) {
					onNavigateToListProtein?.();
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

	const handleEnableBiometric = async () => {
		try {
			// Mark that biometric authentication is enabled
			await SecureStore.setItemAsync('biometricEnabled', 'true');

			setShowBiometricSetupModal(false);

			// Show success message
			setMessageType("success");
			setMessageText("Biometric authentication enabled successfully!");
			setShowMessage(true);

			setTimeout(() => {
				setShowMessage(false);
				onNavigateToListProtein?.();
			}, 1500);
		} catch (error) {
			console.error('Error enabling biometric:', error);
			setShowBiometricSetupModal(false);
			onNavigateToListProtein?.();
		}
	};

	const handleSkipBiometric = () => {
		setShowBiometricSetupModal(false);
		onNavigateToListProtein?.();
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

			{/* Biometric Setup Modal */}
			<BiometricSetupModal
				visible={showBiometricSetupModal}
				onEnable={handleEnableBiometric}
				onSkip={handleSkipBiometric}
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
										<Ionicons name="finger-print-sharp" size={54} color="#0EA5E9" />
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
