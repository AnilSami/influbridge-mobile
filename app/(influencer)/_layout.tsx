import { Tabs } from 'expo-router';
import { LayoutDashboard, Store, FolderOpen } from 'lucide-react-native';
import { Platform } from 'react-native';
import { Colors } from '../../constants/DesignSystem';

export default function InfluencerLayout() {
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
