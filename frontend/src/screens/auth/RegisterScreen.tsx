import React, { useState } from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	KeyboardAvoidingView,
	Platform,
	ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

// Local imports
import { CustomButton } from '../../components/CustomButton';
import { MessageBox } from '../../components/MessageBox';
import { register } from '../../services/authService';
import { TopBar } from '../../components/TopBar';

interface RegisterScreenProps {
	onNavigateToLogin?: () => void;
}

export default function SignUpScreen({ onNavigateToLogin }: RegisterScreenProps) {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	// Message box states
	const [showMessage, setShowMessage] = useState(false);
	const [messageType, setMessageType] = useState<"success" | "error" | "info" | "app">("info");
	const [messageText, setMessageText] = useState("");
	const [messageButton, setMessageButton] = useState<{ text: string; onPress: () => void } | undefined>();

	const handleRegister = async () => {
		// Data validation
		if (!username || !email || !password) {
			setMessageType("error");
			setMessageText("Please fill in all fields");
			setMessageButton(undefined);
			setShowMessage(true);
			setTimeout(() => setShowMessage(false), 3000);
			return;
		}

		try {
			setIsLoading(true); // Loading state

			// Call to service
			await register({
				username: username,
				email: email,
				password: password
			});

			// Success
			setMessageType("success");
			setMessageText("Your account has been registered successfully. You can now log in.");
			setShowMessage(true)
			setTimeout(() => onNavigateToLogin?.(), 3000);
		} catch (error: any) {
			// Error handling with detailed logging
			console.log('Registration error:', error);
			console.log('Response data:', error.response?.data);
			console.log('Response status:', error.response?.status);

			const message = error.response?.data?.message || "An unexpected error occurred";
			setMessageType("error");
			setMessageText(message);
			setMessageButton(undefined);
			setShowMessage(true);
			setTimeout(() => setShowMessage(false), 4000);
		} finally {
			setIsLoading(false); // End loading state
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
					behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
					className="flex-1"
				>
					<ScrollView
						contentContainerStyle={{ flexGrow: 1 }}
						showsVerticalScrollIndicator={false}
					>

						{/* Go back button */}
						{/* Header with back button */}
						<TopBar
							title="Go Back"
							onBackPress={onNavigateToLogin}
						/>

						<View className="px-8 mt-12 mb-8 items-center">
							<Text className="text-3xl font-bold text-gray-800">
								Create Account
							</Text>
						</View>

						{/* Form */}
						<View className="px-8">

							{/* Full Name input */}
							<View className="mb-4">
								<Text className="text-gray-700 font-medium ml-1 mb-1">Username</Text>
								<TextInput
									className="p-4 bg-gray-50 text-gray-700 rounded-2xl border border-gray-200 w-full"
									placeholder="JohnDoe42"
									placeholderTextColor={'gray'}
									value={username}
									onChangeText={setUsername}
									editable={!isLoading}
								/>
							</View>

							{/* Email input */}
							<View className="mb-4">
								<Text className="text-gray-700 font-medium ml-1 mb-1">Email Address</Text>
								<TextInput
									className="p-4 bg-gray-50 text-gray-700 rounded-2xl border border-gray-200 w-full"
									placeholder="name@example.com"
									placeholderTextColor={'gray'}
									value={email}
									onChangeText={setEmail}
									autoCapitalize="none"
									editable={!isLoading}
								/>
							</View>

							{/* Password input */}
							<View className="mb-4">
								<Text className="text-gray-700 font-medium ml-1 mb-1">Password</Text>
								<TextInput
									className="p-4 bg-gray-50 text-gray-700 rounded-2xl border border-gray-200 w-full"
									placeholder="********"
									placeholderTextColor={'gray'}
									value={password}
									onChangeText={setPassword}
									secureTextEntry
									editable={!isLoading}
								/>
							</View>

							{/* Sign Up button */}
							<CustomButton
								className='mt-2'
								onPress={handleRegister}
								disabled={isLoading}
							>
								{isLoading ? 'Signing up...' : 'Sign Up'}
							</CustomButton>
						</View>

						{/* Already have an account span */}
						<View className="flex-row justify-center mt-8 mb-10">
							<Text className="text-gray-500 font-medium">Already have an account? </Text>
							<TouchableOpacity onPress={onNavigateToLogin}>
								<Text className="font-bold text-primary">Log In</Text>
							</TouchableOpacity>
						</View>

					</ScrollView>
				</KeyboardAvoidingView>
			</SafeAreaView>
		</View>
	);
}