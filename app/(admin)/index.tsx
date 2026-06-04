import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator, 
  RefreshControl,
  Platform
} from 'react-native';
import { ShieldCheck, Users, ShoppingBag, Radio, ShieldAlert, LogOut, ArrowRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Shadows } from '../../constants/DesignSystem';
import { MockAPI } from '../../api/mockData';
import { useAuth } from '../../hooks/useAuth';
import MeshBackground from '../../components/MeshBackground';
import GlassCard from '../../components/GlassCard';
import Avatar from '../../components/Avatar';
import ProgressCircle from '../../components/ProgressCircle';

export default function AdminConsole() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/splash' as any);
  };
  
  const [metrics, setMetrics] = useState<any>(null);
  const [counts, setCounts] = useState({ vendors: 0, products: 0, influencers: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAdminData = () => {
    try {
      const allMetrics = MockAPI.getPlatformAnalytics();
      setMetrics(allMetrics);

      const pendingVendors = MockAPI.getVendors().filter(v => !v.isApproved).length;
      const pendingProducts = MockAPI.getProducts().filter(p => p.status === 'PENDING').length;
      const pendingInfluencers = MockAPI.getInfluencers().filter(i => !i.isApproved).length;
      setCounts({ vendors: pendingVendors, products: pendingProducts, influencers: pendingInfluencers });
    } catch (error) {
      console.error('Error fetching admin console dashboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAdminData();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  const kpiCards = [
    { name: 'Total Users', value: metrics?.usersCount || 0, icon: Users, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
    { name: 'Products Live', value: metrics?.productsCount || 0, icon: ShoppingBag, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
    { name: 'Conversions', value: metrics?.totalConversions || 0, icon: Radio, color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
  ];

  return (
    <MeshBackground style={{ flex: 1 }}>
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.contentContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3b82f6" />}
      >
        {/* Title */}
        <View style={styles.header}>
          <View>
            <Text style={Typography.h2}>Admin Command</Text>
            <Text style={Typography.caption}>Global Platform Console</Text>
          </View>
          <Avatar name="Admin User" ringColor="#3b82f6" />
        </View>

        {/* Unified Approval Moderation Cards */}
        <GlassCard style={styles.modSummaryCard}>
          <View style={styles.modSummaryLeft}>
            <Text style={styles.modLabel}>PENDING AUDITING ITEMS</Text>
            <Text style={styles.modCount}>
              {counts.vendors + counts.products + counts.influencers}
            </Text>
            <Text style={styles.modSubtext}>Accounts and products awaiting platform verification.</Text>
          </View>
          <TouchableOpacity 
            style={styles.modBtn} 
            onPress={() => router.push('/(admin)/approval-center' as any)}
          >
            <Text style={styles.modBtnText}>Manage Queue</Text>
            <ArrowRight size={12} color="#ffffff" />
          </TouchableOpacity>
        </GlassCard>

        {/* KPI stats */}
        <Text style={styles.sectionHeader}>System metrics</Text>
        <View style={styles.metricsGrid}>
          {kpiCards.map((card) => {
            const Icon = card.icon;
            return (
              <GlassCard key={card.name} style={styles.metricCard}>
                <View style={[styles.iconBg, { backgroundColor: card.bg }]}>
                  <Icon size={18} color={card.color} />
                </View>
                <Text style={styles.metricLabel}>{card.name}</Text>
                <Text style={styles.metricValue}>{card.value}</Text>
              </GlassCard>
            );
          })}
        </View>

        {/* Global ledger metrics */}
        <GlassCard style={styles.ledgerCard}>
          <Text style={styles.ledgerTitle}>Platform Capital Ledger</Text>
          <View style={styles.ledgerRow}>
            <Text style={styles.ledgerLabel}>Gross Volume (GMV)</Text>
            <Text style={styles.ledgerVal}>${metrics?.totalRevenue?.toFixed(2) || '0.00'}</Text>
          </View>
          <View style={styles.ledgerRow}>
            <Text style={styles.ledgerLabel}>Paid Creator Commissions</Text>
            <Text style={[styles.ledgerVal, { color: '#10b981' }]}>${metrics?.totalCommission?.toFixed(2) || '0.00'}</Text>
          </View>
          <View style={[styles.ledgerRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.ledgerLabel}>Generated Click Links</Text>
            <Text style={[styles.ledgerVal, { color: '#3b82f6' }]}>{metrics?.totalClicks || 0}</Text>
          </View>
        </GlassCard>

        {/* System safety check */}
        <GlassCard style={styles.safetyCard}>
          <ShieldCheck size={20} color="#10b981" style={{ marginBottom: 6 }} />
          <Text style={styles.safetyTitle}>Security Core Online</Text>
          <Text style={styles.safetyDesc}>
            Mock database arrays are active. Sandbox user bypass state is listening successfully on Metro bunder.
          </Text>
        </GlassCard>

        {/* Logout button */}
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <LogOut size={14} color="#ef4444" style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Sign Out of Administrator</Text>
        </TouchableOpacity>
      </ScrollView>
    </MeshBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100, // Adjusted padding to clear suspended tab bar!
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modSummaryCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: 'rgba(59, 130, 246, 0.03)',
    borderColor: 'rgba(59, 130, 246, 0.1)',
    borderWidth: 0.8,
  },
  modSummaryLeft: {
    flex: 1,
    marginRight: 10,
  },
  modLabel: {
    fontSize: 8,
    color: '#3b82f6',
    fontWeight: '800',
    letterSpacing: 1,
  },
  modCount: {
    fontSize: 32,
    fontWeight: '900',
    color: '#ffffff',
    marginVertical: 4,
  },
  modSubtext: {
    fontSize: 11,
    color: Colors.textLight,
  },
  modBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 4,
  },
  modBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  metricCard: {
    flex: 1,
    padding: 12,
    borderWidth: 0.8,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  iconBg: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  metricLabel: {
    fontSize: 9,
    color: Colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '900',
    color: '#ffffff',
    marginTop: 4,
  },
  ledgerCard: {
    marginBottom: 24,
    borderWidth: 0.8,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  ledgerTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 14,
  },
  ledgerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  ledgerLabel: {
    fontSize: 11,
    color: Colors.textLight,
  },
  ledgerVal: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  safetyCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.03)',
    borderColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 0.8,
    marginBottom: 24,
  },
  safetyTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#10b981',
  },
  safetyDesc: {
    fontSize: 11,
    color: Colors.textMuted,
    lineHeight: 16,
    marginTop: 4,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 12,
    height: 48,
    marginTop: 10,
  },
  logoutIcon: {
    marginRight: 6,
  },
  logoutText: {
    color: '#ef4444',
    fontWeight: 'bold',
    fontSize: 12,
  },
});
