import React from "react";
import { View, Text } from "react-native";
import { CustomButton } from "../../components/CustomButton";

interface HomeProps {
	onNavigateToLogin?: () => void;
}

export default function Home({onNavigateToLogin}: HomeProps) {
    return (
        <View className="items-center justify-center flex-1">
            <Text className="text-2xl font-bold">HomeScreen_test</Text>
            <View className="flex-row justify-start px-8 mt-8">
                <CustomButton
                    variant='outline'
                    className="rounded-full py-1 flex flex-row items-center"
                    onPress={onNavigateToLogin}
                >
                    <View className="flex-row items-center">
                        <Text className="font-bold text-purple-600 ml-2">Go Back</Text>
                    </View>
                </CustomButton>
            </View>
        </View>
    )
}