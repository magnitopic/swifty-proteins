import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    Animated,
    Dimensions,
    TouchableWithoutFeedback
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BiometricSetupModalProps {
    visible: boolean;
    onEnable: () => void;
    onSkip: () => void;
}

export const BiometricSetupModal: React.FC<BiometricSetupModalProps> = ({
    visible,
    onEnable,
    onSkip,
}) => {
    const [fadeAnim] = useState(new Animated.Value(0));
    const [scaleAnim] = useState(new Animated.Value(0.9));

    useEffect(() => {
        if (visible) {
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
            ]).start();
        }
    }, [visible]);

    return (
        <Modal
            transparent
            visible={visible}
            animationType="none"
            statusBarTranslucent
            onRequestClose={onSkip}
        >
            <TouchableWithoutFeedback onPress={onSkip}>
                <View className="flex-1 justify-center items-center bg-black/50">
                    <TouchableWithoutFeedback>
                        <Animated.View
                            style={{
                                opacity: fadeAnim,
                                transform: [{ scale: scaleAnim }],
                            }}
                            className="mx-8 bg-white rounded-3xl shadow-2xl overflow-hidden"
                        >
                            {/* Header with gradient effect */}
                            <View className="bg-sky-500 pt-8 pb-6 px-6 items-center">
                                <View className="w-20 h-20 bg-white/20 rounded-full items-center justify-center mb-4">
                                    <Ionicons name="finger-print" size={48} color="white" />
                                </View>
                                <Text className="text-white text-2xl font-bold text-center">
                                    Enable Biometric Login
                                </Text>
                            </View>

                            {/* Content */}
                            <View className="px-6 py-6">
                                <Text className="text-gray-700 text-base text-center leading-6">
                                    Would you like to enable biometric authentication for faster and more secure login?
                                </Text>
                                <Text className="text-gray-500 text-sm text-center mt-3 leading-5">
                                    You can use your fingerprint or face recognition to sign in next time.
                                </Text>
                            </View>

                            {/* Buttons */}
                            <View className="px-6 pb-6 gap-3">
                                {/* Enable Button */}
                                <TouchableOpacity
                                    onPress={onEnable}
                                    className="bg-sky-500 py-4 rounded-2xl shadow-lg"
                                    activeOpacity={0.8}
                                >
                                    <Text className="text-white text-center font-bold text-lg">
                                        Enable Now
                                    </Text>
                                </TouchableOpacity>

                                {/* Skip Button */}
                                <TouchableOpacity
                                    onPress={onSkip}
                                    className="bg-gray-100 py-4 rounded-2xl"
                                    activeOpacity={0.7}
                                >
                                    <Text className="text-gray-600 text-center font-semibold text-base">
                                        Maybe Later
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </Animated.View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};
