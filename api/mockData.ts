// Mock Data Layer for the Premium InfluBridge Mobile UI Prototype
// Drives all screens in memory to bypass backend database latency and auth logic

export interface User {
  id: string;
  email: string;
  role: 'VENDOR' | 'INFLUENCER' | 'ADMIN';
  isVerified: boolean;
}

export interface Vendor {
  id: string;
  userId: string;
  companyName: string;
  website: string;
  isApproved: boolean;
  user: {
    email: string;
    isVerified: boolean;
  };
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  commissionPct: number;
  imageUrls: string; // JSON string array
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  vendorId: string;
  vendor: {
    companyName: string;
  };
}

export interface Influencer {
  id: string;
  userId: string;
  displayName: string;
  niche: string[];
  followers: number;
  engagementRate: number;
  isApproved: boolean;
  instagramUrl?: string;
  youtubeUrl?: string;
  tiktokUrl?: string;
  user: {
    email: string;
    isVerified: boolean;
  };
}

export interface Campaign {
  id: string;
  productId: string;
  influencerId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ACTIVE';
  referralCode: string;
  referralLink: string;
  couponCode: string | null;
  clicks: number;
  conversions: number;
  totalRevenue: number;
  commission: number;
  createdAt: string;
  product: {
    name: string;
    price: number;
    commissionPct: number;
    vendor: {
      companyName: string;
    };
  };
  influencer: {
    displayName: string;
    niche: string[];
    followers: number;
    engagementRate: number;
  };
}

export interface Order {
  id: string;
  campaignId: string;
  amount: number;
  commission: number;
  createdAt: string;
  campaign: {
    product: {
      name: string;
    };
    influencer: {
      displayName: string;
    };
  };
}

// Memory Database
let currentUser: User | null = {
  id: 'usr-1',
  email: 'influencer@influbridge.com',
  role: 'INFLUENCER',
  isVerified: true
};

let vendors: Vendor[] = [
  {
    id: 'vend-1',
    userId: 'usr-2',
    companyName: 'GearUp Labs',
    website: 'https://gearup.labs',
    isApproved: true,
    user: { email: 'vendor@influbridge.com', isVerified: true }
  },
  {
    id: 'vend-2',
    userId: 'usr-4',
    companyName: 'Aura Cosmetics',
    website: 'https://aura.beauty',
    isApproved: false,
    user: { email: 'aura@beauty.com', isVerified: false }
  },
  {
    id: 'vend-3',
    userId: 'usr-5',
    companyName: 'Apex Apparel',
    website: 'https://apexwear.com',
    isApproved: true,
    user: { email: 'contact@apexwear.com', isVerified: true }
  }
];

let influencers: Influencer[] = [
  {
    id: 'inf-1',
    userId: 'usr-3',
    displayName: 'Audrey Fitness',
    niche: ['Fitness', 'Lifestyle', 'Health'],
    followers: 125000,
    engagementRate: 4.8,
    isApproved: true,
    instagramUrl: 'https://instagram.com/audreyfit',
    user: { email: 'influencer@influbridge.com', isVerified: true }
  },
  {
    id: 'inf-2',
    userId: 'usr-6',
    displayName: 'Tech Marques',
    niche: ['Gadgets', 'Software', 'Reviews'],
    followers: 840000,
    engagementRate: 6.2,
    isApproved: false,
    instagramUrl: 'https://instagram.com/marquestech',
    user: { email: 'marques@tech.com', isVerified: false }
  },
  {
    id: 'inf-3',
    userId: 'usr-7',
    displayName: 'Travel Jade',
    niche: ['Vlog', 'Photography', 'Outdoors'],
    followers: 43000,
    engagementRate: 8.5,
    isApproved: true,
    instagramUrl: 'https://instagram.com/traveljade',
    user: { email: 'jade@travels.com', isVerified: true }
  }
];

