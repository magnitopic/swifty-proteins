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

interface RegisterScreenProps {
	onNavigateToLogin?: () => void;
}

export default function SignUpScreen({ onNavigateToLogin }: RegisterScreenProps) {
	const [fullName, setFullName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	return (
		<View className="flex-1 bg-white">
			<StatusBar style="dark" />

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
						<View className="flex-row justify-start px-8 mt-8">
							<CustomButton
								variant='outline'
								className="rounded-full py-1 flex flex-row items-center"
								onPress={onNavigateToLogin}
							>
								<View className="flex-row items-center">
									<Ionicons name="return-up-back" size={24} color="#9333EA" />
									<Text className="font-bold text-purple-600 ml-2">Go Back</Text>
								</View>
							</CustomButton>
						</View>

						<View className="px-8 mt-8 mb-8">
							<Text className="text-3xl font-bold text-gray-800">
								Create Account
							</Text>
						</View>

						{/* Form */}
						<View className="px-8">

							{/* Full Name input */}
							<View className="mb-4">
								<Text className="text-gray-700 font-medium ml-1 mb-1">Full Name</Text>
								<TextInput
									className="p-4 bg-gray-50 text-gray-700 rounded-2xl border border-gray-200 w-full"
									placeholder="John Doe"
									placeholderTextColor={'gray'}
									value={fullName}
									onChangeText={setFullName}
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
								/>
							</View>

							{/* Sign Up button */}
							<CustomButton
							className='mt-2'
								onPress={() => console.log('Sign Up Pressed')}
							>
								Sign Up
							</CustomButton>
						</View>

						{/* Already have an account span */}
						<View className="flex-row justify-center mt-8 mb-10">
							<Text className="text-gray-500 font-medium">Already have an account? </Text>
							<TouchableOpacity onPress={onNavigateToLogin}>
								<Text className="font-bold text-purple-600">Log In</Text>
							</TouchableOpacity>
						</View>

					</ScrollView>
				</KeyboardAvoidingView>
			</SafeAreaView>
		</View>
	);
}