import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator, 
  RefreshControl
} from 'react-native';
import { CircleDollarSign, MousePointerClick, TrendingUp, LogOut, ArrowRight, ShieldCheck } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Shadows } from '../../constants/DesignSystem';
import { MockAPI } from '../../api/mockData';
import { useAuth } from '../../hooks/useAuth';
import MeshBackground from '../../components/MeshBackground';
import GlassCard from '../../components/GlassCard';
import Avatar from '../../components/Avatar';
import ProgressCircle from '../../components/ProgressCircle';

export default function VendorDashboard() {
  const { logout } = useAuth();
  const router = useRouter();
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalytics = () => {
    try {
      const response = MockAPI.getVendorAnalytics();
      setData(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAnalytics();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  const statCards = [
    { name: 'Revenue', value: `$${data?.totalRevenue?.toFixed(2) || '0.00'}`, icon: CircleDollarSign, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
    { name: 'Clicks', value: data?.clicks || 0, icon: MousePointerClick, color: '#6366f1', bg: 'rgba(99, 102, 241, 0.1)' },
    { name: 'Sales Logged', value: data?.conversions || 0, icon: TrendingUp, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
  ];

  return (
    <MeshBackground style={{ flex: 1 }}>
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.contentContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6366f1" />}
      >
        {/* Title */}
        <View style={styles.header}>
          <View>
            <Text style={Typography.h2}>Command Console</Text>
            <Text style={Typography.caption}>GearUp Labs Account</Text>
          </View>
          <Avatar name="GearUp Labs" ringColor="#6366f1" />
        </View>

        {/* Metrics Grid */}
        <View style={styles.metricsGrid}>
          {statCards.map((card) => {
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

        {/* Ring visual analytics */}
        <GlassCard style={styles.partnerSummaryCard}>
          <View style={styles.partnerSummaryLeft}>
            <Text style={styles.summaryLabel}>Active Partnerships</Text>
            <Text style={styles.summaryCount}>{data?.activeCampaignsCount || 0}</Text>
            <Text style={styles.summarySubtext}>Influencers actively marketing your referral assets.</Text>
          </View>
          <ProgressCircle 
            progress={data?.activeCampaignsCount ? Math.min(data.activeCampaignsCount / 5, 1) : 0} 
            color="#6366f1" 
            size={80}
            strokeWidth={8}
          />
        </GlassCard>

        {/* Conversions feed */}
        <View style={styles.sectionHeaderRow}>
          <Text style={Typography.h3}>Recent Conversions</Text>
          <TouchableOpacity style={styles.seeAllBtn} onPress={() => router.push('/(vendor)/requests')}>
            <Text style={styles.seeAllText}>View Requests</Text>
            <ArrowRight size={10} color="#6366f1" />
          </TouchableOpacity>
        </View>

        {data?.orders && data.orders.length > 0 ? (
          <GlassCard style={{ padding: 0 }}>
            {data.orders.map((order: any, idx: number) => {
              const isLast = idx === data.orders.length - 1;
              return (
                <View 
                  key={order.id} 
                  style={[
                    styles.orderRow, 
                    isLast && { borderBottomWidth: 0 }
                  ]}
                >
                  <View style={styles.orderMain}>
                    <Text style={styles.orderProduct}>{order.campaign.product.name}</Text>
                    <Text style={styles.orderInfluencer}>via {order.campaign.influencer.displayName}</Text>
                  </View>
                  <View style={styles.orderFinancials}>
                    <Text style={styles.orderAmount}>+${order.amount.toFixed(2)}</Text>
                    <Text style={styles.orderCommission}>Payout: ${order.commission.toFixed(2)}</Text>
                  </View>
                </View>
              );
            })}
          </GlassCard>
        ) : (
          <GlassCard style={styles.emptyCard}>
            <ShieldCheck size={24} color="#64748b" style={{ marginBottom: 8 }} />
            <Text style={styles.emptyText}>No conversions registered yet.</Text>
          </GlassCard>
        )}

        {/* Logout button */}
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <LogOut size={14} color="#ef4444" style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Sign Out of Vendor Portal</Text>
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
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 8,
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
  partnerSummaryCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 0.8,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  partnerSummaryLeft: {
    flex: 1,
    marginRight: 10,
  },
  summaryLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  summaryCount: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ffffff',
    marginVertical: 4,
  },
  summarySubtext: {
    fontSize: 11,
    color: Colors.textLight,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '700',
  },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  orderMain: {
    flex: 1,
    justifyContent: 'center',
  },
  orderProduct: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  orderInfluencer: {
    color: Colors.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
  orderFinancials: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  orderAmount: {
    color: '#10b981',
    fontWeight: 'bold',
    fontSize: 12,
  },
  orderCommission: {
    color: '#f59e0b',
    fontSize: 9,
    marginTop: 2,
  },
  emptyCard: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: 12,
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
    marginTop: 30,
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