let products: Product[] = [
  {
    id: 'prod-1',
    name: 'Apex Trail Running Shoes',
    description: 'All-terrain lightweight performance footwear designed for rugged trails and mountain running.',
    price: 159.99,
    commissionPct: 15,
    imageUrls: JSON.stringify(['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80']),
    status: 'APPROVED',
    vendorId: 'vend-1',
    vendor: { companyName: 'GearUp Labs' }
  },
  {
    id: 'prod-2',
    name: 'HydraSmart Steel Bottle',
    description: 'Vacuum-insulated smart water bottle tracking your hydration goals via built-in LED reminder.',
    price: 49.99,
    commissionPct: 20,
    imageUrls: JSON.stringify(['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80']),
    status: 'APPROVED',
    vendorId: 'vend-1',
    vendor: { companyName: 'GearUp Labs' }
  },
  {
    id: 'prod-3',
    name: 'Elysium Glow Cream',
    description: 'Hydrating serum enriched with active botanicals to stimulate natural glow and collagen release.',
    price: 79.50,
    commissionPct: 25,
    imageUrls: JSON.stringify(['https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&w=600&q=80']),
    status: 'PENDING',
    vendorId: 'vend-2',
    vendor: { companyName: 'Aura Cosmetics' }
  },
  {
    id: 'prod-4',
    name: 'Carbon Grip Gym Straps',
    description: 'Heavy duty wrist straps with non-slip carbon weave texture for high capacity powerlifting safety.',
    price: 24.99,
    commissionPct: 12,
    imageUrls: JSON.stringify(['https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80']),
    status: 'APPROVED',
    vendorId: 'vend-3',
    vendor: { companyName: 'Apex Apparel' }
  }
];

let campaigns: Campaign[] = [
  {
    id: 'camp-1',
    productId: 'prod-1',
    influencerId: 'inf-1',
    status: 'ACTIVE',
    referralCode: 'IB-RUN-AUD-3829',
    referralLink: 'http://localhost:5000/api/track/click/IB-RUN-AUD-3829',
    couponCode: 'AUDREYFITNESS15',
    clicks: 142,
    conversions: 8,
    totalRevenue: 1279.92,
    commission: 191.99,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    product: {
      name: 'Apex Trail Running Shoes',
      price: 159.99,
      commissionPct: 15,
      vendor: { companyName: 'GearUp Labs' }
    },
    influencer: {
      displayName: 'Audrey Fitness',
      niche: ['Fitness', 'Lifestyle'],
      followers: 125000,
      engagementRate: 4.8
    }
  },
  {
    id: 'camp-2',
    productId: 'prod-2',
    influencerId: 'inf-1',
    status: 'PENDING',
    referralCode: 'IB-HYD-AUD-8921',
    referralLink: 'http://localhost:5000/api/track/click/IB-HYD-AUD-8921',
    couponCode: null,
    clicks: 0,
    conversions: 0,
    totalRevenue: 0.00,
    commission: 0.00,
    createdAt: new Date().toISOString(),
    product: {
      name: 'HydraSmart Steel Bottle',
      price: 49.99,
      commissionPct: 20,
      vendor: { companyName: 'GearUp Labs' }
    },
    influencer: {
      displayName: 'Audrey Fitness',
      niche: ['Fitness', 'Lifestyle'],
      followers: 125000,
      engagementRate: 4.8
    }
  }
];

let orders: Order[] = [
  {
    id: 'ord-1',
    campaignId: 'camp-1',
    amount: 159.99,
    commission: 24.00,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    campaign: {
      product: { name: 'Apex Trail Running Shoes' },
      influencer: { displayName: 'Audrey Fitness' }
    }
  },
  {
    id: 'ord-2',
    campaignId: 'camp-1',
    amount: 319.98,
    commission: 48.00,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    campaign: {
      product: { name: 'Apex Trail Running Shoes' },
      influencer: { displayName: 'Audrey Fitness' }
    }
  }
];

