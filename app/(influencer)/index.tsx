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
import { DollarSign, MousePointerClick, Percent, LogOut, ArrowRight, BarChart3 } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Gradients } from '../../constants/DesignSystem';
import { MockAPI } from '../../api/mockData';
import { useAuth } from '../../hooks/useAuth';
import GlassCard from '../../components/GlassCard';
import ProgressCircle from '../../components/ProgressCircle';
import MeshBackground from '../../components/MeshBackground';

export default function InfluencerDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const currentInfluencer = MockAPI.getInfluencers().find(i => i.userId === user?.id) || MockAPI.getInfluencers()[0];
  const displayName = currentInfluencer?.displayName || 'Audrey Fitness';

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/splash' as any);
  };

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEarnings = () => {
    try {
      const response = MockAPI.getInfluencerAnalytics();
      setData(response);
    } catch (error) {
      console.error('Error fetching influencer analytics:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchEarnings();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  const statCards = [
    { name: 'My Balance', value: `$${data?.earnings?.toFixed(2) || '0.00'}`, icon: DollarSign, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
    { name: 'Clicks Logged', value: data?.clicks || 0, icon: MousePointerClick, color: '#6366f1', bg: 'rgba(99, 102, 241, 0.1)' },
    { name: 'Conversions', value: data?.conversions || 0, icon: Percent, color: '#0ea5e9', bg: 'rgba(14, 165, 233, 0.1)' },
  ];

  return (
    <MeshBackground style={{ flex: 1 }}>
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.contentContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10b981" />}
      >
      {/* Title */}
      <View style={styles.header}>
        <View>
          <Text style={Typography.h2}>Earnings Console</Text>
          <Text style={Typography.caption}>{displayName} Profile</Text>
        </View>
      </View>

      {/* Metrics Row */}
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

      {/* Payout Progress Card */}
      <GlassCard style={styles.targetProgressCard}>
        <View style={styles.progressTextCol}>
          <Text style={styles.targetLabel}>COMMISSION TARGET GOAL</Text>
          <Text style={styles.targetHeading}>Reach $500.00 Milestone</Text>
          <Text style={styles.targetSubText}>Currently at 43% of the monthly payout threshold.</Text>
        </View>
        <ProgressCircle 
          progress={data?.earnings ? Math.min(data.earnings / 500, 1) : 0} 
          color="#10b981" 
          size={74}
          strokeWidth={7}
        />
      </GlassCard>

      {/* Recent payouts */}
      <View style={styles.sectionHeaderRow}>
        <Text style={Typography.h3}>Recent Commissions</Text>
        <TouchableOpacity style={styles.seeAllBtn} onPress={() => router.push('/(influencer)/earnings' as any)}>
          <Text style={styles.seeAllText}>Deep-Dive Analytics</Text>
          <BarChart3 size={11} color="#10b981" />
        </TouchableOpacity>
      </View>

      {data?.orders && data.orders.length > 0 ? (
        <GlassCard style={{ padding: 0 }}>
          {data.orders.map((order: any, idx: number) => {
            const isLast = idx === data.orders.length - 1;
            const rate = ((order.commission / order.amount) * 100).toFixed(0);
            return (
              <View 
                key={order.id} 
                style={[
                  styles.orderRow, 
                  isLast && { borderBottomWidth: 0 }
                ]}
              >
                <View style={styles.orderMain}>
                  <Text style={styles.orderProduct} numberOfLines={1}>{order.campaign.product.name}</Text>
                  <Text style={styles.orderRate}>Payout Commission: {rate}%</Text>
                </View>
                <View style={styles.orderRight}>
                  <Text style={styles.orderEarned}>+${order.commission.toFixed(2)}</Text>
                  <Text style={styles.orderDate}>
                    {new Date(order.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Text>
                </View>
              </View>
            );
          })}
        </GlassCard>
      ) : (
        <GlassCard style={styles.emptyCard}>
          <Text style={styles.emptyText}>No commissions logged yet.</Text>
        </GlassCard>
      )}

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
    paddingBottom: 100,
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
  targetProgressCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: 'rgba(16, 185, 129, 0.03)',
    borderColor: 'rgba(16, 185, 129, 0.1)',
  },
  progressTextCol: {
    flex: 1,
    marginRight: 10,
  },
  targetLabel: {
    fontSize: 8,
    color: '#10b981',
    fontWeight: '800',
    letterSpacing: 1,
  },
  targetHeading: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    marginVertical: 4,
  },
  targetSubText: {
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
    color: '#10b981',
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
  orderRate: {
    color: Colors.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
  orderRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  orderEarned: {
    color: '#10b981',
    fontWeight: 'bold',
    fontSize: 12,
  },
  orderDate: {
    color: Colors.textMuted,
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
