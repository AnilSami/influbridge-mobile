import { Tabs, useRouter } from 'expo-router';
import { LayoutDashboard, Store, FolderOpen } from 'lucide-react-native';
import { Platform, TouchableOpacity, Alert } from 'react-native';
import { Colors } from '../../constants/DesignSystem';
import { useAuth } from '../../hooks/useAuth';
import { MockAPI } from '../../api/mockData';
import Avatar from '../../components/Avatar';

export default function InfluencerLayout() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const currentInfluencer = MockAPI.getInfluencers().find(i => i.userId === user?.id) || MockAPI.getInfluencers()[0];
  const displayName = currentInfluencer?.displayName || 'Audrey Fitness';

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/splash' as any);
  };

  const handleProfilePress = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out of the Creator Dashboard?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: handleLogout }
      ]
    );
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#10b981',
        tabBarInactiveTintColor: '#64748b',
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          borderRadius: 24,
          height: 64,
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.08)',
          borderTopColor: 'rgba(255, 255, 255, 0.08)',
          elevation: 12,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.4,
          shadowRadius: 16,
          paddingBottom: 0,
        },
        headerStyle: {
          backgroundColor: '#020617',
          borderBottomColor: 'rgba(255, 255, 255, 0.05)',
          borderBottomWidth: 1,
        },
        headerTitleStyle: {
          color: '#ffffff',
          fontWeight: '800',
          fontSize: 15,
          textTransform: 'uppercase',
          letterSpacing: 1.5,
        },
        headerShadowVisible: false,
        headerRight: () => (
          <TouchableOpacity onPress={handleProfilePress} activeOpacity={0.75} style={{ marginRight: 20 }}>
            <Avatar name={displayName} ringColor="#10b981" size={32} />
          </TouchableOpacity>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Overview',
          headerTitle: 'Earnings Ledger',
          tabBarIcon: ({ color }) => <LayoutDashboard size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="browse"
        options={{
          title: 'Marketplace',
          headerTitle: 'Browse Storefront',
          tabBarIcon: ({ color }) => <Store size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="campaigns"
        options={{
          title: 'My Links',
          headerTitle: 'Active Campaigns',
          tabBarIcon: ({ color }) => <FolderOpen size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="earnings"
        options={{
          href: null,
          title: 'Earnings Ledger',
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
