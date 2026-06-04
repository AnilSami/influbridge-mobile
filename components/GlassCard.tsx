import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors, Shadows } from '../constants/DesignSystem';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
}

export default function GlassCard({ children, style, intensity = 40 }: GlassCardProps) {
  // Use BlurView on iOS/Android if available, fallback to translucent View for cross-platform robustness
  return (
    <View style={[styles.cardOuter, style]}>
      <BlurView intensity={intensity} tint="dark" style={styles.blurContainer}>
        {children}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  cardOuter: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.cardBg,
    ...Shadows.card,
  },
  blurContainer: {
    padding: 16,
    borderRadius: 20,
  }
});
