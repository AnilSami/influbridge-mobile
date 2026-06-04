export const Colors = {
  background: '#020617',     // Ultra-dark premium background
  cardBg: 'rgba(15, 23, 42, 0.65)', // Sleek semi-transparent card background
  cardSolid: '#0f172a',      // Fallback solid card background
  border: 'rgba(255, 255, 255, 0.08)', // Soft translucent borders
  borderActive: 'rgba(99, 102, 241, 0.3)', // Indigo active borders
  text: '#f8fafc',           // High contrast white/off-white text
  textMuted: '#64748b',      // Muted cool grey description text
  textLight: '#94a3b8',      // Slightly lighter grey for secondary readability
  primary: '#6366f1',        // Vibrant Indigo primary accent
  primaryAccent: '#3b82f6',  // Premium Electric Blue
  success: '#10b981',        // Emerald success status
  warning: '#f59e0b',        // Amber warnings
  error: '#ef4444',          // Crimson errors
  glassOverlay: 'rgba(2, 6, 23, 0.8)',
};

export const Gradients = {
  primary: ['#6366f1', '#3b82f6'] as const,   // Indigo to Blue gradient
  success: ['#10b981', '#059669'] as const,   // Emerald success gradient
  card: ['rgba(30, 41, 59, 0.4)', 'rgba(15, 23, 42, 0.7)'] as const, // Multi-tone glass card
  darkGlow: ['#090d1f', '#020617'] as const, // Subtle top ambient background glow
  danger: ['#ef4444', '#dc2626'] as const,    // Error alert gradient
  gold: ['#fbbf24', '#d97706'] as const       // Premium high-tier user/admin stats
};

export const Shadows = {
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  glowPrimary: {
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  glowSuccess: {
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  }
};

export const Typography = {
  h1: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: Colors.text,
  },
  h2: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  h3: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  body: {
    fontSize: 13,
    fontWeight: '400' as const,
    color: Colors.textLight,
    lineHeight: 18,
  },
  caption: {
    fontSize: 10,
    fontWeight: '500' as const,
    color: Colors.textMuted,
  },
  btnText: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: '#ffffff',
  }
};
