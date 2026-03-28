import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors } from '@/constants/colors';

interface TransparentButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function TransparentButton({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  style,
  textStyle,
}: TransparentButtonProps) {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 12,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.shadow.medium,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: colors.transparent.primary,
          borderColor: colors.glass.light,
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: colors.transparent.secondary,
          borderColor: colors.glass.medium,
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderColor: colors.glass.medium,
        };
      case 'ghost':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderColor: 'transparent',
        };
      default:
        return baseStyle;
    }
  };

  const getTextStyle = (): TextStyle => {
    const baseTextStyle: TextStyle = {
      fontWeight: '600',
      textAlign: 'center',
    };

    switch (variant) {
      case 'primary':
        return { ...baseTextStyle, color: colors.white.primary };
      case 'secondary':
        return { ...baseTextStyle, color: colors.white.primary };
      case 'outline':
        return { ...baseTextStyle, color: colors.white.primary };
      case 'ghost':
        return { ...baseTextStyle, color: colors.white.primary };
      default:
        return { ...baseTextStyle, color: colors.white.primary };
    }
  };

  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case 'small':
        return { paddingHorizontal: 16, paddingVertical: 8, minHeight: 36 };
      case 'medium':
        return { paddingHorizontal: 24, paddingVertical: 12, minHeight: 44 };
      case 'large':
        return { paddingHorizontal: 32, paddingVertical: 16, minHeight: 52 };
      default:
        return { paddingHorizontal: 24, paddingVertical: 12, minHeight: 44 };
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyle(),
        getSizeStyle(),
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={[styles.text, getTextStyle(), textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
});
