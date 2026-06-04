import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, BarChart2, ShieldCheck, Tag, DollarSign, MousePointerClick } from 'lucide-react-native';
import { Colors, Typography, Gradients } from '../../constants/DesignSystem';
import { MockAPI } from '../../api/mockData';
import MeshBackground from '../../components/MeshBackground';
import GlassCard from '../../components/GlassCard';
import Badge from '../../components/Badge';

export default function ProductDetails() {
  const router = useRouter();
  const { productId } = useLocalSearchParams();

  const product = MockAPI.getProducts().find(p => p.id === productId);

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
  const productCampaigns = MockAPI.getCampaigns().filter(c => c.productId === product.id);
  const totalClicks = productCampaigns.reduce((sum, c) => sum + c.clicks, 0);
  const totalConversions = productCampaigns.reduce((sum, c) => sum + c.conversions, 0);
  const totalRevenue = productCampaigns.reduce((sum, c) => sum + c.totalRevenue, 0);

  return (
    <MeshBackground style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {/* Back Button */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.circleBtn} onPress={() => router.back()}>
            <ArrowLeft size={16} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Product Analytics</Text>
          <View style={{ width: 36 }} />
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

          <View style={styles.specsRow}>
            <View style={styles.specBox}>
              <Tag size={14} color="#6366f1" />
              <Text style={styles.specLabel}>Retail Price</Text>
              <Text style={styles.specValue}>${product.price.toFixed(2)}</Text>
            </View>
            <View style={styles.specBox}>
              <DollarSign size={14} color="#10b981" />
              <Text style={styles.specLabel}>Commission Rate</Text>
              <Text style={[styles.specValue, { color: '#10b981' }]}>{product.commissionPct}%</Text>
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
            There are currently {productCampaigns.length} influencers promoting this asset in social networks.
          </Text>
        </GlassCard>
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
    fontSize: 13,
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
  }
});
