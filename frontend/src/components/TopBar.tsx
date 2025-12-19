import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TopBarProps {
    title: string;
    onBackPress?: () => void;
    showBackButton?: boolean;
    counter?: number;
    showCounter?: boolean;
    rightElement?: React.ReactNode;
}

export const TopBar: React.FC<TopBarProps> = ({
    title,
    onBackPress,
    showBackButton = true,
    counter,
    showCounter = true,
    rightElement,
}) => {
    return (
        <View className="flex-row items-center px-4 py-3 bg-white border-b border-border-color">
            {/* Back button */}
            {showBackButton && onBackPress && (
                <TouchableOpacity onPress={onBackPress} className="p-2">
                    <Ionicons name="arrow-back" size={24} color="#0EA5E9" />
                </TouchableOpacity>
            )}

            {/* Title */}
            <Text className={`text-xl font-semibold text-gray-800 ${showBackButton ? 'ml-2' : ''}`}>
                {title}
            </Text>

            {/* Right side - Counter or custom element */}
            {rightElement ? (
                <View className="ml-auto">{rightElement}</View>
            ) : (
                showCounter && counter !== undefined && (
                    <View className="ml-auto bg-primary-light px-3 py-1 rounded-full">
                        <Text className="text-primary font-semibold text-sm">
                            {counter}
                        </Text>
                    </View>
                )
            )}
        </View>
    );
};
