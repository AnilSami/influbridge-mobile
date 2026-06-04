import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator, 
  Modal,
  TextInput,
  Alert,
  RefreshControl,
  Platform,
  Clipboard as RNClipboard
} from 'react-native';
import { Clipboard, Play, MousePointerClick, TrendingUp, DollarSign, HelpCircle, X, CreditCard, Lock } from 'lucide-react-native';
import { Colors, Typography, Gradients } from '../../constants/DesignSystem';
import { MockAPI } from '../../api/mockData';
import MeshBackground from '../../components/MeshBackground';
import GlassCard from '../../components/GlassCard';
import Badge from '../../components/Badge';
import GradientButton from '../../components/GradientButton';

export default function InfluencerCampaigns() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Simulation modal
  const [showSimulateModal, setShowSimulateModal] = useState(false);
  const [activeCampaign, setActiveCampaign] = useState<any>(null);
  const [simulateAmount, setSimulateAmount] = useState('150.00');
  const [simulateLoading, setSimulateLoading] = useState(false);

  // Simulated card details
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/29');
  const [cardCvc, setCardCvc] = useState('***');

  const fetchCampaigns = () => {
    try {
      const response = MockAPI.getInfluencerCampaigns();
      setCampaigns(response);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCampaigns();
  };

  const copyToClipboard = (text: string) => {
    RNClipboard.setString(text);
    Alert.alert('Link Copied', 'Campaign tracking link copied to clipboard!');
  };

  const handleSimulateSale = async () => {
    if (!activeCampaign || !simulateAmount) return;

    setSimulateLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1200)); // Fintech mock validation delay

    try {
      const resOrder = MockAPI.simulateCheckout(activeCampaign.referralCode, parseFloat(simulateAmount));
      
      Alert.alert(
        'Stripe Conversion Triggered', 
        `Mock purchase completed successfully!\nGross Retail Sale: $${parseFloat(simulateAmount).toFixed(2)}\nInfluencer Commission: $${resOrder.commission.toFixed(2)}`
      );
      
      setShowSimulateModal(false);
      fetchCampaigns();
    } catch (err: any) {
      Alert.alert('Error', 'Simulation checkout trigger failed');
    } finally {
      setSimulateLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  const active = campaigns.filter((c) => c.status === 'ACTIVE');
  const pending = campaigns.filter((c) => c.status === 'PENDING');

  return (
    <MeshBackground style={{ flex: 1 }}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10b981" />}
      >
        {/* Active Campaigns */}
        <Text style={styles.sectionHeader}>My Active Links ({active.length})</Text>
        {active.length === 0 ? (
          <GlassCard style={styles.emptyCard}>
            <HelpCircle size={28} color="#64748b" style={{ marginBottom: 8 }} />
            <Text style={styles.emptyText}>No active campaigns.</Text>
            <Text style={styles.emptySubtext}>Request promotional rights from the marketplace browse tab.</Text>
          </GlassCard>
        ) : (
          active.map((item) => (
            <GlassCard key={item.id} style={styles.campaignCard}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.brandName}>{item.product.vendor.companyName}</Text>
                  <Text style={styles.productName}>{item.product.name}</Text>
                </View>
              </View>

              {/* Promo details */}
              <View style={styles.promoDetails}>
                <View style={styles.linkContainer}>
                  <Text style={styles.promoLabel}>Referral Link</Text>
                  <View style={styles.linkRow}>
                    <Text style={styles.linkText} numberOfLines={1}>{item.referralLink}</Text>
                    <TouchableOpacity onPress={() => copyToClipboard(item.referralLink)}>
                      <Clipboard size={14} color="#10b981" />
                    </TouchableOpacity>
                  </View>
                </View>

                {item.couponCode && (
                  <View style={styles.couponContainer}>
                    <Text style={styles.promoLabel}>Coupon Code</Text>
                    <Text style={styles.couponCode}>{item.couponCode}</Text>
                  </View>
                )}
              </View>

              {/* Stats Grid */}
              <View style={styles.statsGrid}>
                <View style={styles.statBox}>
                  <MousePointerClick size={14} color="#6366f1" style={{ marginBottom: 4 }} />
                  <Text style={styles.statLabelText}>Clicks</Text>
                  <Text style={styles.statValText}>{item.clicks}</Text>
                </View>
                <View style={styles.statBox}>
                  <TrendingUp size={14} color="#0ea5e9" style={{ marginBottom: 4 }} />
                  <Text style={styles.statLabelText}>Sales</Text>
                  <Text style={styles.statValText}>{item.conversions}</Text>
                </View>
                <View style={styles.statBox}>
                  <DollarSign size={14} color="#10b981" style={{ marginBottom: 4 }} />
                  <Text style={styles.statLabelText}>Earnings</Text>
                  <Text style={[styles.statValText, { color: '#10b981' }]}>${item.commission.toFixed(2)}</Text>
                </View>
              </View>

              {/* Simulator Action */}
              <GradientButton
                colors={Gradients.success}
                title="Stripe Sandbox Checkout"
                onPress={() => {
                  setActiveCampaign(item);
                  setShowSimulateModal(true);
                }}
                icon={<Play size={12} color="#ffffff" />}
              />
            </GlassCard>
          ))
        )}

        {/* Pending Approval */}
        {pending.length > 0 && (
          <View style={{ marginTop: 24 }}>
            <Text style={styles.sectionHeader}>Awaiting Approval ({pending.length})</Text>
            <GlassCard style={{ paddingHorizontal: 16, paddingVertical: 0 }}>
              {pending.map((item, idx) => (
                <View key={item.id} style={[styles.pendingRow, idx === pending.length - 1 ? { borderBottomWidth: 0 } : null]}>
                  <View>
                    <Text style={styles.pendingBrand}>{item.product.vendor.companyName}</Text>
                    <Text style={styles.pendingProduct}>{item.product.name}</Text>
                  </View>
                  <Badge label="Auditing" type="warning" />
                </View>
              ))}
            </GlassCard>
          </View>
        )}
      </ScrollView>

      {/* Checkout Simulator Modal */}
      <Modal
        visible={showSimulateModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSimulateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <GlassCard style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.titleRow}>
                <CreditCard size={18} color="#10b981" style={{ marginRight: 6 }} />
                <Text style={styles.modalTitle}>Stripe Conversion Webhook</Text>
              </View>
              <TouchableOpacity onPress={() => setShowSimulateModal(false)}>
                <X size={18} color="#94a3b8" />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalDesc}>
              Simulate customer payment transactions. Processing executes a secure Stripe webhook call to register payouts.
            </Text>

            {/* Simulated Payment Sheet Box */}
            <View style={styles.stripeSheet}>
              <View style={styles.stripeHeader}>
                <Lock size={10} color="#10b981" />
                <Text style={styles.stripeSecure}>SECURE MOCK STRIPE Webhook</Text>
              </View>

              <Text style={styles.inputLabel}>Purchase Price Amount ($)</Text>
              <TextInput
                value={simulateAmount}
                onChangeText={setSimulateAmount}
                keyboardType="numeric"
                placeholder="150.00"
                placeholderTextColor="#475569"
                style={styles.modalInput}
              />

              <Text style={styles.inputLabel}>Simulated Credit Card</Text>
              <View style={styles.cardInputRow}>
                <TextInput
                  value={cardNumber}
                  editable={false}
                  style={[styles.modalInput, { flex: 2, marginBottom: 0 }]}
                />
                <TextInput
                  value={cardExpiry}
                  editable={false}
                  style={[styles.modalInput, { flex: 1, marginBottom: 0 }]}
                />
              </View>
            </View>

            <View style={styles.modalBtns}>
              <GradientButton 
                colors={Gradients.success}
                title={`Simulate $${parseFloat(simulateAmount || '0').toFixed(2)} Payment`}
                onPress={handleSimulateSale}
                loading={simulateLoading}
                style={{ flex: 1 }}
              />
            </View>
          </GlassCard>
        </View>
      </Modal>
    </MeshBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
    paddingBottom: 100, // Adjusted padding to clear suspended tab bar!
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  emptyCard: {
    padding: 30,
    alignItems: 'center',
  },
  emptyText: {
    color: '#cbd5e1',
    fontWeight: 'bold',
    fontSize: 13,
  },
  emptySubtext: {
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
    lineHeight: 16,
  },
  campaignCard: {
    marginBottom: 20,
    borderWidth: 0.8,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  cardHeader: {
    marginBottom: 14,
  },
  brandName: {
    fontSize: 10,
    color: '#10b981',
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  productName: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: 'bold',
    marginTop: 2,
  },
  promoDetails: {
    backgroundColor: 'rgba(2, 6, 23, 0.4)',
    borderRadius: 12,
    padding: 12,
    gap: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  linkContainer: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingBottom: 8,
  },
  promoLabel: {
    fontSize: 8,
    color: Colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  linkText: {
    color: '#94a3b8',
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    flex: 1,
    marginRight: 10,
  },
  couponContainer: {
    paddingTop: 2,
  },
  couponCode: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(2, 6, 23, 0.4)',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
  },
  statLabelText: {
    fontSize: 8,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  statValText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 2,
  },
  pendingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  pendingBrand: {
    fontSize: 9,
    color: Colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  pendingProduct: {
    fontSize: 12,
    color: '#cbd5e1',
    fontWeight: 'bold',
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(2, 6, 23, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  modalDesc: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 6,
    marginBottom: 20,
    lineHeight: 16,
  },
  stripeSheet: {
    backgroundColor: 'rgba(2, 6, 23, 0.5)',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  stripeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  stripeSecure: {
    fontSize: 8,
    fontWeight: '800',
    color: '#10b981',
    letterSpacing: 1,
  },
  inputLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: Colors.textLight,
    textTransform: 'uppercase',
    marginBottom: 8,
    marginTop: 10,
  },
  modalInput: {
    backgroundColor: 'rgba(2, 6, 23, 0.7)',
    borderWidth: 0.8,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 42,
    color: '#ffffff',
    fontSize: 13,
  },
  cardInputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  modalBtns: {
    flexDirection: 'row',
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
  },
});
