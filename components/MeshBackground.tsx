import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/DesignSystem';

interface MeshBackgroundProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export default function MeshBackground({ children, style }: MeshBackgroundProps) {
  return (
    <View style={[styles.container, style]}>
      {/* Glow 1: Indigo Top Left */}
      <LinearGradient
        colors={['rgba(99, 102, 241, 0.15)', 'rgba(99, 102, 241, 0.0)'] as const}
        style={styles.glowTopLeft}
      />
      {/* Glow 2: Emerald Center Right */}
      <LinearGradient
        colors={['rgba(16, 185, 129, 0.08)', 'rgba(16, 185, 129, 0.0)'] as const}
        style={styles.glowCenterRight}
      />
      {/* Glow 3: Electric Blue Bottom Left */}
      <LinearGradient
        colors={['rgba(59, 130, 246, 0.1)', 'rgba(59, 130, 246, 0.0)'] as const}
        style={styles.glowBottomLeft}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    position: 'relative',
  },
  glowTopLeft: {
    position: 'absolute',
    top: -150,
    left: -100,
    width: 350,
    height: 350,
    borderRadius: 175,
  },
  glowCenterRight: {
    position: 'absolute',
    top: '30%',
    right: -150,
    width: 400,
    height: 400,
    borderRadius: 200,
  },
  glowBottomLeft: {
    position: 'absolute',
    bottom: -100,
    left: -100,
    width: 350,
    height: 350,
    borderRadius: 175,
  }
});
