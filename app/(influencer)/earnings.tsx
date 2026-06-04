import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Wallet, ShieldAlert, CheckCircle, TrendingUp, DollarSign } from 'lucide-react-native';
import { Colors, Typography, Gradients } from '../../constants/DesignSystem';
import { MockAPI } from '../../api/mockData';
import MeshBackground from '../../components/MeshBackground';
import GlassCard from '../../components/GlassCard';
import Badge from '../../components/Badge';

export default function InfluencerEarnings() {
  const router = useRouter();

  const data = MockAPI.getInfluencerAnalytics();
  const orders = MockAPI.getInfluencerOrders();

  return (
    <MeshBackground style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.circleBtn} onPress={() => router.back()}>
            <ArrowLeft size={16} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Earnings & Ledger</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Balance visual card */}
        <GlassCard style={styles.balanceCard}>
          <Wallet size={20} color="#10b981" style={{ marginBottom: 12 }} />
          <Text style={styles.balanceLabel}>AVAILABLE FOR PAYOUT</Text>
          <Text style={styles.balanceAmount}>${data.earnings.toFixed(2)}</Text>
          <View style={styles.badgeRow}>
            <Badge label="Auto-Disbursed Daily" type="success" />
          </View>
        </GlassCard>

        {/* Stats summary list */}
        <Text style={styles.sectionHeader}>Platform Performance</Text>
        <View style={styles.analyticsList}>
          <GlassCard style={styles.analyticItem}>
            <View style={styles.analyticLeft}>
              <Text style={styles.analyticTitle}>Commission Conversion Rate</Text>
              <Text style={styles.analyticDesc}>Total clicks to payouts ratio</Text>
            </View>
            <Text style={styles.analyticVal}>
              {data.clicks > 0 ? ((data.conversions / data.clicks) * 100).toFixed(1) : '0.0'}%
            </Text>
          </GlassCard>

          <GlassCard style={styles.analyticItem}>
            <View style={styles.analyticLeft}>
              <Text style={styles.analyticTitle}>Average Basket Size</Text>
              <Text style={styles.analyticDesc}>Simulated order volumes</Text>
            </View>
            <Text style={styles.analyticVal}>
              ${orders.length > 0 ? (orders.reduce((sum: number, o: any) => sum + o.amount, 0) / orders.length).toFixed(2) : '0.00'}
            </Text>
          </GlassCard>
        </View>

        {/* Audit History Logs */}
        <Text style={styles.sectionHeader}>Conversion Records</Text>
        {orders.length === 0 ? (
          <GlassCard style={styles.emptyCard}>
            <Text style={styles.emptyText}>No conversions logged yet.</Text>
          </GlassCard>
        ) : (
          orders.map((item: any) => (
            <GlassCard key={item.id} style={styles.orderItem}>
              <View style={styles.orderLeft}>
                <Text style={styles.orderProdName}>{item.campaign.product.name}</Text>
                <Text style={styles.orderDate}>
                  {new Date(item.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Text>
              </View>
              <View style={styles.orderRight}>
                <Text style={styles.earnedAmt}>+${item.commission.toFixed(2)}</Text>
                <Text style={styles.retailAmt}>Price: ${item.amount.toFixed(2)}</Text>
              </View>
            </GlassCard>
          ))
        )}
      </ScrollView>
    </MeshBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 30,
    paddingBottom: 100, // Adjusted padding to clear suspended tab bar!
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  circleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  balanceCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.03)',
    borderColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 0.8,
    marginBottom: 24,
  },
  balanceLabel: {
    fontSize: 8,
    color: Colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  balanceAmount: {
    fontSize: 34,
    fontWeight: '900',
    color: '#ffffff',
    marginVertical: 6,
    letterSpacing: -0.5,
  },
  badgeRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  analyticsList: {
    gap: 12,
    marginBottom: 24,
  },
  analyticItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 0.8,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  analyticLeft: {
    flex: 1,
  },
  analyticTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  analyticDesc: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
  },
  analyticVal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  emptyCard: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 0.8,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  orderLeft: {
    flex: 1,
  },
  orderProdName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  orderDate: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 4,
  },
  orderRight: {
    alignItems: 'flex-end',
  },
  earnedAmt: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#10b981',
  },
  retailAmt: {
    fontSize: 9,
    color: Colors.textMuted,
    marginTop: 2,
  }
});
