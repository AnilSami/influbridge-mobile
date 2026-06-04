import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients, Shadows, Typography } from '../constants/DesignSystem';

interface GradientButtonProps {
  onPress: () => void;
  title: string;
  colors?: readonly [string, string, ...string[]];
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export default function GradientButton({
  onPress,
  title,
  colors = Gradients.primary,
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon
}: GradientButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
      style={[styles.btnOuter, style, disabled && styles.disabled]}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" size="small" />
        ) : (
          <React.Fragment>
            {icon && <React.Fragment>{icon}</React.Fragment>}
            <Text style={[Typography.btnText, textStyle, icon ? { marginLeft: 6 } : null]}>
              {title}
            </Text>
          </React.Fragment>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btnOuter: {
    borderRadius: 14,
    overflow: 'hidden',
    ...Shadows.glowPrimary,
  },
  gradient: {
    height: 48,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  disabled: {
    opacity: 0.6,
    shadowOpacity: 0,
    elevation: 0,
  }
});
