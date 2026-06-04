import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert,
  Image,
  RefreshControl,
  Platform
} from 'react-native';
import { ArrowLeft, Check, X, ShieldAlert, Users, ShoppingBag, Eye } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Gradients } from '../../constants/DesignSystem';
import { MockAPI } from '../../api/mockData';
import MeshBackground from '../../components/MeshBackground';
import GlassCard from '../../components/GlassCard';
import Badge from '../../components/Badge';

export default function ApprovalCenter() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'VENDORS' | 'PRODUCTS' | 'INFLUENCERS'>('VENDORS');
  const [vendors, setVendors] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [influencers, setInfluencers] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);

  const fetchQueue = () => {
    try {
      setVendors(MockAPI.getVendors());
      setProducts(MockAPI.getProducts());
      setInfluencers(MockAPI.getInfluencers());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchQueue();
  };

  const handleVerifyVendor = async (vendorId: string, isApproved: boolean) => {
    setActionId(vendorId);
    await new Promise(resolve => setTimeout(resolve, 500));
    try {
      MockAPI.verifyVendor(vendorId, isApproved);
      Alert.alert('Verification Updated', `Vendor set to ${isApproved ? 'verified' : 'unverified'}`);
      fetchQueue();
    } catch (err) {
      Alert.alert('Error', 'Failed verification mutation');
    } finally {
      setActionId(null);
    }
  };

  const handleApproveProduct = async (productId: string, status: 'APPROVED' | 'REJECTED') => {
    setActionId(productId);
    await new Promise(resolve => setTimeout(resolve, 500));
    try {
      MockAPI.approveProduct(productId, status);
      Alert.alert('Moderation Logged', `Product status set to ${status}`);
      fetchQueue();
    } catch (err) {
      Alert.alert('Error', 'Failed moderation mutation');
    } finally {
      setActionId(null);
    }
  };

  const handleVerifyInfluencer = async (influencerId: string, isApproved: boolean) => {
    setActionId(influencerId);
    await new Promise(resolve => setTimeout(resolve, 500));
    try {
      MockAPI.verifyInfluencer(influencerId, isApproved);
      Alert.alert('Verification Updated', `Influencer set to ${isApproved ? 'verified' : 'unverified'}`);
      fetchQueue();
    } catch (err) {
      Alert.alert('Error', 'Failed verification mutation');
    } finally {
      setActionId(null);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <MeshBackground style={{ flex: 1 }}>
      {/* Navigation Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.circleBtn} onPress={() => router.back()}>
          <ArrowLeft size={16} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Moderation Center</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity 
          onPress={() => setActiveTab('VENDORS')} 
          style={[styles.tabButton, activeTab === 'VENDORS' && styles.tabActive]}
        >
          <Text style={[styles.tabText, activeTab === 'VENDORS' && styles.tabTextActive]}>Vendors</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => setActiveTab('PRODUCTS')} 
          style={[styles.tabButton, activeTab === 'PRODUCTS' && styles.tabActive]}
        >
          <Text style={[styles.tabText, activeTab === 'PRODUCTS' && styles.tabTextActive]}>Products</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => setActiveTab('INFLUENCERS')} 
          style={[styles.tabButton, activeTab === 'INFLUENCERS' && styles.tabActive]}
        >
          <Text style={[styles.tabText, activeTab === 'INFLUENCERS' && styles.tabTextActive]}>Influencers</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3b82f6" />}
      >
        {activeTab === 'VENDORS' && (
          <React.Fragment>
            {vendors.length === 0 ? (
              <GlassCard style={styles.emptyCard}><Text style={styles.emptyText}>No registered vendors</Text></GlassCard>
            ) : (
              vendors.map((vendor) => (
                <GlassCard key={vendor.id} style={styles.modCard}>
                  <View style={styles.modHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.modName}>{vendor.companyName}</Text>
                      <Text style={styles.modDetails}>Email: {vendor.user.email}</Text>
                      {vendor.website ? (
                        <Text style={styles.modLink}>Site: {vendor.website}</Text>
                      ) : null}
                    </View>
                    <Badge 
                      label={vendor.isApproved ? 'Approved' : 'Pending'} 
                      type={vendor.isApproved ? 'success' : 'warning'} 
                    />
                  </View>

                  <View style={styles.actionsRow}>
                    {actionId === vendor.id ? (
                      <ActivityIndicator size="small" color="#3b82f6" style={{ flex: 1 }} />
                    ) : !vendor.isApproved ? (
                      <TouchableOpacity 
                        onPress={() => handleVerifyVendor(vendor.id, true)}
                        style={styles.approveBtn}
                      >
                        <Check size={12} color="#ffffff" style={styles.btnIcon} />
                        <Text style={styles.btnText}>Verify Vendor</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity 
                        onPress={() => handleVerifyVendor(vendor.id, false)}
                        style={styles.declineBtn}
                      >
                        <X size={12} color="#ef4444" style={styles.btnIcon} />
                        <Text style={styles.declineBtnText}>Revoke Verification</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </GlassCard>
              ))
            )}
          </React.Fragment>
        )}

        {activeTab === 'PRODUCTS' && (
          <React.Fragment>
            {products.length === 0 ? (
              <GlassCard style={styles.emptyCard}><Text style={styles.emptyText}>No registered products</Text></GlassCard>
            ) : (
              products.map((prod) => {
                let parsedImages = [];
                try {
                  parsedImages = JSON.parse(prod.imageUrls);
                } catch (e) {
                  parsedImages = [prod.imageUrls];
                }
                const imgUri = parsedImages[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80';

                return (
                  <GlassCard key={prod.id} style={styles.modCard}>
                    <View style={styles.prodRow}>
                      <Image source={{ uri: imgUri }} style={styles.prodThumb} />
                      <View style={styles.prodInfo}>
                        <Text style={styles.prodTitle}>{prod.name}</Text>
                        <Text style={styles.prodVendor}>by {prod.vendor.companyName}</Text>
                        <View style={styles.badgeWrap}>
                          <Text style={styles.smallBadge}>Price: ${prod.price.toFixed(2)}</Text>
                          <Text style={[styles.smallBadge, { color: '#10b981' }]}>Commission: {prod.commissionPct}%</Text>
                        </View>
                      </View>
                      <Badge 
                        label={prod.status} 
                        type={prod.status === 'APPROVED' ? 'success' : prod.status === 'REJECTED' ? 'error' : 'warning'} 
                      />
                    </View>

                    <View style={styles.actionsRow}>
                      {actionId === prod.id ? (
                        <ActivityIndicator size="small" color="#3b82f6" style={{ flex: 1 }} />
                      ) : (
                        <React.Fragment>
                          {prod.status !== 'APPROVED' && (
                            <TouchableOpacity 
                              onPress={() => handleApproveProduct(prod.id, 'APPROVED')}
                              style={styles.approveBtn}
                            >
                              <Check size={12} color="#ffffff" style={styles.btnIcon} />
                              <Text style={styles.btnText}>Approve & Publish</Text>
                            </TouchableOpacity>
                          )}
                          {prod.status !== 'REJECTED' && (
                            <TouchableOpacity 
                              onPress={() => handleApproveProduct(prod.id, 'REJECTED')}
                              style={styles.declineBtn}
                            >
                              <X size={12} color="#ef4444" style={styles.btnIcon} />
                              <Text style={styles.declineBtnText}>Reject</Text>
                            </TouchableOpacity>
                          )}
                        </React.Fragment>
                      )}
                    </View>
                  </GlassCard>
                );
              })
            )}
          </React.Fragment>
        )}

        {activeTab === 'INFLUENCERS' && (
          <React.Fragment>
            {influencers.length === 0 ? (
              <GlassCard style={styles.emptyCard}><Text style={styles.emptyText}>No registered influencers</Text></GlassCard>
            ) : (
              influencers.map((inf) => (
                <GlassCard key={inf.id} style={styles.modCard}>
                  <View style={styles.modHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.modName}>{inf.displayName}</Text>
                      <Text style={styles.modDetails}>Email: {inf.user.email}</Text>
                      <Text style={styles.modDetails}>Audience: {inf.followers.toLocaleString()} fans</Text>
                      <View style={styles.nicheTagsRow}>
                        {inf.niche.map((n: string) => (
                          <Text key={n} style={styles.nicheLabel}>{n}</Text>
                        ))}
                      </View>
                    </View>
                    <Badge 
                      label={inf.isApproved ? 'Approved' : 'Pending'} 
                      type={inf.isApproved ? 'success' : 'warning'} 
                    />
                  </View>

                  <View style={styles.actionsRow}>
                    {actionId === inf.id ? (
                      <ActivityIndicator size="small" color="#3b82f6" style={{ flex: 1 }} />
                    ) : !inf.isApproved ? (
                      <TouchableOpacity 
                        onPress={() => handleVerifyInfluencer(inf.id, true)}
                        style={styles.approveBtn}
                      >
                        <Check size={12} color="#ffffff" style={styles.btnIcon} />
                        <Text style={styles.btnText}>Approve Creator</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity 
                        onPress={() => handleVerifyInfluencer(inf.id, false)}
                        style={styles.declineBtn}
                      >
                        <X size={12} color="#ef4444" style={styles.btnIcon} />
                        <Text style={styles.declineBtnText}>Revoke Creator</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </GlassCard>
              ))
            )}
          </React.Fragment>
        )}
      </ScrollView>
    </MeshBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 30,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
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
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: '#0f172a',
  },
  tabButton: {
    flex: 1,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(2, 6, 23, 0.4)',
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  tabText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  tabTextActive: {
    color: '#ffffff',
  },
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
  emptyCard: {
    padding: 30,
    alignItems: 'center',
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  modCard: {
    marginBottom: 16,
    borderWidth: 0.8,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  modHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  modName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  modDetails: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 3,
  },
  modLink: {
    fontSize: 11,
    color: '#3b82f6',
    marginTop: 3,
    textDecorationLine: 'underline',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  approveBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    height: 36,
  },
  btnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  btnIcon: {
    marginRight: 4,
  },
  declineBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(2, 6, 23, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    borderRadius: 8,
    height: 36,
  },
  declineBtnText: {
    color: '#ef4444',
    fontSize: 11,
    fontWeight: '700',
  },
  nicheTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 6,
  },
  nicheLabel: {
    fontSize: 8,
    color: '#cbd5e1',
    backgroundColor: '#020617',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontWeight: '600',
  },
  prodRow: {
    flexDirection: 'row',
    gap: 10,
  },
  prodThumb: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#020617',
  },
  prodInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  prodTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  prodVendor: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
  },
  badgeWrap: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  smallBadge: {
    fontSize: 8,
    fontWeight: '700',
    color: Colors.textMuted,
    backgroundColor: '#020617',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
});
