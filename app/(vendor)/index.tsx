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
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Shadows } from '../../constants/DesignSystem';
import { MockAPI } from '../../api/mockData';
import { useAuth } from '../../hooks/useAuth';
import MeshBackground from '../../components/MeshBackground';
import GlassCard from '../../components/GlassCard';
import ProgressCircle from '../../components/ProgressCircle';

export default function VendorDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const currentVendor = MockAPI.getVendors().find(v => v.userId === user?.id) || MockAPI.getVendors()[0];
  const companyName = currentVendor?.companyName || 'GearUp Labs';

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/splash' as any);
  };
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isSimulating) {
      interval = setInterval(() => {
        const activeCamps = MockAPI.getVendorCampaigns().filter(c => c.status === 'ACTIVE');
        if (activeCamps.length > 0) {
          const randomCamp = activeCamps[Math.floor(Math.random() * activeCamps.length)];
          const randomAmt = parseFloat((50 + Math.random() * 200).toFixed(2));
          MockAPI.simulateCheckout(randomCamp.referralCode, randomAmt);
          fetchAnalytics();
        }
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isSimulating]);
  
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
            <Text style={Typography.caption}>{companyName} Account</Text>
          </View>
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

        {/* Simulation Control Card */}
        <GlassCard style={[styles.simulationCard, isSimulating ? styles.simulationCardActive : null]}>
          <View style={styles.simLeft}>
            <View style={styles.simHeaderRow}>
              <View style={[styles.simPulse, isSimulating ? styles.simPulseActive : null]} />
              <Text style={styles.simLabel}>LIVE PITCH SIMULATION MODULE</Text>
            </View>
            <Text style={styles.simHeading}>Auto-Generate incoming sales stream</Text>
            <Text style={styles.simDesc}>
              Simulates real-time creator conversions every 5 seconds to test metrics reactivity.
            </Text>
          </View>
          <TouchableOpacity 
            style={[styles.simToggle, isSimulating ? styles.simToggleOn : null]} 
            onPress={() => setIsSimulating(!isSimulating)}
          >
            <Text style={styles.simToggleText}>{isSimulating ? 'STOP' : 'START'}</Text>
          </TouchableOpacity>
        </GlassCard>

        {/* Performance Visualizer (7-Day Sales Bars) */}
        <GlassCard style={styles.chartCard}>
          <Text style={styles.chartTitle}>7-Day Sales Revenue Distribution</Text>
          <View style={styles.chartContainer}>
            {data?.dailySales?.map((item: any) => {
              const maxVal = Math.max(...data.dailySales.map((d: any) => d.sales), 1);
              const pct = (item.sales / maxVal) * 100;
              return (
                <View key={item.day} style={styles.barCol}>
                  <View style={styles.barTrack}>
                    <View style={[styles.barFill, { height: `${pct}%` }]}>
                      <LinearGradient
                        colors={['#6366f1', '#3b82f6']}
                        style={StyleSheet.absoluteFill}
                      />
                    </View>
                  </View>
                  <Text style={styles.barLabel}>{item.day}</Text>
                  <Text style={styles.barValue}>${Math.round(item.sales)}</Text>
                </View>
              );
            })}
          </View>
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
  chartCard: {
    marginBottom: 24,
    borderWidth: 0.8,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  chartTitle: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    paddingTop: 10,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
  },
  barTrack: {
    width: 12,
    height: 80,
    backgroundColor: '#1e293b',
    borderRadius: 6,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  barFill: {
    width: '100%',
    borderRadius: 6,
  },
  barLabel: {
    fontSize: 9,
    color: Colors.textMuted,
    marginTop: 6,
    fontWeight: '600',
  },
  barValue: {
    fontSize: 8,
    color: Colors.textLight,
    marginTop: 2,
    fontWeight: '500',
  },
  simulationCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: 'rgba(99, 102, 241, 0.02)',
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 0.8,
  },
  simulationCardActive: {
    borderColor: 'rgba(99, 102, 241, 0.25)',
    backgroundColor: 'rgba(99, 102, 241, 0.04)',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  simLeft: {
    flex: 1,
    marginRight: 12,
  },
  simHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  simPulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#64748b',
  },
  simPulseActive: {
    backgroundColor: '#10b981',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 3,
  },
  simLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 1,
  },
  simHeading: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  simDesc: {
    fontSize: 10,
    color: Colors.textLight,
    marginTop: 2,
    lineHeight: 14,
  },
  simToggle: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 60,
  },
  simToggleOn: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  simToggleText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
  },
});
