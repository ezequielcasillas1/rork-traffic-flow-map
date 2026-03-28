import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';

interface TransparentCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'light' | 'medium' | 'heavy' | 'dark';
  padding?: number;
  margin?: number;
}

export function TransparentCard({ 
  children, 
  style, 
  variant = 'medium',
  padding = 20,
  margin = 0
}: TransparentCardProps) {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'light':
        return colors.glass.light;
      case 'medium':
        return colors.glass.medium;
      case 'heavy':
        return colors.glass.heavy;
      case 'dark':
        return colors.glass.dark;
      default:
        return colors.glass.medium;
    }
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: getBackgroundColor(),
          padding,
          margin,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.glass.light,
    shadowColor: colors.shadow.medium,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    backdropFilter: 'blur(20px)',
  },
});
