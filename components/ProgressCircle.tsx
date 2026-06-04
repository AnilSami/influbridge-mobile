import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Colors } from '../constants/DesignSystem';

interface ProgressCircleProps {
  progress: number; // Value between 0 and 1
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
}

export default function ProgressCircle({
  progress,
  size = 70,
  strokeWidth = 6,
  color = Colors.primary,
  label
}: ProgressCircleProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const strokeDashoffset = circumference - clampedProgress * circumference;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {/* Track Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1e293b"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          // Rotate start from top (12 o'clock)
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={styles.centerContainer}>
        {label ? (
          <Text style={styles.labelText}>{label}</Text>
        ) : (
          <Text style={styles.percentText}>{Math.round(clampedProgress * 100)}%</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  centerContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  labelText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 10,
  }
});
