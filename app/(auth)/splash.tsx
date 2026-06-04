import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Shield, Sparkles, User, Users, ChevronRight, BarChart2 } from 'lucide-react-native';
import { Colors, Shadows, Typography, Gradients } from '../../constants/DesignSystem';
import { useAuth } from '../../hooks/useAuth';
import MeshBackground from '../../components/MeshBackground';
import GlassCard from '../../components/GlassCard';
import GradientButton from '../../components/GradientButton';

export default function SplashScreen() {
  const router = useRouter();
  const { loginAsRole } = useAuth();

  const handleSandboxLogin = (role: 'VENDOR' | 'INFLUENCER' | 'ADMIN') => {
    loginAsRole(role);
    router.replace('/');
  };

  return (
    <MeshBackground style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Brand Header */}
        <View style={styles.brandSection}>
          <Image 
            source={require('../../assets/images/brandly_logo.png')} 
            style={styles.brandLogo} 
          />
          <Text style={styles.logoText}>Brandly</Text>
          <Text style={styles.tagline}>Creator Affiliate Ledger</Text>
        </View>

        {/* Storytelling stats card */}
        <View style={styles.carouselContainer}>
          <GlassCard style={styles.introCard}>
            <View style={styles.highlightHeader}>
              <View style={styles.greenLight} />
              <Text style={styles.highlightTitle}>Platform Ledger Yield</Text>
            </View>
            <Text style={styles.metricVal}>$1,842,900</Text>
            <Text style={styles.metricLabel}>Total Commission Yield Generated</Text>
            
            <View style={styles.miniStatsRow}>
              <View style={styles.miniStatCol}>
                <Text style={styles.miniStatVal}>8.5%</Text>
                <Text style={styles.miniStatLabel}>Conversion Ratio</Text>
              </View>
              <View style={styles.miniStatCol}>
                <Text style={styles.miniStatVal}>125k+</Text>
                <Text style={styles.miniStatLabel}>Creator Networks</Text>
              </View>
            </View>
          </GlassCard>
        </View>

        {/* Primary Actions */}
        <View style={styles.actionContainer}>
          <GradientButton
            title="Launch Sandbox Control"
            onPress={() => router.push('/(auth)/login')}
            style={{ marginBottom: 14 }}
            icon={<ChevronRight size={16} color="#ffffff" />}
          />
          
          <TouchableOpacity 
            style={styles.secondaryBtn} 
            onPress={() => router.push('/(auth)/register')}
          >
            <Text style={styles.secondaryBtnText}>Create New Account</Text>
          </TouchableOpacity>
        </View>

        {/* Sandbox Pitch Segment */}
        <View style={styles.sandboxContainer}>
          <View style={styles.sandboxHeader}>
            <Shield size={12} color="#64748b" style={{ marginRight: 6 }} />
            <Text style={styles.sandboxTitle}>INVESTOR SANDBOX QUICK ACCREDITATION</Text>
          </View>
          <Text style={styles.sandboxSubtitle}>Select a pre-seeded account profile to test checkout tracking simulations instantly</Text>

          <View style={styles.roleGrid}>
            {/* Vendor Option */}
            <TouchableOpacity 
              onPress={() => handleSandboxLogin('VENDOR')} 
              style={styles.roleCard}
            >
              <View style={[styles.avatarBadge, { backgroundColor: 'rgba(99, 102, 241, 0.1)' }]}>
                <Users size={16} color="#6366f1" />
              </View>
              <Text style={styles.roleName}>Vendor</Text>
              <Text style={styles.roleDesc}>Upload products & approve campaigns</Text>
            </TouchableOpacity>

            {/* Influencer Option */}
            <TouchableOpacity 
              onPress={() => handleSandboxLogin('INFLUENCER')} 
              style={styles.roleCard}
            >
              <View style={[styles.avatarBadge, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
                <User size={16} color="#10b981" />
              </View>
              <Text style={styles.roleName}>Influencer</Text>
              <Text style={styles.roleDesc}>Grab tracking links & mock checkout order conversions</Text>
            </TouchableOpacity>
          </View>

          {/* Admin Option */}
          <TouchableOpacity 
            onPress={() => handleSandboxLogin('ADMIN')} 
            style={styles.adminRoleCard}
          >
            <Shield size={14} color="#3b82f6" style={{ marginRight: 6 }} />
            <Text style={styles.adminRoleName}>Administrator Command Center</Text>
            <Text style={styles.adminRoleDesc}>Moderate accounts & products queue</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </MeshBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 80 : 50,
    paddingBottom: 40,
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  brandLogo: {
    width: 64,
    height: 64,
    borderRadius: 18,
    marginBottom: 14,
    ...Shadows.glowPrimary,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 9,
    color: Colors.textMuted,
    marginTop: 4,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  carouselContainer: {
    marginBottom: 30,
  },
  introCard: {
    borderWidth: 0.8,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  highlightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  greenLight: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10b981',
    marginRight: 6,
    ...Shadows.glowSuccess,
  },
  highlightTitle: {
    fontSize: 9,
    fontWeight: '900',
    color: '#10b981',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  metricVal: {
    fontSize: 36,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -1,
  },
  metricLabel: {
    fontSize: 10,
    color: Colors.textLight,
    marginTop: 2,
    fontWeight: '500',
  },
  miniStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    marginTop: 16,
    paddingTop: 12,
  },
  miniStatCol: {
    flex: 1,
  },
  miniStatVal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  miniStatLabel: {
    fontSize: 9,
    color: Colors.textMuted,
    marginTop: 2,
  },
  actionContainer: {
    marginBottom: 30,
  },
  secondaryBtn: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: Colors.text,
    fontWeight: '700',
    fontSize: 13,
  },
  sandboxContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    paddingTop: 24,
  },
  sandboxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sandboxTitle: {
    fontSize: 9,
    fontWeight: '900',
    color: Colors.textMuted,
    letterSpacing: 1.5,
  },
  sandboxSubtitle: {
    fontSize: 10,
    color: Colors.textLight,
    marginTop: 4,
    marginBottom: 16,
    lineHeight: 14,
  },
  roleGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  roleCard: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    borderWidth: 0.8,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 16,
    padding: 14,
  },
  avatarBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  roleName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  roleDesc: {
    fontSize: 9,
    color: Colors.textMuted,
    marginTop: 4,
    lineHeight: 12,
  },
  adminRoleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
    borderWidth: 0.8,
    borderColor: 'rgba(59, 130, 246, 0.15)',
    borderRadius: 14,
    padding: 14,
  },
  adminRoleName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#3b82f6',
    flex: 1,
  },
  adminRoleDesc: {
    fontSize: 9,
    color: Colors.textMuted,
    textAlign: 'right',
  }
});
