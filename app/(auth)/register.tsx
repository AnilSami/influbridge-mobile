import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { Mail, Lock, User, Users, Globe, Eye, Sparkles } from 'lucide-react-native';
import { Colors, Shadows, Typography, Gradients } from '../../constants/DesignSystem';
import { useAuth } from '../../hooks/useAuth';
import MeshBackground from '../../components/MeshBackground';
import GlassCard from '../../components/GlassCard';
import GradientButton from '../../components/GradientButton';

const AVAILABLE_NICHES = ['Fitness', 'Beauty', 'Tech', 'Travel', 'Lifestyle', 'Fashion', 'Gaming', 'Outdoors'];

export default function RegisterScreen() {
  const { register } = useAuth();
  const router = useRouter();

  const [role, setRole] = useState<'VENDOR' | 'INFLUENCER'>('INFLUENCER');
  
  // Auth details
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Vendor specifics
  const [companyName, setCompanyName] = useState('');
  const [website, setWebsite] = useState('');

  // Influencer specifics
  const [displayName, setDisplayName] = useState('');
  const [followers, setFollowers] = useState('25000');
  const [selectedNiches, setSelectedNiches] = useState<string[]>([]);

  const handleRegister = async () => {
    setError('');

    if (!email || !password) {
      setError('Please fill in email and password fields');
      return;
    }

    if (role === 'VENDOR' && !companyName) {
      setError('Company Name is required for Vendors');
      return;
    }

    if (role === 'INFLUENCER' && !displayName) {
      setError('Display Name is required for Influencers');
      return;
    }

    setLoading(true);
    try {
      const payload: any = { email, password, role };
      if (role === 'VENDOR') {
        payload.companyName = companyName;
        payload.website = website;
      } else {
        payload.displayName = displayName;
        payload.followers = parseInt(followers, 10) || 1000;
        payload.niche = selectedNiches;
      }

      await register(payload);
      router.replace('/');
    } catch (err: any) {
      setError('Registration failed. Please verify metadata fields.');
    } finally {
      setLoading(false);
    }
  };

  const toggleNiche = (nicheName: string) => {
    if (selectedNiches.includes(nicheName)) {
      setSelectedNiches(prev => prev.filter(n => n !== nicheName));
    } else {
      setSelectedNiches(prev => [...prev, nicheName]);
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
            <Text style={styles.logoSubtitle}>Create Partner Account</Text>
          </View>

          <GlassCard style={styles.card}>
            {/* Custom Tabs */}
            <View style={styles.tabBar}>
              <TouchableOpacity 
                onPress={() => setRole('INFLUENCER')}
                style={[styles.tabButton, role === 'INFLUENCER' && styles.tabActive]}
              >
                <User size={14} color={role === 'INFLUENCER' ? '#ffffff' : Colors.textMuted} style={{ marginRight: 6 }} />
                <Text style={[styles.tabText, role === 'INFLUENCER' && styles.tabTextActive]}>Influencer</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setRole('VENDOR')}
                style={[styles.tabButton, role === 'VENDOR' && styles.tabActive]}
              >
                <Users size={14} color={role === 'VENDOR' ? '#ffffff' : Colors.textMuted} style={{ marginRight: 6 }} />
                <Text style={[styles.tabText, role === 'VENDOR' && styles.tabTextActive]}>Vendor</Text>
              </TouchableOpacity>
            </View>

            {error ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* Common fields */}
            <Text style={styles.label}>Email Address *</Text>
            <View style={styles.inputContainer}>
              <Mail size={16} color="#64748b" style={styles.inputIcon} />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="e.g. name@domain.com"
                placeholderTextColor="#475569"
                autoCapitalize="none"
                keyboardType="email-address"
                style={styles.input}
              />
            </View>

            <Text style={styles.label}>Password *</Text>
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

            {/* Role specific forms */}
            {role === 'VENDOR' ? (
              <React.Fragment>
                <Text style={styles.label}>Company/Brand Name *</Text>
                <View style={styles.inputContainer}>
                  <Users size={16} color="#64748b" style={styles.inputIcon} />
                  <TextInput
                    value={companyName}
                    onChangeText={setCompanyName}
                    placeholder="e.g. GearUp Labs Inc"
                    placeholderTextColor="#475569"
                    style={styles.input}
                  />
                </View>

                <Text style={styles.label}>Website / Online Store URL</Text>
                <View style={styles.inputContainer}>
                  <Globe size={16} color="#64748b" style={styles.inputIcon} />
                  <TextInput
                    value={website}
                    onChangeText={setWebsite}
                    placeholder="e.g. https://gearup.labs"
                    placeholderTextColor="#475569"
                    autoCapitalize="none"
                    keyboardType="url"
                    style={styles.input}
                  />
                </View>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Text style={styles.label}>Public Display Name *</Text>
                <View style={styles.inputContainer}>
                  <User size={16} color="#64748b" style={styles.inputIcon} />
                  <TextInput
                    value={displayName}
                    onChangeText={setDisplayName}
                    placeholder="e.g. Audrey Fitness"
                    placeholderTextColor="#475569"
                    style={styles.input}
                  />
                </View>

                <Text style={styles.label}>Audience Size (Followers)</Text>
                <View style={styles.inputContainer}>
                  <Eye size={16} color="#64748b" style={styles.inputIcon} />
                  <TextInput
                    value={followers}
                    onChangeText={setFollowers}
                    placeholder="e.g. 50000"
                    placeholderTextColor="#475569"
                    keyboardType="numeric"
                    style={styles.input}
                  />
                </View>

                <Text style={styles.label}>Niches (Select Categories)</Text>
                <View style={styles.nicheGrid}>
                  {AVAILABLE_NICHES.map((n) => {
                    const active = selectedNiches.includes(n);
                    return (
                      <TouchableOpacity
                        key={n}
                        onPress={() => toggleNiche(n)}
                        style={[styles.nicheChip, active && styles.nicheChipActive]}
                      >
                        <Text style={[styles.nicheChipText, active && styles.nicheChipTextActive]}>{n}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </React.Fragment>
            )}

            {/* Action */}
            <GradientButton
              title="Create Sandbox Profile"
              onPress={handleRegister}
              loading={loading}
              style={{ marginTop: 10 }}
              icon={<Sparkles size={16} color="#ffffff" />}
            />

            <TouchableOpacity 
              onPress={() => router.push('/(auth)/login')}
              style={styles.loginLink}
            >
              <Text style={styles.loginLinkText}>
                Already registered? <Text style={styles.loginLinkHighlight}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </GlassCard>
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
    color: Colors.success,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: 4,
  },
  card: {
    borderWidth: 0.8,
    borderColor: Colors.border,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(2, 6, 23, 0.6)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 4,
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  tabTextActive: {
    color: '#ffffff',
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
  nicheGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 16,
  },
  nicheChip: {
    backgroundColor: 'rgba(2, 6, 23, 0.5)',
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  nicheChipActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  nicheChipText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  nicheChipTextActive: {
    color: '#10b981',
  },
  loginLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginLinkText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  loginLinkHighlight: {
    color: Colors.primary,
    fontWeight: 'bold',
  }
});
