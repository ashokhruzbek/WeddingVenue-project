// Wedding-themed Design System
// Elegant color palette and design tokens for the entire application

export const weddingTheme = {
  // Primary Colors
  colors: {
    primary: {
      navy: '#1E3A5F',       // Deep navy blue - sophistication
      navyLight: '#2d4a6f',  // Lighter navy for hovers
      navyDark: '#152944',   // Darker navy for accents
    },
    accent: {
      gold: '#D4AF37',       // Elegant gold - luxury
      goldLight: '#e5c866', // Lighter gold for backgrounds
      goldDark: '#c49a2c',  // Darker gold for hovers
    },
    neutral: {
      white: '#FFFFFF',
      ivory: '#FFFFF0',      // Soft ivory
      cream: '#FFF8F0',      // Warm cream
      beige: '#F5F1E8',      // Light beige
      lightGray: '#F9FAFB',  // Very light gray
      gray: '#6B7280',       // Medium gray
      darkGray: '#374151',   // Dark gray
    },
    pastels: {
      blush: '#FFE4E8',      // Soft blush pink
      lavender: '#E8E4FF',   // Soft lavender
      mint: '#E4FFF0',       // Soft mint
      peach: '#FFE8D4',      // Soft peach
    },
    semantic: {
      success: '#10B981',    // Green for success
      warning: '#F59E0B',    // Amber for warnings
      error: '#EF4444',      // Red for errors
      info: '#3B82F6',       // Blue for info
    }
  },

  // Typography
  typography: {
    fontFamily: {
      heading: "'Playfair Display', serif", // Elegant serif for headings
      body: "'Inter', sans-serif",          // Clean sans-serif for body
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem',// 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
      '6xl': '3.75rem', // 60px
      '7xl': '4.5rem',  // 72px
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    }
  },

  // Spacing
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
    '4xl': '6rem',   // 96px
  },

  // Border Radius
  borderRadius: {
    sm: '0.375rem',  // 6px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    '2xl': '1.5rem', // 24px
    '3xl': '2rem',   // 32px
    full: '9999px',  // Full rounded
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    gold: '0 10px 30px rgba(212, 175, 55, 0.2)',
    goldLg: '0 20px 40px rgba(212, 175, 55, 0.3)',
    navy: '0 10px 30px rgba(30, 58, 95, 0.15)',
  },

  // Transitions
  transitions: {
    fast: '150ms ease-in-out',
    normal: '300ms ease-in-out',
    slow: '500ms ease-in-out',
  },

  // Breakpoints (for reference)
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Animation Easings
  easings: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  }
};

// Helper function to get color with opacity
export const withOpacity = (color, opacity) => {
  return `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
};

// Gradient presets
export const gradients = {
  navyToGold: `linear-gradient(135deg, ${weddingTheme.colors.primary.navy} 0%, ${weddingTheme.colors.accent.gold} 100%)`,
  goldShimmer: `linear-gradient(90deg, ${weddingTheme.colors.accent.gold} 0%, ${weddingTheme.colors.accent.goldLight} 50%, ${weddingTheme.colors.accent.gold} 100%)`,
  softBackground: `linear-gradient(180deg, ${weddingTheme.colors.neutral.white} 0%, ${weddingTheme.colors.neutral.beige} 100%)`,
  heroOverlay: `linear-gradient(to right, ${withOpacity(weddingTheme.colors.primary.navy, 0.9)}, ${withOpacity(weddingTheme.colors.primary.navy, 0.7)}, ${withOpacity(weddingTheme.colors.primary.navy, 0.5)})`,
};

export default weddingTheme;
