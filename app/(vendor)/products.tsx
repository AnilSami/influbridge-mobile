import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator, 
  TextInput, 
  Modal, 
  Alert,
  Image,
  RefreshControl,
  Platform
} from 'react-native';
import { Plus, Trash2, ChevronRight, Sparkles, X, Heart } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Gradients } from '../../constants/DesignSystem';
import { MockAPI } from '../../api/mockData';
import MeshBackground from '../../components/MeshBackground';
import GlassCard from '../../components/GlassCard';
import Badge from '../../components/Badge';
import GradientButton from '../../components/GradientButton';
import ProductForm from '../../components/ProductForm';

export default function VendorProducts() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Form inputs
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [commissionPct, setCommissionPct] = useState('');
  const [imageVal, setImageVal] = useState('');
  const [maxInfluencers, setMaxInfluencers] = useState('');
  const [minFollowers, setMinFollowers] = useState('');
  const [formError, setFormError] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchProducts = () => {
    try {
      const allProds = MockAPI.getVendorProducts();
      setProducts(allProds);
    } catch (err) {
      console.error('Error fetching products:', err);
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

  const handleAddProduct = async () => {
    if (!name || !description || !price || !commissionPct) {
      setFormError('Please fill in all required fields');
      return;
    }

    setFormError('');
    setSubmitLoading(true);

    await new Promise(resolve => setTimeout(resolve, 800));

    const defaultImage = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80';
    const finalImage = imageVal.trim() || defaultImage;

    try {
      MockAPI.createProduct(
        name,
        description,
        parseFloat(price),
        parseInt(commissionPct, 10),
        JSON.stringify([finalImage]),
        maxInfluencers ? parseInt(maxInfluencers, 10) : 0,
        minFollowers ? parseInt(minFollowers, 10) : 0
      );

      setName('');
      setDescription('');
      setPrice('');
      setCommissionPct('');
      setImageVal('');
      setMaxInfluencers('');
      setMinFollowers('');
      setShowModal(false);
      fetchProducts();
    } catch (err: any) {
      setFormError('Failed to upload product catalog asset');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = (productId: string) => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product? All active promoter campaign links will be cancelled.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            MockAPI.deleteProduct(productId);
            fetchProducts();
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <MeshBackground style={{ flex: 1 }}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6366f1" />}
      >
        {products.length === 0 ? (
          <GlassCard style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Your product catalog is empty.</Text>
            <Text style={styles.emptySubtext}>Add products to start generating requests.</Text>
          </GlassCard>
        ) : (
          products.map((item) => {
            let parsedImages = [];
            try {
              parsedImages = JSON.parse(item.imageUrls);
            } catch (e) {
              parsedImages = [item.imageUrls];
            }
            const imgUri = parsedImages[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80';

            return (
              <GlassCard key={item.id} style={styles.productCard}>
                <TouchableOpacity 
                  onPress={() => router.push({
                    pathname: '/(vendor)/product-details' as any,
                    params: { productId: item.id }
                  })}
                  activeOpacity={0.7}
                >
                  <View style={styles.imageContainer}>
                    <Image source={{ uri: imgUri }} style={styles.productImage} />
                    <View style={styles.badgeOverlay}>
                      <Badge 
                        label={item.status} 
                        type={item.status === 'APPROVED' ? 'success' : item.status === 'REJECTED' ? 'error' : 'warning'} 
                      />
                    </View>
                  </View>
                  <View style={[styles.cardBody, { paddingBottom: 0 }]}>
                    <View style={styles.row}>
                      <Text style={styles.productName}>{item.name}</Text>
                      <ChevronRight size={18} color="#cbd5e1" />
                    </View>
                    <Text style={styles.productDesc} numberOfLines={2}>{item.description}</Text>
                  </View>
                </TouchableOpacity>

                <View style={[styles.cardBody, { paddingTop: 0 }]}>
                  <View style={styles.financialsRow}>
                    <View>
                      <Text style={styles.financialLabel}>Catalog Price</Text>
                      <Text style={styles.financialValue}>${item.price.toFixed(2)}</Text>
                    </View>
                    <View>
                      <Text style={styles.financialLabel}>Commission</Text>
                      <Text style={styles.commissionValue}>{item.commissionPct}% Payout</Text>
                    </View>
                    <TouchableOpacity 
                      onPress={() => handleDelete(item.id)}
                      style={styles.deleteButton}
                    >
                      <Trash2 size={14} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              </GlassCard>
            );
          })
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        onPress={() => setShowModal(true)}
        style={styles.fab}
      >
        <Plus size={24} color="#ffffff" />
      </TouchableOpacity>

      {/* Add Product Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <GlassCard style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Product Asset</Text>
              <TouchableOpacity onPress={() => { setShowModal(false); setFormError(''); }}>
                <X size={18} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            {formError ? (
              <View style={styles.formErrorBanner}>
                <Text style={styles.formErrorText}>{formError}</Text>
              </View>
            ) : null}

            <ProductForm
              name={name}
              setName={setName}
              description={description}
              setDescription={setDescription}
              price={price}
              setPrice={setPrice}
              commissionPct={commissionPct}
              setCommissionPct={setCommissionPct}
              maxInfluencers={maxInfluencers}
              setMaxInfluencers={setMaxInfluencers}
              minFollowers={minFollowers}
              setMinFollowers={setMinFollowers}
              showImageInput={true}
              imageVal={imageVal}
              setImageVal={setImageVal}
            />

            <View style={styles.modalButtons}>
              <GradientButton 
                title="Publish to Marketplace"
                onPress={handleAddProduct}
                loading={submitLoading}
                style={{ flex: 1 }}
                icon={<Sparkles size={14} color="#fff" />}
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
    paddingBottom: 100, // Added padding to clear suspended tab bar!
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
    color: '#cbd5e1',
    fontWeight: 'bold',
    fontSize: 14,
  },
  emptySubtext: {
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: 4,
  },
  productCard: {
    padding: 0,
    marginBottom: 20,
    borderWidth: 0.8,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  imageContainer: {
    height: 160,
    backgroundColor: 'rgba(2, 6, 23, 0.4)',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  badgeOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  cardBody: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productName: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
  },
  productDesc: {
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 6,
    lineHeight: 16,
  },
  financialsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  financialLabel: {
    fontSize: 8,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  financialValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 2,
  },
  commissionValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#10b981',
    marginTop: 2,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 100, // Adjusted FAB to hover above suspended tab bar!
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
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
    padding: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  formErrorBanner: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    padding: 10,
    borderRadius: 10,
    marginBottom: 16,
  },
  formErrorText: {
    color: '#ef4444',
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  formScroll: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  formInput: {
    backgroundColor: 'rgba(2, 6, 23, 0.6)',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    color: '#ffffff',
    fontSize: 13,
    marginBottom: 14,
  },
  formTextarea: {
    height: 70,
    paddingTop: 10,
    textAlignVertical: 'top',
  },
  formRow: {
    flexDirection: 'row',
    gap: 10,
  },
  formRowCol: {
    flex: 1,
  },
  modalButtons: {
    flexDirection: 'row',
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
  },
});