// Mock API Controller Class
export const MockAPI = {
  // Authentication Mock
  getCurrentUser: () => currentUser,
  setCurrentUser: (user: User | null) => {
    currentUser = user;
    return currentUser;
  },
  login: (email: string, role: 'VENDOR' | 'INFLUENCER' | 'ADMIN') => {
    currentUser = {
      id: `usr-${Math.random().toString(36).substr(2, 9)}`,
      email,
      role,
      isVerified: true
    };
    return currentUser;
  },
  register: (email: string, role: 'VENDOR' | 'INFLUENCER' | 'ADMIN', extraData?: any) => {
    currentUser = {
      id: `usr-${Math.random().toString(36).substr(2, 9)}`,
      email,
      role,
      isVerified: false // Needs verification in admin command center
    };
    
    if (role === 'VENDOR') {
      vendors.push({
        id: `vend-${Math.random().toString(36).substr(2, 9)}`,
        userId: currentUser.id,
        companyName: extraData?.companyName || 'New Venture Inc',
        website: extraData?.website || '',
        isApproved: false,
        user: { email, isVerified: false }
      });
    } else if (role === 'INFLUENCER') {
      influencers.push({
        id: `inf-${Math.random().toString(36).substr(2, 9)}`,
        userId: currentUser.id,
        displayName: extraData?.displayName || 'Creative Creator',
        niche: extraData?.niche || ['Lifestyle'],
        followers: extraData?.followers || 15000,
        engagementRate: 3.5,
        isApproved: false,
        user: { email, isVerified: false }
      });
    }
    return currentUser;
  },
  logout: () => {
    currentUser = null;
  },

  // Vendors Controller
  getVendors: () => vendors,
  verifyVendor: (id: string, isApproved: boolean) => {
    vendors = vendors.map(v => {
      if (v.id === id) {
        v.isApproved = isApproved;
        v.user.isVerified = isApproved;
      }
      return v;
    });
    return vendors.find(v => v.id === id);
  },

  // Products Controller
  getProducts: () => products,
  createProduct: (name: string, description: string, price: number, commissionPct: number, imageUrls: string) => {
    const currentVendor = vendors.find(v => v.userId === currentUser?.id) || vendors[0];
    const newProd: Product = {
      id: `prod-${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      price,
      commissionPct,
      imageUrls,
      status: 'PENDING',
      vendorId: currentVendor.id,
      vendor: { companyName: currentVendor.companyName }
    };
    products.push(newProd);
    return newProd;
  },
  deleteProduct: (id: string) => {
    products = products.filter(p => p.id !== id);
    campaigns = campaigns.filter(c => c.productId !== id);
  },
  approveProduct: (id: string, status: 'APPROVED' | 'REJECTED') => {
    products = products.map(p => {
      if (p.id === id) p.status = status;
      return p;
    });
    return products.find(p => p.id === id);
  },

  // Influencers Controller
  getInfluencers: () => influencers,
  verifyInfluencer: (id: string, isApproved: boolean) => {
    influencers = influencers.map(i => {
      if (i.id === id) {
        i.isApproved = isApproved;
        i.user.isVerified = isApproved;
      }
      return i;
    });
    return influencers.find(i => i.id === id);
  },

  // Campaigns & Promotions Flow Controller
  getCampaigns: () => campaigns,
  getVendorCampaigns: () => {
    const currentVendor = vendors.find(v => v.userId === currentUser?.id) || vendors[0];
    return campaigns.filter(c => {
      const p = products.find(prod => prod.id === c.productId);
      return p?.vendorId === currentVendor.id;
    });
  },
  getInfluencerCampaigns: () => {
    const currentInfluencer = influencers.find(inf => inf.userId === currentUser?.id) || influencers[0];
    return campaigns.filter(c => c.influencerId === currentInfluencer.id);
  },
  requestPromotion: (productId: string) => {
    const currentInfluencer = influencers.find(inf => inf.userId === currentUser?.id) || influencers[0];
    const product = products.find(p => p.id === productId);
    if (!product) throw new Error('Product not found');

    const exists = campaigns.find(c => c.productId === productId && c.influencerId === currentInfluencer.id);
    if (exists) return exists;

    const newCamp: Campaign = {
      id: `camp-${Math.random().toString(36).substr(2, 9)}`,
      productId,
      influencerId: currentInfluencer.id,
      status: 'PENDING',
      referralCode: `IB-${product.name.slice(0, 3).toUpperCase()}-${currentInfluencer.displayName.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      referralLink: `http://localhost:5000/api/track/click/IB-MOCK`,
      couponCode: null,
      clicks: 0,
      conversions: 0,
      totalRevenue: 0,
      commission: 0,
      createdAt: new Date().toISOString(),
      product: {
        name: product.name,
        price: product.price,
        commissionPct: product.commissionPct,
        vendor: { companyName: product.vendor.companyName }
      },
      influencer: {
        displayName: currentInfluencer.displayName,
        niche: currentInfluencer.niche,
        followers: currentInfluencer.followers,
        engagementRate: currentInfluencer.engagementRate
      }
    };
    newCamp.referralLink = `http://localhost:5000/api/track/click/${newCamp.referralCode}`;
    campaigns.push(newCamp);
    return newCamp;
  },
  approveCampaign: (campaignId: string, status: 'APPROVED' | 'REJECTED') => {
    campaigns = campaigns.map(c => {
      if (c.id === campaignId) {
        c.status = status === 'APPROVED' ? 'ACTIVE' : 'REJECTED';
        c.couponCode = status === 'APPROVED' ? `${c.influencer.displayName.replace(/\s+/g, '').toUpperCase()}10` : null;
      }
      return c;
    });
    return campaigns.find(c => c.id === campaignId);
  },

  // Checkout Conversion Tracking Simulator
  simulateCheckout: (referralCode: string, amount: number) => {
    const campaign = campaigns.find(c => c.referralCode === referralCode);
    if (!campaign) throw new Error('Invalid referral tracker code');

    const commissionAmount = parseFloat((amount * (campaign.product.commissionPct / 100)).toFixed(2));
    
    // Mutate Campaign values
    campaign.clicks += Math.floor(Math.random() * 4) + 1; // Organic clicks simulation
    campaign.conversions += 1;
    campaign.totalRevenue = parseFloat((campaign.totalRevenue + amount).toFixed(2));
    campaign.commission = parseFloat((campaign.commission + commissionAmount).toFixed(2));

    // Create custom Order logs
    const newOrder: Order = {
      id: `ord-${Math.random().toString(36).substr(2, 9)}`,
      campaignId: campaign.id,
      amount,
      commission: commissionAmount,
      createdAt: new Date().toISOString(),
      campaign: {
        product: { name: campaign.product.name },
        influencer: { displayName: campaign.influencer.displayName }
      }
    };
    orders.unshift(newOrder);
    return newOrder;
  },

  // Orders Ledger
  getOrders: () => orders,
  getVendorOrders: () => {
    const currentVendor = vendors.find(v => v.userId === currentUser?.id) || vendors[0];
    return orders.filter(o => {
      const camp = campaigns.find(c => c.id === o.campaignId);
      const prod = products.find(p => p.id === camp?.productId);
      return prod?.vendorId === currentVendor.id;
    });
  },
  getInfluencerOrders: () => {
    const currentInfluencer = influencers.find(i => i.userId === currentUser?.id) || influencers[0];
    return orders.filter(o => {
      const camp = campaigns.find(c => c.id === o.campaignId);
      return camp?.influencerId === currentInfluencer.id;
    });
  },

  // Analytics Aggregation Engine
  getPlatformAnalytics: () => {
    const activeCamps = campaigns.filter(c => c.status === 'ACTIVE');
    const totalClicks = campaigns.reduce((sum, c) => sum + c.clicks, 0);
    const totalConv = campaigns.reduce((sum, c) => sum + c.conversions, 0);
    const gmv = orders.reduce((sum, o) => sum + o.amount, 0);
    const payouts = orders.reduce((sum, o) => sum + o.commission, 0);

    return {
      usersCount: vendors.length + influencers.length + 1,
      vendorsCount: vendors.length,
      influencersCount: influencers.length,
      productsCount: products.length,
      activeCampaignsCount: activeCamps.length,
      totalClicks,
      totalConversions: totalConv,
      totalRevenue: gmv,
      totalCommission: payouts
    };
  },
  getVendorAnalytics: () => {
    const currentVendor = vendors.find(v => v.userId === currentUser?.id) || vendors[0];
    const vendorProds = products.filter(p => p.vendorId === currentVendor.id);
    const vendorCamps = campaigns.filter(c => vendorProds.some(p => p.id === c.productId));
    const activeCount = vendorCamps.filter(c => c.status === 'ACTIVE').length;
    
    const vOrders = MockAPI.getVendorOrders();
    const clicks = vendorCamps.reduce((sum, c) => sum + c.clicks, 0);
    const conversions = vendorCamps.reduce((sum, c) => sum + c.conversions, 0);
    const totalRevenue = vOrders.reduce((sum, o) => sum + o.amount, 0);
    const commissionPaid = vOrders.reduce((sum, o) => sum + o.commission, 0);

    return {
      clicks,
      conversions,
      totalRevenue,
      commissionPaid,
      activeCampaignsCount: activeCount,
      orders: vOrders
    };
  },
  getInfluencerAnalytics: () => {
    const currentInfluencer = influencers.find(inf => inf.userId === currentUser?.id) || influencers[0];
    const infCamps = campaigns.filter(c => c.influencerId === currentInfluencer.id);
    
    const iOrders = MockAPI.getInfluencerOrders();
    const clicks = infCamps.reduce((sum, c) => sum + c.clicks, 0);
    const conversions = infCamps.reduce((sum, c) => sum + c.conversions, 0);
    const earnings = iOrders.reduce((sum, o) => sum + o.commission, 0);

    return {
      clicks,
      conversions,
      earnings,
      orders: iOrders
    };
  }
};
