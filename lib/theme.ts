// Blyss Design System
// Aesthetic: clean light mobile-first, Figma Make style — white/light gray surfaces,
// sky blue (#5ba8d3) as primary accent, warm gold for ratings/highlights

export const Colors = {
  // Core backgrounds — light theme matching Figma Make
  bg: '#F7F8FA',
  bgCard: '#FFFFFF',
  bgElevated: '#FFFFFF',
  bgInput: '#F0F1F3',

  // Borders
  border: '#E3E4E6',
  borderFaint: '#EEEFF1',

  // Text
  textPrimary: '#1A1A2E',
  textSecondary: '#8B8F94',
  textTertiary: '#B0B4BA',
  textInverse: '#FFFFFF',

  // Primary — Figma Make sky blue
  accent: '#5BA8D3',
  accentDim: '#4A96C2',
  accentSoft: '#EBF5FB',
  accentMid: '#B7D3E0',

  // Secondary tones from Figma Make
  navyText: '#375169',       // dark headings/labels
  tagBg: '#B7D3E0',          // tag pill background
  tagText: '#375169',        // tag pill text
  gold: '#F2C05A',           // ratings star

  // Category colors
  coffee: '#C47D3B',
  food: '#D45F3C',
  bars: '#7B5EA7',
  activities: '#3C8A6E',
  outdoor: '#4A7C59',

  // Semantic
  success: '#3C8A6E',
  error: '#D45F3C',
  info: '#5BA8D3',
};

export const Typography = {
  // Display — for big headings
  display: {
    fontFamily: 'System',
    fontWeight: '700' as const,
    letterSpacing: -1.5,
  },
  // Heading
  heading: {
    fontFamily: 'System',
    fontWeight: '600' as const,
    letterSpacing: -0.5,
  },
  // Body
  body: {
    fontFamily: 'System',
    fontWeight: '400' as const,
    letterSpacing: 0.1,
  },
  // Label/caption
  label: {
    fontFamily: 'System',
    fontWeight: '500' as const,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
    fontSize: 11,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
};

export const CATEGORY_COLORS: Record<string, string> = {
  coffee: Colors.coffee,
  restaurant: Colors.food,
  bar: Colors.bars,
  'bar+music': Colors.bars,
  activity: Colors.activities,
  'activity+bar': Colors.activities,
  outdoor: Colors.outdoor,
  'coffee+food': Colors.coffee,
};
