import { ThemeConfig } from 'antd';

export const theme: ThemeConfig = {
  token: {
    colorPrimary: '#a10046', // color-amaranth-pink-200
    colorSuccess: '#610035', // color-pale-purple-100
    colorWarning: '#c6002e', // color-lavender-blush-200
    colorError: '#a10046',   // color-amaranth-pink-200
    colorInfo: '#242324',    // color-davys-gray-200
    
    borderRadius: 8, // --border-radius-md
    
    // Espaciado
    marginXS: 8,    // --spacing-xs
    marginSM: 12,   // --spacing-sm
    margin: 16,     // --spacing-md
    marginMD: 24,   // --spacing-lg
    marginLG: 32,   // --spacing-xl
    marginXL: 48,   // --spacing-2xl
    
    // Sombras
    boxShadow: '0 4px 6px rgba(89, 87, 88, 0.1)',
    boxShadowSecondary: '0 10px 15px rgba(89, 87, 88, 0.1)',
    
    // Fuentes
    fontFamily: 'var(--font-grotesk), Arial, sans-serif',
  },
  components: {
    Button: {
      borderRadius: 8,
      controlHeight: 40,
      paddingContentHorizontal: 16,
    },
    Input: {
      controlHeight: 40,
      borderRadius: 8,
    },
    Card: {
      borderRadius: 16,
      boxShadow: '0 10px 15px rgba(89, 87, 88, 0.1)',
    },
    Alert: {
      borderRadius: 8,
      withDescription: true,
    }
  }
}; 