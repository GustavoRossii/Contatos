// src/styles/theme.js
const lightTheme = {
    colors: {
      primary: '#4A90E2',
      secondary: '#50E3C2',
      background: '#F8F9FA',
      surface: '#FFFFFF',
      text: '#333333',
      lightText: '#777777',
      error: '#FF6B6B',
      success: '#4CAF50'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #4A90E2 0%, #50E3C2 100%)',
    },
  };
  
  const darkTheme = {
    colors: {
      primary: '#6AB0FF',
      secondary: '#64FFDA',
      background: '#121212',
      surface: '#1E1E1E',
      text: '#E0E0E0',
      lightText: '#B0B0B0',
      error: '#FF8A80',
      success: '#69F0AE'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #6AB0FF 0%, #64FFDA 100%)',
    },
  };
  
  const commonStyles = {
    shadows: {
      small: '0 2px 4px rgba(0, 0, 0, 0.1)',
      medium: '0 4px 8px rgba(0, 0, 0, 0.12)',
      large: '0 8px 16px rgba(0, 0, 0, 0.14)'
    },
    borderRadius: '12px',
    transitions: {
      default: '0.3s ease'
    }
  };
  
  export const lightMode = { ...lightTheme, ...commonStyles };
  export const darkMode = { ...darkTheme, ...commonStyles };