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

						<View className="flex-row justify-start px-8 mt-4">
							<CustomButton
								variant='outline'
								className="rounded-full py-1"
								onPress={onNavigateToLogin}
							>
								← Back
							</CustomButton>
						</View>

						<View className="px-8 mt-10 mb-8">
							<Text className="text-3xl font-bold text-gray-800">
								Create Account
							</Text>
						</View>

						<View className="px-8">

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

							<View className="mb-4">
								<Text className="text-gray-700 font-medium ml-1 mb-1">Email Address</Text>
								<TextInput
									className="p-4 bg-gray-50 text-gray-700 rounded-2xl border border-gray-200 w-full"
									placeholder="name@example.com"
									placeholderTextColor={'gray'}
									value={email}
									onChangeText={setEmail}
									keyboardType="email-address"
									autoCapitalize="none"
								/>
							</View>

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

							<CustomButton
							className='mt-2'
								onPress={() => console.log('Sign Up Pressed')}
							>
								Sign Up
							</CustomButton>
						</View>

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