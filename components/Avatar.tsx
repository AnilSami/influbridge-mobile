import React from 'react';
import { StyleSheet, Text, View, Image, ViewStyle } from 'react-native';
import { Colors } from '../constants/DesignSystem';

interface AvatarProps {
  name: string;
  uri?: string;
  size?: number;
  ringColor?: string;
  style?: ViewStyle;
}

export default function Avatar({ name, uri, size = 40, ringColor = Colors.primary, style }: AvatarProps) {
  const getInitials = (fullName: string) => {
    const parts = fullName.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return fullName.slice(0, 2).toUpperCase();
  };

  const initials = getInitials(name);

  return (
    <View 
      style={[
        styles.avatarContainer, 
        { 
          width: size + 4, 
          height: size + 4, 
          borderRadius: (size + 4) / 2, 
          borderColor: ringColor 
        }, 
        style
      ]}
    >
      {uri ? (
        <Image 
          source={{ uri }} 
          style={{ width: size, height: size, borderRadius: size / 2 }} 
        />
      ) : (
        <View 
          style={[
            styles.fallback, 
            { 
              width: size, 
              height: size, 
              borderRadius: size / 2,
              backgroundColor: '#1e293b' 
            }
          ]}
        >
          <Text style={[styles.initialsText, { fontSize: size * 0.4 }]}>{initials}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  avatarContainer: {
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallback: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: {
    color: '#ffffff',
    fontWeight: 'bold',
  }
});
