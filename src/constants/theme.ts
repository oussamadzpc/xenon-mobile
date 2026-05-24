// ================= CONSTANTS & THEME =================
// تحويل دقيق من index.css إلى React Native Styles

export const COLORS = {
  // Primary
  primary: '#00e5ff',
  primaryDark: '#0066ff',
  secondary: '#ff0077',

  // Backgrounds
  background: '#05060a',
  surface: 'rgba(255,255,255,0.05)',
  surfaceLight: 'rgba(255,255,255,0.08)',
  surfaceHover: 'rgba(255,255,255,0.09)',

  // Cards
  cardLive: 'rgba(0,229,255,0.12)',
  cardSport: 'rgba(255,180,0,0.12)',
  cardCountry: 'rgba(0,150,255,0.12)',
  cardBein: 'rgba(0,200,100,0.15)',

  // Status
  online: '#00ff88',
  offline: '#ff4444',
  warning: '#ffaa00',
  error: '#ff4444',

  // Text
  text: '#ffffff',
  textSecondary: 'rgba(255,255,255,0.6)',
  textMuted: 'rgba(255,255,255,0.4)',

  // Borders
  border: 'rgba(255,255,255,0.08)',
  borderActive: 'rgba(0,229,255,0.35)',

  // Gradients (نستخدمها كألوان ثابتة في RN)
  gradientCyan: ['#00f5a0', '#00d9f5'],
  gradientPink: ['#ff0055', '#ff9900'],
  gradientPurple: ['#7a5cff', '#00e5ff'],
  gradientBlue: ['#00e5ff', '#0066ff'],
  gradientRed: ['#ff0055', '#ff6600'],
};

export const FONTS = {
  tiny: 10,
  small: 12,
  medium: 14,
  large: 16,
  title: 18,
  header: 20,
  hero: 24,
  logo: 28,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  round: 999,
};

// Shadow effects (محاكاة box-shadow في RN)
export const SHADOWS = {
  small: {
    shadowColor: '#00e5ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  medium: {
    shadowColor: '#00e5ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  large: {
    shadowColor: '#00e5ff',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 32,
    elevation: 12,
  },
  glow: {
    shadowColor: '#00e5ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
};

// أنماط مشتركة
export const commonStyles = {
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
  },
  activeCard: {
    backgroundColor: 'rgba(0,229,255,0.22)',
    borderColor: COLORS.borderActive,
    ...SHADOWS.glow,
  },
  text: {
    color: COLORS.text,
    fontSize: FONTS.medium,
  },
  textSecondary: {
    color: COLORS.textSecondary,
    fontSize: FONTS.small,
  },
  gradientText: {
    color: COLORS.primary,
    fontWeight: '900',
    letterSpacing: 2,
  },
};
