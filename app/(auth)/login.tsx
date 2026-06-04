import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { Mail, Lock, ArrowRight, Shield, User, Users } from 'lucide-react-native';
import { Colors, Shadows, Typography } from '../../constants/DesignSystem';
import { useAuth } from '../../hooks/useAuth';
import MeshBackground from '../../components/MeshBackground';
import GlassCard from '../../components/GlassCard';
import GradientButton from '../../components/GradientButton';

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email) {
      setError('Please fill in your email address');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await login(email, password);
      router.replace('/');
    } catch (err: any) {
      setError('Authentication failed. Please verify inputs.');
    } finally {
      setLoading(false);
    }
  };

  const autoFill = (role: 'VENDOR' | 'INFLUENCER' | 'ADMIN') => {
    setError('');
    if (role === 'VENDOR') {
      setEmail('vendor@brandly.com');
      setPassword('••••••••');
    } else if (role === 'INFLUENCER') {
      setEmail('influencer@brandly.com');
      setPassword('••••••••');
    } else {
      setEmail('admin@brandly.com');
      setPassword('••••••••');
    }
  };

  return (
    <MeshBackground style={{ flex: 1 }}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <View style={styles.brandContainer}>
            <Image 
              source={require('../../assets/images/brandly_logo.png')} 
              style={styles.brandLogo} 
            />
            <Text style={styles.logoText}>Brandly</Text>
            <Text style={styles.logoSubtitle}>Affiliate Ecosystem</Text>
          </View>

          <GlassCard style={styles.card}>
            <Text style={styles.header}>Sign In</Text>
            <Text style={styles.subheader}>Unlock your influencer campaigns & leads ledger</Text>

            {error ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* Email input */}
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputContainer}>
              <Mail size={16} color="#64748b" style={styles.inputIcon} />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="e.g. agency@brandly.com"
                placeholderTextColor="#475569"
                autoCapitalize="none"
                keyboardType="email-address"
                style={styles.input}
              />
            </View>

            {/* Password input */}
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputContainer}>
              <Lock size={16} color="#64748b" style={styles.inputIcon} />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor="#475569"
                secureTextEntry
                autoCapitalize="none"
                style={styles.input}
              />
            </View>

            {/* Submit */}
            <GradientButton
              title="Authenticate Profile"
              onPress={handleLogin}
              loading={loading}
              style={{ marginTop: 10 }}
              icon={<ArrowRight size={16} color="#ffffff" />}
            />

            <TouchableOpacity 
              onPress={() => router.push('/(auth)/register')}
              style={styles.registerLink}
            >
              <Text style={styles.registerLinkText}>
                Need a profile? <Text style={styles.registerLinkHighlight}>Apply for onboarding</Text>
              </Text>
            </TouchableOpacity>
          </GlassCard>

          {/* Quick Fill credentials tags */}
          <View style={styles.demoCredits}>
            <Text style={styles.demoTitle}>MOCK PROFILE FAST-FILLER</Text>
            <View style={styles.demoBtns}>
              <TouchableOpacity onPress={() => autoFill('INFLUENCER')} style={styles.demoTag}>
                <User size={10} color="#10b981" />
                <Text style={styles.demoTagText}>Influencer</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => autoFill('VENDOR')} style={styles.demoTag}>
                <Users size={10} color="#6366f1" />
                <Text style={styles.demoTagText}>Vendor</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => autoFill('ADMIN')} style={styles.demoTag}>
                <Shield size={10} color="#3b82f6" />
                <Text style={styles.demoTagText}>Admin</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </MeshBackground>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  brandLogo: {
    width: 64,
    height: 64,
    borderRadius: 18,
    marginBottom: 10,
    ...Shadows.glowPrimary,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  logoSubtitle: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: 4,
  },
  card: {
    borderWidth: 0.8,
    borderColor: Colors.border,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  subheader: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
    lineHeight: 16,
  },
  errorBanner: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    padding: 10,
    borderRadius: 10,
    marginBottom: 16,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  label: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(2, 6, 23, 0.6)',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
    height: 48,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: '#ffffff',
    fontSize: 13,
  },
  registerLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  registerLinkText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  registerLinkHighlight: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  demoCredits: {
    marginTop: 30,
    alignItems: 'center',
  },
  demoTitle: {
    fontSize: 8,
    fontWeight: '900',
    color: Colors.textMuted,
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  demoBtns: {
    flexDirection: 'row',
    gap: 8,
  },
  demoTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    borderWidth: 0.8,
    borderColor: Colors.border,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    gap: 4,
  },
  demoTagText: {
    fontSize: 9,
    color: Colors.text,
    fontWeight: '700',
  }
});
