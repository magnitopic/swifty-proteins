import * as React from "react";
import {
  TouchableOpacity,
  Text,
  GestureResponderEvent,
  ViewStyle,
} from "react-native";


export interface ButtonProps {
  className?: string;
  style?: ViewStyle; 
  variant?: "default" | "outline" | "like" | "none";
  onPress?: (e: GestureResponderEvent) => void;
  children: React.ReactNode;
  disabled?: boolean;
}

const CustomButton: React.FC<ButtonProps> = ({ 
    className, 
    variant = "default", 
    onPress, 
    children, 
    disabled,
    ...props 
}) => {
  const containerCommon =
    "inline-flex items-center justify-center transition duration-150 active:scale-90";

  const containerBase =
    variant === "like"
      ? containerCommon
      : `px-2.5 py-3 rounded-3xl ${containerCommon}`; 

  const containerVariantClasses = {
    default: "bg-purple-600 pressed:bg-purple-800",
    
    outline: "border-2 border-purple-600 bg-white/50 pressed:bg-purple-100",
    
    like: "rounded-full",
    
    none: "",
  };

  const textCommon = "font-semibold text-lg";

  const textVariantClasses = {
    default: "text-white",
    
    outline: "text-purple-600", 
    
    like: "text-black", 
    
    none: "",
  };
  
  const handlePress = (e: GestureResponderEvent) => {
    if (!onPress || disabled) return;
    
    setTimeout(() => {
        onPress(e);
    }, 150);
  };
  
  const combinedContainerClasses = `${containerBase} ${containerVariantClasses[variant]} ${className || ''}`;
  
  const combinedTextClasses = `${textCommon} ${textVariantClasses[variant]}`; 

  return (
    <TouchableOpacity
      className={combinedContainerClasses}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={variant === "like" ? 0.6 : 0.8}
      {...props}
    >
      <Text className={combinedTextClasses}> 
        {children}
      </Text>
    </TouchableOpacity>
  );
};

export { CustomButton };