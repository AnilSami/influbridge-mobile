import React from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';
import { Colors } from '../constants/DesignSystem';

interface ProductFormProps {
  name: string;
  setName: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  price: string;
  setPrice: (val: string) => void;
  commissionPct: string;
  setCommissionPct: (val: string) => void;
  maxInfluencers: string;
  setMaxInfluencers: (val: string) => void;
  minFollowers: string;
  setMinFollowers: (val: string) => void;
  showImageInput?: boolean;
  imageVal?: string;
  setImageVal?: (val: string) => void;
}

export default function ProductForm({
  name,
  setName,
  description,
  setDescription,
  price,
  setPrice,
  commissionPct,
  setCommissionPct,
  maxInfluencers,
  setMaxInfluencers,
  minFollowers,
  setMinFollowers,
  showImageInput = false,
  imageVal = '',
  setImageVal
}: ProductFormProps) {
  return (
    <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false}>
      <Text style={styles.formLabel}>Product Name *</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="e.g. Apex Trail Running Shoes"
        placeholderTextColor="#475569"
        style={styles.formInput}
      />

      <Text style={styles.formLabel}>Description Specifications *</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Specifications, size ranges, marketing copies..."
        placeholderTextColor="#475569"
        multiline
        numberOfLines={3}
        style={[styles.formInput, styles.formTextarea]}
      />

      <View style={styles.formRow}>
        <View style={styles.formRowCol}>
          <Text style={styles.formLabel}>Price ($) *</Text>
          <TextInput
            value={price}
            onChangeText={setPrice}
            placeholder="159.99"
            placeholderTextColor="#475569"
            keyboardType="numeric"
            style={styles.formInput}
          />
        </View>
        <View style={styles.formRowCol}>
          <Text style={styles.formLabel}>Commission (%) *</Text>
          <TextInput
            value={commissionPct}
            onChangeText={setCommissionPct}
            placeholder="15"
            placeholderTextColor="#475569"
            keyboardType="numeric"
            style={styles.formInput}
          />
        </View>
      </View>

      {showImageInput && setImageVal && (
        <View>
          <Text style={styles.formLabel}>Unsplash Image URL (Optional)</Text>
          <TextInput
            value={imageVal}
            onChangeText={setImageVal}
            placeholder="https://images.unsplash.com/..."
            placeholderTextColor="#475569"
            autoCapitalize="none"
            style={styles.formInput}
          />
        </View>
      )}

      <Text style={[styles.formLabel, { color: Colors.primary, marginTop: 12 }]}>Promoter Restrictions</Text>
      <View style={styles.formRow}>
        <View style={styles.formRowCol}>
          <Text style={styles.formLabel}>Max Promoters (Cap)</Text>
          <TextInput
            value={maxInfluencers}
            onChangeText={setMaxInfluencers}
            placeholder="e.g. 5 (0 = Unlimited)"
            placeholderTextColor="#475569"
            keyboardType="numeric"
            style={styles.formInput}
          />
        </View>
        <View style={styles.formRowCol}>
          <Text style={styles.formLabel}>Min Followers</Text>
          <TextInput
            value={minFollowers}
            onChangeText={setMinFollowers}
            placeholder="e.g. 10000"
            placeholderTextColor="#475569"
            keyboardType="numeric"
            style={styles.formInput}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  formScroll: {
    marginBottom: 16,
    flexShrink: 1,
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
    height: 48,
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
});
