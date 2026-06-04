import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator, 
  TextInput,
  Image,
  RefreshControl,
  Alert
} from 'react-native';
import { Search, Store, CheckCircle, Clock, Heart, Award } from 'lucide-react-native';
import { Colors, Typography, Gradients } from '../../constants/DesignSystem';
import { MockAPI } from '../../api/mockData';
import MeshBackground from '../../components/MeshBackground';
import GlassCard from '../../components/GlassCard';
import Badge from '../../components/Badge';

export default function InfluencerMarketplace() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [reqId, setReqId] = useState<string | null>(null);

  const fetchProducts = () => {
    try {
      const allProds = MockAPI.getProducts().filter(p => p.status === 'APPROVED');
      const influencerCamps = MockAPI.getInfluencerCampaigns();

      const mapped = allProds.map(p => {
        const camp = influencerCamps.find(c => c.productId === p.id);
        return {
          ...p,
          promotionStatus: camp ? camp.status : null,
          campaignId: camp ? camp.id : null
        };
      });

      setProducts(mapped);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  const handleRequest = async (productId: string) => {
    setReqId(productId);
    await new Promise(resolve => setTimeout(resolve, 600));

    try {
      MockAPI.requestPromotion(productId);
      Alert.alert('Success', 'Your promoter request has been dispatched to the product vendor!');
      fetchProducts();
    } catch (err: any) {
      Alert.alert('Error', 'Failed to request promotion links.');
    } finally {
      setReqId(null);
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase()) ||
    p.vendor.companyName.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  return (
    <MeshBackground style={{ flex: 1 }}>
      {/* Search Header */}
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Search size={16} color="#64748b" style={styles.searchIcon} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search products or brands..."
            placeholderTextColor="#475569"
            style={styles.searchInput}
          />
        </View>
      </View>

      {/* Product List */}
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10b981" />}
      >
        {filtered.length === 0 ? (
          <GlassCard style={styles.emptyContainer}>
            <Store size={32} color="#64748b" style={{ marginBottom: 10 }} />
            <Text style={styles.emptyText}>No matching marketplace products found.</Text>
          </GlassCard>
        ) : (
          filtered.map((item) => {
            let parsedImages = [];
            try {
              parsedImages = JSON.parse(item.imageUrls);
            } catch (e) {
              parsedImages = [item.imageUrls];
            }
            const imgUri = parsedImages[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80';

            return (
              <GlassCard key={item.id} style={styles.card}>
                <View style={styles.imageBox}>
                  <Image source={{ uri: imgUri }} style={styles.image} />
                  <View style={styles.brandTag}>
                    <Award size={10} color="#10b981" style={{ marginRight: 4 }} />
                    <Text style={styles.brandText}>{item.vendor.companyName}</Text>
                  </View>
                </View>

                <View style={styles.cardBody}>
                  <Text style={styles.prodName}>{item.name}</Text>
                  <Text style={styles.prodDesc} numberOfLines={2}>{item.description}</Text>

                  {/* Financial metrics details */}
                  <View style={styles.statsRow}>
                    <View>
                      <Text style={styles.statLabel}>Retail Price</Text>
                      <Text style={styles.statValue}>${item.price.toFixed(2)}</Text>
                    </View>
                    <View>
                      <Text style={styles.statLabel}>Payout</Text>
                      <Text style={[styles.statValue, { color: '#10b981' }]}>{item.commissionPct}% Payout</Text>
                    </View>
                    <View>
                      <Text style={styles.statLabel}>Per Sale Earned</Text>
                      <Text style={[styles.statValue, { color: '#6366f1' }]}>
                        ${(item.price * (item.commissionPct / 100)).toFixed(2)}
                      </Text>
                    </View>
                  </View>

                  {/* Promotion actions buttons */}
                  <View style={styles.actionBtnContainer}>
                    {item.promotionStatus === 'ACTIVE' ? (
                      <View style={styles.statusBadgeActive}>
                        <CheckCircle size={14} color="#10b981" style={{ marginRight: 6 }} />
                        <Text style={styles.badgeTextActive}>Active Campaign</Text>
                      </View>
                    ) : item.promotionStatus === 'PENDING' ? (
                      <View style={styles.statusBadgePending}>
                        <Clock size={14} color="#f59e0b" style={{ marginRight: 6 }} />
                        <Text style={styles.badgeTextPending}>Awaiting Vendor Approval</Text>
                      </View>
                    ) : (
                      <TouchableOpacity 
                        onPress={() => handleRequest(item.id)}
                        disabled={reqId === item.id}
                        style={styles.activateBtn}
                      >
                        {reqId === item.id ? (
                          <ActivityIndicator color="#ffffff" size="small" />
                        ) : (
                          <Text style={styles.activateText}>Activate Promotion Link</Text>
                        )}
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </GlassCard>
            );
          })
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#0f172a',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(2, 6, 23, 0.6)',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 12,
    height: '100%',
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
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  card: {
    padding: 0,
    marginBottom: 20,
    borderWidth: 0.8,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  imageBox: {
    height: 140,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  brandTag: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(2, 6, 23, 0.9)',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  brandText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#10b981',
    textTransform: 'uppercase',
  },
  cardBody: {
    padding: 16,
  },
  prodName: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  prodDesc: {
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 6,
    lineHeight: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  statLabel: {
    fontSize: 8,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  statValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#cbd5e1',
    marginTop: 2,
  },
  actionBtnContainer: {
    marginTop: 14,
  },
  activateBtn: {
    backgroundColor: '#10b981',
    borderRadius: 12,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activateText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  statusBadgeActive: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.15)',
    borderRadius: 12,
    height: 40,
  },
  badgeTextActive: {
    color: '#10b981',
    fontSize: 11,
    fontWeight: '700',
  },
  statusBadgePending: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.15)',
    borderRadius: 12,
    height: 40,
  },
  badgeTextPending: {
    color: '#f59e0b',
    fontSize: 11,
    fontWeight: '700',
  },
});
