export interface ThemePresetDefinition {
  id: string;
  name: string;
  description: string;
  colors: {
    background: string;
    surface: string;
    surfaceSoft: string;
    primary: string;
    secondary: string;
    accent: string;
    accentSoft: string;
    text: string;
    muted: string;
    border: string;
    success: string;
    warning: string;
    danger: string;
  };
  gradients: {
    hero: string;
    accent: string;
  };
  radius: {
    sm: string;
    md: string;
    button: string;
  };
  shadows: {
    intensity: 'none' | 'subtle' | 'medium' | 'elevated';
  };
}

export const THEME_PRESETS: ThemePresetDefinition[] = [
  {
    id: 'pearl-commerce',
    name: 'Pearl Commerce',
    description: 'Bright, Premium, Modern, Clean',
    colors: {
      background: '#F7F8FA',
      surface: '#FFFFFF',
      surfaceSoft: '#F1F3F5',
      primary: '#17191C',
      secondary: '#34383D',
      accent: '#2F6FED',
      accentSoft: '#EAF1FF',
      text: '#16181B',
      muted: '#69717C',
      border: '#E4E7EB',
      success: '#1F8A5B',
      warning: '#B7791F',
      danger: '#C53D3D',
    },
    gradients: {
      hero: 'linear-gradient(135deg, #F8FAFC 0%, #EEF3FA 52%, #E7EEF8 100%)',
      accent: 'linear-gradient(135deg, #2F6FED 0%, #5A8AF5 100%)',
    },
    radius: { sm: '4px', md: '8px', button: '6px' },
    shadows: { intensity: 'subtle' },
  },
  {
    id: 'arctic-silver',
    name: 'Arctic Silver',
    description: 'Technology, Precision, Minimalism',
    colors: {
      background: '#F4F6F8',
      surface: '#FFFFFF',
      surfaceSoft: '#ECEFF3',
      primary: '#111827',
      secondary: '#374151',
      accent: '#3B82F6',
      accentSoft: '#E8F1FF',
      text: '#111827',
      muted: '#6B7280',
      border: '#DDE2E8',
      success: '#168A63',
      warning: '#B7791F',
      danger: '#C24141',
    },
    gradients: {
      hero: 'linear-gradient(135deg, #FFFFFF 0%, #F1F4F8 48%, #E7ECF3 100%)',
      accent: 'linear-gradient(135deg, #2563EB 0%, #60A5FA 100%)',
    },
    radius: { sm: '2px', md: '4px', button: '4px' },
    shadows: { intensity: 'subtle' },
  },
  {
    id: 'warm-stone',
    name: 'Warm Stone',
    description: 'Warm, Reliable, Home-focused',
    colors: {
      background: '#F6F3EE',
      surface: '#FFFDFC',
      surfaceSoft: '#EFEAE2',
      primary: '#2A2723',
      secondary: '#514A43',
      accent: '#A56A3A',
      accentSoft: '#F4E7DB',
      text: '#2B2926',
      muted: '#746E67',
      border: '#E4DDD3',
      success: '#3E7B5A',
      warning: '#A66B22',
      danger: '#B94A48',
    },
    gradients: {
      hero: 'linear-gradient(135deg, #FCFAF7 0%, #F3EEE7 55%, #EAE1D6 100%)',
      accent: 'linear-gradient(135deg, #9B6035 0%, #C18456 100%)',
    },
    radius: { sm: '8px', md: '16px', button: '12px' },
    shadows: { intensity: 'subtle' },
  },
  {
    id: 'graphite-mist',
    name: 'Graphite Mist',
    description: 'Modern, Strong, Premium',
    colors: {
      background: '#F2F3F5',
      surface: '#FFFFFF',
      surfaceSoft: '#E8EAED',
      primary: '#1A1D21',
      secondary: '#3E434A',
      accent: '#6B7280',
      accentSoft: '#ECEEF1',
      text: '#17191C',
      muted: '#6B7280',
      border: '#DCDFE4',
      success: '#1F8A5B',
      warning: '#B7791F',
      danger: '#C53D3D',
    },
    gradients: {
      hero: 'linear-gradient(135deg, #FAFBFC 0%, #EFF1F4 50%, #E5E8EC 100%)',
      accent: 'linear-gradient(135deg, #1A1D21 0%, #3E434A 100%)',
    },
    radius: { sm: '0px', md: '0px', button: '0px' },
    shadows: { intensity: 'none' },
  },
  {
    id: 'royal-navy',
    name: 'Royal Navy',
    description: 'Trust, Technology, Professional',
    colors: {
      background: '#F4F7FB',
      surface: '#FFFFFF',
      surfaceSoft: '#EAF0F7',
      primary: '#0F2342',
      secondary: '#29415F',
      accent: '#2868C7',
      accentSoft: '#E8F1FF',
      text: '#122033',
      muted: '#68788C',
      border: '#DCE4EF',
      success: '#25805D',
      warning: '#B67A20',
      danger: '#C34747',
    },
    gradients: {
      hero: 'linear-gradient(135deg, #FFFFFF 0%, #F0F5FB 55%, #E4ECF6 100%)',
      accent: 'linear-gradient(135deg, #205CB0 0%, #4387E2 100%)',
    },
    radius: { sm: '6px', md: '12px', button: '8px' },
    shadows: { intensity: 'medium' },
  },
  {
    id: 'sage-modern',
    name: 'Sage Modern',
    description: 'Fresh, Home, Lifestyle',
    colors: {
      background: '#F3F6F2',
      surface: '#FFFFFF',
      surfaceSoft: '#E8EFE6',
      primary: '#1D2920',
      secondary: '#415047',
      accent: '#648B6D',
      accentSoft: '#E7F0E8',
      text: '#1D2920',
      muted: '#6E786F',
      border: '#DCE4DC',
      success: '#1F8A5B',
      warning: '#B7791F',
      danger: '#C53D3D',
    },
    gradients: {
      hero: 'linear-gradient(135deg, #FBFCFA 0%, #F0F5EF 52%, #E5EEE5 100%)',
      accent: 'linear-gradient(135deg, #557A5E 0%, #7FA18A 100%)',
    },
    radius: { sm: '12px', md: '24px', button: '100px' },
    shadows: { intensity: 'subtle' },
  },
  {
    id: 'champagne-editorial',
    name: 'Champagne Editorial',
    description: 'Premium, Elegant, Editorial',
    colors: {
      background: '#F8F5EE',
      surface: '#FFFDF8',
      surfaceSoft: '#F1ECE1',
      primary: '#26231F',
      secondary: '#514A40',
      accent: '#B48A4A',
      accentSoft: '#F5EEDD',
      text: '#292620',
      muted: '#746F66',
      border: '#E6DED0',
      success: '#3E7B5A',
      warning: '#A66B22',
      danger: '#B94A48',
    },
    gradients: {
      hero: 'linear-gradient(135deg, #FCFAF5 0%, #F5EFE3 55%, #EEE4D2 100%)',
      accent: 'linear-gradient(135deg, #A97D3D 0%, #D0A968 100%)',
    },
    radius: { sm: '0px', md: '0px', button: '0px' },
    shadows: { intensity: 'none' },
  },
  {
    id: 'midnight-commerce',
    name: 'Midnight Commerce',
    description: 'Premium, Technology, High contrast',
    colors: {
      background: '#111315',
      surface: '#181B1F',
      surfaceSoft: '#20242A',
      primary: '#F4F5F7',
      secondary: '#C5CAD1',
      accent: '#6EA8FF',
      accentSoft: '#1F304D',
      text: '#F4F5F7',
      muted: '#9EA5AF',
      border: '#2B3037',
      success: '#1F8A5B',
      warning: '#B7791F',
      danger: '#C53D3D',
    },
    gradients: {
      hero: 'linear-gradient(135deg, #111315 0%, #171B21 55%, #202630 100%)',
      accent: 'linear-gradient(135deg, #4C8DFF 0%, #75A8FF 100%)',
    },
    radius: { sm: '8px', md: '12px', button: '6px' },
    shadows: { intensity: 'elevated' },
  }
];

export const ALLOWED_FONTS = [
  { id: 'Inter', name: 'Inter', desc: 'The modern choice for digital commerce.' },
  { id: 'Manrope', name: 'Manrope', desc: 'Clean and sophisticated.' },
  { id: 'Plus Jakarta Sans', name: 'Plus Jakarta Sans', desc: 'Contemporary and polished.' },
  { id: 'DM Sans', name: 'DM Sans', desc: 'Geometric and legible.' },
  { id: 'Outfit', name: 'Outfit', desc: 'Beautifully geometric and modern.' },
  { id: 'Montserrat', name: 'Montserrat', desc: 'Classic structural retail font.' },
  { id: 'Poppins', name: 'Poppins', desc: 'Friendly and rounded.' },
  { id: 'Playfair Display', name: 'Playfair Display', desc: 'Elegant editorial serif.' },
  { id: 'Cormorant Garamond', name: 'Cormorant Garamond', desc: 'Classic premium serif.' }
];

export function getThemePreset(id: string): ThemePresetDefinition {
  return THEME_PRESETS.find(t => t.id === id) || THEME_PRESETS[0];
}
