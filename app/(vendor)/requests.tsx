import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert,
  Linking,
  RefreshControl,
  Modal,
  Image,
  Platform,
  Clipboard as RNClipboard
} from 'react-native';
import { Check, X, Clipboard, ExternalLink, ShieldAlert, Award, QrCode, Share2, Copy } from 'lucide-react-native';
import { Colors, Typography, Gradients } from '../../constants/DesignSystem';
import { MockAPI } from '../../api/mockData';
import GlassCard from '../../components/GlassCard';
import Badge from '../../components/Badge';
import MeshBackground from '../../components/MeshBackground';

export default function VendorRequests() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  
  const [showKitModal, setShowKitModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);

  const fetchCampaigns = () => {
    try {
      const response = MockAPI.getVendorCampaigns();
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

  const handleApprove = async (campaignId: string) => {
    setActionId(campaignId);
    // Simulate slight network approval delay for interactive UI/UX feel
    await new Promise(resolve => setTimeout(resolve, 600));

    try {
      const updatedCamp = MockAPI.approveCampaign(campaignId, 'APPROVED');
      setSelectedCampaign(updatedCamp);
      setShowKitModal(true);
      fetchCampaigns();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to approve application.');
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async (campaignId: string) => {
    setActionId(campaignId);
    await new Promise(resolve => setTimeout(resolve, 600));

    try {
      MockAPI.approveCampaign(campaignId, 'REJECTED');
      fetchCampaigns();
    } catch (err) {
      console.error(err);
    } finally {
      setActionId(null);
    }
  };

  const copyToClipboard = (text: string) => {
    RNClipboard.setString(text);
    Alert.alert('Copied', 'Referral link copied to clipboard!');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  const pending = campaigns.filter((c) => c.status === 'PENDING');
  const active = campaigns.filter((c) => c.status === 'ACTIVE');

  return (
    <MeshBackground style={{ flex: 1 }}>
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.contentContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6366f1" />}
      >
        {/* Inbox section */}
        <Text style={styles.sectionHeader}>Pending Applications ({pending.length})</Text>
        
        {pending.length === 0 ? (
          <GlassCard style={styles.emptyCard}>
            <Text style={styles.emptyText}>No pending promoter applications.</Text>
          </GlassCard>
        ) : (
          pending.map((item) => {
            return (
              <GlassCard key={item.id} style={styles.requestCard}>
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.influencerName}>{item.influencer.displayName}</Text>
                    <Text style={styles.campaignProduct}>Requesting to promote: {item.product.name}</Text>
                  </View>
                </View>

                {/* Social Stats */}
                <View style={styles.statsRow}>
                  <View style={styles.statCol}>
                    <Text style={styles.statLabel}>Followers</Text>
                    <Text style={styles.statValue}>{item.influencer.followers.toLocaleString()}</Text>
                  </View>
                  <View style={styles.statCol}>
                    <Text style={styles.statLabel}>Engagement</Text>
                    <Text style={styles.statValue}>{item.influencer.engagementRate}%</Text>
                  </View>
                  <View style={[styles.statCol, { flex: 2 }]}>
                    <Text style={styles.statLabel}>Niches</Text>
                    <View style={styles.nicheContainer}>
                      {item.influencer.niche.slice(0, 2).map((n: string) => (
                        <Text key={n} style={styles.nicheTag}>{n}</Text>
                      ))}
                    </View>
                  </View>
                </View>

                {/* Action buttons */}
                <View style={styles.actionsRow}>
                  {actionId === item.id ? (
                    <ActivityIndicator size="small" color="#6366f1" style={{ flex: 1 }} />
                  ) : (
                    <React.Fragment>
                      <TouchableOpacity 
                        onPress={() => handleApprove(item.id)}
                        style={styles.approveBtn}
                      >
                        <Check size={12} color="#ffffff" style={styles.btnIcon} />
                        <Text style={styles.approveText}>Approve</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        onPress={() => handleReject(item.id)}
                        style={styles.rejectBtn}
                      >
                        <X size={12} color="#ef4444" style={styles.btnIcon} />
                        <Text style={styles.rejectText}>Decline</Text>
                      </TouchableOpacity>
                    </React.Fragment>
                  )}
                </View>
              </GlassCard>
            );
          })
        )}

        {/* Active campaigns */}
        <Text style={[styles.sectionHeader, { marginTop: 24 }]}>Active Networks ({active.length})</Text>
        
        {active.length === 0 ? (
          <GlassCard style={styles.emptyCard}>
            <Text style={styles.emptyText}>No active campaigns.</Text>
          </GlassCard>
        ) : (
          active.map((item) => (
            <GlassCard key={item.id} style={styles.activeCard}>
              <View style={styles.activeHeader}>
                <View>
                  <Text style={styles.activeName}>{item.influencer.displayName}</Text>
                  <Text style={styles.activeProduct}>Promoting: {item.product.name}</Text>
                </View>
                <Badge label="Active" type="success" />
              </View>

              <View style={styles.activeDetails}>
                <Text style={styles.detailLabel}>Code: <Text style={styles.detailCode}>{item.couponCode || 'N/A'}</Text></Text>
                <TouchableOpacity 
                  onPress={() => copyToClipboard(item.referralLink)}
                  style={styles.copyBtn}
                >
                  <Clipboard size={12} color="#6366f1" style={styles.btnIcon} />
                  <Text style={styles.copyText}>Copy link</Text>
                </TouchableOpacity>
              </View>

              {/* Campaign metrics */}
              <View style={styles.miniMetrics}>
                <View style={styles.miniCol}>
                  <Text style={styles.miniLabel}>Clicks</Text>
                  <Text style={styles.miniValue}>{item.clicks}</Text>
                </View>
                <View style={styles.miniCol}>
                  <Text style={styles.miniLabel}>Conversions</Text>
                  <Text style={styles.miniValue}>{item.conversions}</Text>
                </View>
                <View style={styles.miniCol}>
                  <Text style={styles.miniLabel}>Revenue</Text>
                  <Text style={[styles.miniValue, { color: '#10b981' }]}>${item.totalRevenue.toFixed(0)}</Text>
                </View>
              </View>
            </GlassCard>
          ))
        )}
      </ScrollView>

      {/* Marketing Kit Modal */}
      <Modal
        visible={showKitModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowKitModal(false)}
      >
        <View style={styles.modalOverlay}>
          <GlassCard style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleRow}>
                <Award size={18} color="#10b981" style={{ marginRight: 6 }} />
                <Text style={styles.modalTitle}>Marketing Kit Generated</Text>
              </View>
              <TouchableOpacity onPress={() => setShowKitModal(false)}>
                <X size={18} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalDesc}>
              Referral parameters created for <Text style={{ color: '#fff', fontWeight: 'bold' }}>{selectedCampaign?.influencer.displayName}</Text>. The promoter has been notified.
            </Text>

            {/* Visual QR Code Tracking Card */}
            <View style={styles.qrTrackCard}>
              <View style={styles.qrCardHeader}>
                <Image 
                  source={require('../../assets/images/brandly_logo.png')} 
                  style={styles.qrCardLogo} 
                />
                <Text style={styles.qrCardBrand}>Brandly Partner</Text>
              </View>

              <View style={styles.qrMiddleRow}>
                <View style={styles.qrInfoCol}>
                  <Text style={styles.qrCardLabel}>PROMOTER</Text>
                  <Text style={styles.qrCardVal}>{selectedCampaign?.influencer.displayName}</Text>
                  
                  <Text style={[styles.qrCardLabel, { marginTop: 10 }]}>PRODUCT</Text>
                  <Text style={styles.qrCardVal} numberOfLines={1}>{selectedCampaign?.product.name}</Text>
                </View>
                
                <View style={styles.qrCodeBox}>
                  <QrCode size={40} color="#020617" />
                  <Text style={styles.qrCodeText}>SCAN TO TRACK</Text>
                </View>
              </View>

              <View style={styles.qrCardFooter}>
                <Text style={styles.qrCardRefCode}>{selectedCampaign?.referralCode}</Text>
              </View>
            </View>

            {/* Campaign Links Box */}
            <View style={styles.kitLinksBox}>
              <Text style={styles.kitLabel}>REFERRAL TRACKING LINK</Text>
              <View style={styles.kitLinkRow}>
                <Text style={styles.kitLinkText} numberOfLines={1}>{selectedCampaign?.referralLink}</Text>
                <TouchableOpacity onPress={() => {
                  RNClipboard.setString(selectedCampaign?.referralLink || '');
                  Alert.alert('Copied', 'Referral link copied to clipboard!');
                }}>
                  <Copy size={14} color="#6366f1" />
                </TouchableOpacity>
              </View>

              {selectedCampaign?.couponCode && (
                <View style={{ marginTop: 12 }}>
                  <Text style={styles.kitLabel}>PROMOTER COUPON CODE</Text>
                  <View style={styles.kitLinkRow}>
                    <Text style={styles.kitCodeText}>{selectedCampaign?.couponCode}</Text>
                    <TouchableOpacity onPress={() => {
                      RNClipboard.setString(selectedCampaign?.couponCode || '');
                      Alert.alert('Copied', 'Coupon code copied to clipboard!');
                    }}>
                      <Copy size={14} color="#6366f1" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>

            <TouchableOpacity 
              style={styles.kitCloseBtn} 
              onPress={() => setShowKitModal(false)}
            >
              <Text style={styles.kitCloseBtnText}>Close & Publish Live</Text>
            </TouchableOpacity>
          </GlassCard>
        </View>
      </Modal>
    </MeshBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
  sectionHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  emptyCard: {
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  requestCard: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  influencerName: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  campaignProduct: {
    color: '#6366f1',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(2, 6, 23, 0.4)',
    borderRadius: 12,
    padding: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statCol: {
    flex: 1,
  },
  statLabel: {
    fontSize: 8,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  statValue: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 2,
  },
  nicheContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 2,
  },
  nicheTag: {
    fontSize: 8,
    color: '#cbd5e1',
    backgroundColor: '#1e293b',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4,
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  approveBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366f1',
    borderRadius: 10,
    height: 36,
  },
  approveText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  rejectBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(2, 6, 23, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    borderRadius: 10,
    height: 36,
  },
  rejectText: {
    color: '#ef4444',
    fontSize: 11,
    fontWeight: '700',
  },
  btnIcon: {
    marginRight: 4,
  },
  activeCard: {
    marginBottom: 16,
  },
  activeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  activeName: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  activeProduct: {
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  activeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(2, 6, 23, 0.4)',
    padding: 10,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  detailLabel: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '600',
  },
  detailCode: {
    color: '#cbd5e1',
    fontWeight: 'bold',
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  copyText: {
    color: '#6366f1',
    fontSize: 10,
    fontWeight: '700',
  },
  miniMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  miniCol: {
    alignItems: 'center',
    flex: 1,
  },
  miniLabel: {
    fontSize: 8,
    color: Colors.textMuted,
    textTransform: 'uppercase',
  },
  miniValue: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(2, 6, 23, 0.85)',
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
    marginBottom: 16,
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  modalDesc: {
    fontSize: 11,
    color: Colors.textMuted,
    lineHeight: 16,
    marginBottom: 20,
  },
  qrTrackCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.2)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  qrCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
    paddingBottom: 10,
  },
  qrCardLogo: {
    width: 24,
    height: 24,
    borderRadius: 6,
    marginRight: 8,
  },
  qrCardBrand: {
    fontSize: 10,
    fontWeight: '900',
    color: '#10b981',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  qrMiddleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  qrInfoCol: {
    flex: 1,
    marginRight: 12,
  },
  qrCardLabel: {
    fontSize: 8,
    color: Colors.textMuted,
    fontWeight: '800',
  },
  qrCardVal: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 2,
  },
  qrCodeBox: {
    width: 76,
    height: 76,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  qrCodeText: {
    fontSize: 6,
    fontWeight: '900',
    color: '#020617',
    marginTop: 4,
    textAlign: 'center',
  },
  qrCardFooter: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    paddingTop: 10,
    alignItems: 'center',
  },
  qrCardRefCode: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
  },
  kitLinksBox: {
    backgroundColor: 'rgba(2, 6, 23, 0.4)',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 12,
    marginBottom: 24,
  },
  kitLabel: {
    fontSize: 8,
    color: Colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  kitLinkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  kitLinkText: {
    color: '#6366f1',
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    flex: 1,
    marginRight: 10,
  },
  kitCodeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  kitCloseBtn: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Platform.OS === 'ios' ? 16 : 0,
  },
  kitCloseBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 12,
  },
});
