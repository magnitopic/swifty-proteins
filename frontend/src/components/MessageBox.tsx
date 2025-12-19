import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";

interface MessageBoxProps {
    type: "success" | "error" | "info" | "app";
    message: string;
    show: boolean;
    buttonText?: string;
    onButtonPress?: () => void;
}

export const MessageBox: React.FC<MessageBoxProps> = ({
    type,
    message,
    show,
    buttonText,
    onButtonPress,
}) => {
    const [visible, setVisible] = useState(false);
    const fadeAnim = useState(new Animated.Value(0))[0];
    const scaleAnim = useState(new Animated.Value(0.9))[0];

    useEffect(() => {
        if (show) {
            setVisible(true);
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 8,
                    tension: 40,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 0.9,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start(() => setVisible(false));
        }
    }, [show]);

    if (!show && !visible) return null;

    // Define color schemes based on type
    const colorSchemes = {
        error: {
            bg: "bg-red-100",
            border: "border-red-500",
            text: "text-red-700",
            buttonBg: "bg-red-500",
            buttonText: "text-white",
        },
        success: {
            bg: "bg-green-100",
            border: "border-green-500",
            text: "text-green-700",
            buttonBg: "bg-green-500",
            buttonText: "text-white",
        },
        app: {
            bg: "bg-purple-100",
            border: "border-purple-600",
            text: "text-purple-700",
            buttonBg: "bg-purple-600",
            buttonText: "text-white",
        },
        info: {
            bg: "bg-orange-100",
            border: "border-orange-500",
            text: "text-orange-700",
            buttonBg: "bg-orange-500",
            buttonText: "text-white",
        },
    };

    const colors = colorSchemes[type];

    return (
        <Animated.View
            style={{
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
            }}
            className="absolute self-end top-14 mx-4 z-50"
        >
            <View
                className={`py-4 px-4 rounded-xl border ${colors.bg} ${colors.border} shadow-lg`}
            >
                <Text className={`text-center text-md font-medium ${colors.text}`}>{message}</Text>

                {buttonText && onButtonPress && (
                    <TouchableOpacity
                        onPress={onButtonPress}
                        className={`${colors.buttonBg} self-end py-2 px-4 rounded-lg mt-4`}
                        activeOpacity={0.8}
                    >
                        <Text className={`${colors.buttonText} font-semibold text-center`}>
                            {buttonText}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </Animated.View>
    );
};
