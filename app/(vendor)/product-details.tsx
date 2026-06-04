import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Platform, Modal, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, BarChart2, ShieldCheck, Tag, DollarSign, MousePointerClick, Edit, X, Users, ShieldAlert, Sparkles } from 'lucide-react-native';
import { Colors, Typography, Gradients } from '../../constants/DesignSystem';
import { MockAPI } from '../../api/mockData';
import MeshBackground from '../../components/MeshBackground';
import GlassCard from '../../components/GlassCard';
import Badge from '../../components/Badge';
import GradientButton from '../../components/GradientButton';
import ProductForm from '../../components/ProductForm';

export default function ProductDetails() {
  const router = useRouter();
  const { productId } = useLocalSearchParams();

  const [product, setProduct] = useState<any>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Edit fields state
  const [showEditModal, setShowEditModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [commissionPct, setCommissionPct] = useState('');
  const [maxInfluencers, setMaxInfluencers] = useState('');
  const [minFollowers, setMinFollowers] = useState('');
  const [editError, setEditError] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    const p = MockAPI.getProducts().find(item => item.id === productId);
    if (p) {
      setProduct(p);
      setName(p.name);
      setDescription(p.description);
      setPrice(p.price.toString());
      setCommissionPct(p.commissionPct.toString());
      setMaxInfluencers((p.maxInfluencers || 0).toString());
      setMinFollowers((p.minFollowers || 0).toString());
    }
  }, [productId, refreshTrigger]);

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Product catalog item not found.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={16} color="#fff" />
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  let parsedImages = [];
  try {
    parsedImages = JSON.parse(product.imageUrls);
  } catch (e) {
    parsedImages = [product.imageUrls];
  }
  const imgUri = parsedImages[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80';

  // Compute simulated product KPIs
  const productCampaigns = MockAPI.getCampaigns().filter(c => c.productId === product.id && c.status === 'ACTIVE');
  const totalClicks = productCampaigns.reduce((sum, c) => sum + c.clicks, 0);
  const totalConversions = productCampaigns.reduce((sum, c) => sum + c.conversions, 0);
  const totalRevenue = productCampaigns.reduce((sum, c) => sum + c.totalRevenue, 0);

  const handleSave = async () => {
    if (!name || !description || !price || !commissionPct) {
      setEditError('Please fill in all required fields');
      return;
    }

    setEditError('');
    setSaveLoading(true);

    // Simulate mock save delay for premium feel
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      MockAPI.updateProduct(
        product.id,
        name,
        description,
        parseFloat(price),
        parseInt(commissionPct, 10),
        maxInfluencers ? parseInt(maxInfluencers, 10) : 0,
        minFollowers ? parseInt(minFollowers, 10) : 0
      );
      
      setRefreshTrigger(prev => prev + 1);
      setShowEditModal(false);
      Alert.alert('Success', 'Product specifications updated successfully');
    } catch (e) {
      setEditError('Failed to update specifications');
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <MeshBackground style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.circleBtn} onPress={() => router.back()}>
            <ArrowLeft size={16} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Product Analytics</Text>
          <TouchableOpacity style={styles.circleBtn} onPress={() => setShowEditModal(true)}>
            <Edit size={14} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Hero Image */}
        <GlassCard style={styles.heroCard}>
          <Image source={{ uri: imgUri }} style={styles.heroImage} />
          <View style={styles.statusBadge}>
            <Badge 
              label={product.status} 
              type={product.status === 'APPROVED' ? 'success' : 'warning'} 
            />
          </View>
        </GlassCard>

        {/* Info Card */}
        <GlassCard style={styles.infoCard}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.brandName}>Vendor: {product.vendor.companyName}</Text>
          <Text style={styles.description}>{product.description}</Text>

          {/* Catalog specifications */}
          <View style={styles.specsRow}>
            <View style={styles.specBox}>
              <Tag size={12} color="#6366f1" />
              <Text style={styles.specLabel}>Retail Price</Text>
              <Text style={styles.specValue}>${product.price.toFixed(2)}</Text>
            </View>
            <View style={styles.specBox}>
              <DollarSign size={12} color="#10b981" />
              <Text style={styles.specLabel}>Commission Rate</Text>
              <Text style={[styles.specValue, { color: '#10b981' }]}>{product.commissionPct}%</Text>
            </View>
          </View>

          {/* Restriction specifications */}
          <View style={[styles.specsRow, { marginTop: 12, borderTopWidth: 0, paddingTop: 0 }]}>
            <View style={styles.specBox}>
              <Users size={12} color="#0ea5e9" />
              <Text style={styles.specLabel}>Promoter Limit</Text>
              <Text style={styles.specValue}>
                {product.maxInfluencers && product.maxInfluencers > 0 
                  ? `${productCampaigns.length} / ${product.maxInfluencers} Slots` 
                  : 'Unlimited'}
              </Text>
            </View>
            <View style={styles.specBox}>
              <ShieldAlert size={12} color="#f59e0b" />
              <Text style={styles.specLabel}>Min Followers</Text>
              <Text style={styles.specValue}>
                {product.minFollowers && product.minFollowers > 0 
                  ? `${product.minFollowers.toLocaleString()}+` 
                  : 'None'}
              </Text>
            </View>
          </View>
        </GlassCard>

        {/* Marketing KPIs */}
        <Text style={styles.sectionTitle}>Campaign Metrics</Text>
        <View style={styles.metricsGrid}>
          <GlassCard style={styles.metricCard}>
            <MousePointerClick size={16} color="#6366f1" style={{ marginBottom: 6 }} />
            <Text style={styles.metricLabel}>Clicks</Text>
            <Text style={styles.metricValue}>{totalClicks}</Text>
          </GlassCard>
          <GlassCard style={styles.metricCard}>
            <BarChart2 size={16} color="#3b82f6" style={{ marginBottom: 6 }} />
            <Text style={styles.metricLabel}>Conversions</Text>
            <Text style={styles.metricValue}>{totalConversions}</Text>
          </GlassCard>
          <GlassCard style={styles.metricCard}>
            <DollarSign size={16} color="#10b981" style={{ marginBottom: 6 }} />
            <Text style={styles.metricLabel}>Gross GMV</Text>
            <Text style={[styles.metricValue, { color: '#10b981' }]}>${totalRevenue.toFixed(0)}</Text>
          </GlassCard>
        </View>

        {/* Active Promoters */}
        <GlassCard style={styles.promotersCard}>
          <View style={styles.promotersHeader}>
            <ShieldCheck size={16} color="#10b981" />
            <Text style={styles.promotersTitle}>Active Partnerships</Text>
          </View>
          <Text style={styles.promotersDesc}>
            There are currently {productCampaigns.length} influencers actively promoting this catalog asset.
          </Text>
        </GlassCard>
      </ScrollView>

      {/* Edit Specifications Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <GlassCard style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Product Specs</Text>
              <TouchableOpacity onPress={() => { setShowEditModal(false); setEditError(''); }}>
                <X size={18} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            {editError ? (
              <View style={styles.formErrorBanner}>
                <Text style={styles.formErrorText}>{editError}</Text>
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
              showImageInput={false}
            />

            <View style={styles.modalButtons}>
              <GradientButton 
                title="Save Specifications"
                onPress={handleSave}
                loading={saveLoading}
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
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 30,
    paddingBottom: 100, // Adjusted padding to clear suspended tab bar!
  },
  errorContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  backBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
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
  heroCard: {
    padding: 0,
    height: 200,
    marginBottom: 20,
    borderWidth: 0.8,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  infoCard: {
    marginBottom: 24,
    borderWidth: 0.8,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  brandName: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '700',
    marginTop: 4,
    textTransform: 'uppercase',
  },
  description: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 10,
    lineHeight: 18,
  },
  specsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 16,
  },
  specBox: {
    flex: 1,
    backgroundColor: 'rgba(2, 6, 23, 0.4)',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 10,
  },
  specLabel: {
    fontSize: 8,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    fontWeight: '700',
    marginTop: 6,
  },
  specValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 2,
  },
  sectionTitle: {
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
    marginBottom: 20,
  },
  metricCard: {
    flex: 1,
    padding: 12,
    borderWidth: 0.8,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  metricLabel: {
    fontSize: 8,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  metricValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 2,
  },
  promotersCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.03)',
    borderColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 0.8,
  },
  promotersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  promotersTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#10b981',
  },
  promotersDesc: {
    fontSize: 11,
    color: Colors.textLight,
    lineHeight: 16,
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
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  formScroll: {
    maxHeight: 400,
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
    marginTop: 12,
  },
  formInput: {
    backgroundColor: 'rgba(2, 6, 23, 0.6)',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    color: '#ffffff',
    fontSize: 13,
    height: 48,
    marginBottom: 12,
  },
  formTextarea: {
    height: 80,
    paddingVertical: 10,
    textAlignVertical: 'top',
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  formRowCol: {
    flex: 1,
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
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
  },
});
