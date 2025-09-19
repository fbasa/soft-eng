import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import type { Preset } from '@primeuix/themes/types';

const appPrimaryPalette = {
  50: '#edf4ff',
  100: '#dbe6ff',
  200: '#bed1ff',
  300: '#92b1ff',
  400: '#648cf7',
  500: '#1a56db',
  600: '#1547bc',
  700: '#123ca1',
  800: '#102f80',
  900: '#0b225b',
  950: '#071a42'
} as const;

const appSurfacePalette = {
  0: '#ffffff',
  50: '#f9fafc',
  100: '#f1f5fb',
  200: '#e8eef9',
  300: '#dbe3f0',
  400: '#cfd8e7',
  500: '#c3ccdd',
  600: '#b7c0d3',
  700: '#aab4c8',
  800: '#9ea8be',
  900: '#929cb3',
  950: '#8690a8'
} as const;

const accentColor = appPrimaryPalette[500];
const accentHoverColor = appPrimaryPalette[600];
const accentActiveColor = appPrimaryPalette[700];

const surfaceBase = appSurfacePalette[0];
const surfaceRaised = appSurfacePalette[50];
const surfaceSubtle = appSurfacePalette[100];
const surfaceMuted = appSurfacePalette[200];

const baseTextColor = '#1f2937';
const mutedTextColor = '#6b7280';
const borderColor = 'rgba(15, 23, 42, 0.12)';
const borderStrongColor = 'rgba(15, 23, 42, 0.18)';
const maskBackground = 'rgba(15, 23, 42, 0.45)';
const maskForeground = 'rgba(255, 255, 255, 0.65)';

const sharedColorScheme = {
  surface: appSurfacePalette,
  primary: {
    color: accentColor,
    contrastColor: '#ffffff',
    hoverColor: accentHoverColor,
    activeColor: accentActiveColor
  },
  highlight: {
    background: 'rgba(26, 86, 219, 0.12)',
    focusBackground: 'rgba(26, 86, 219, 0.18)',
    color: accentColor,
    focusColor: accentActiveColor
  },
  mask: {
    background: maskBackground,
    color: maskForeground
  },
  formField: {
    background: surfaceBase,
    disabledBackground: surfaceMuted,
    filledBackground: surfaceSubtle,
    filledHoverBackground: surfaceRaised,
    filledFocusBackground: surfaceBase,
    borderColor,
    hoverBorderColor: 'rgba(26, 86, 219, 0.35)',
    focusBorderColor: accentColor,
    invalidBorderColor: '#f87171',
    color: baseTextColor,
    disabledColor: '#9ca3af',
    placeholderColor: mutedTextColor,
    invalidPlaceholderColor: '#b91c1c',
    floatLabelColor: mutedTextColor,
    floatLabelFocusColor: accentColor,
    floatLabelActiveColor: accentColor,
    floatLabelInvalidColor: '#b91c1c',
    iconColor: mutedTextColor,
    shadow: '0 0 0 2px rgba(26, 86, 219, 0.12)'
  },
  text: {
    color: baseTextColor,
    hoverColor: '#111827',
    mutedColor: mutedTextColor,
    hoverMutedColor: '#4b5563'
  },
  content: {
    background: surfaceBase,
    hoverBackground: surfaceSubtle,
    borderColor,
    color: baseTextColor,
    hoverColor: accentColor
  },
  overlay: {
    select: {
      background: surfaceBase,
      borderColor,
      color: baseTextColor
    },
    popover: {
      background: surfaceBase,
      borderColor: borderStrongColor,
      color: baseTextColor
    },
    modal: {
      background: surfaceBase,
      borderColor: borderStrongColor,
      color: baseTextColor
    }
  },
  list: {
    option: {
      focusBackground: surfaceRaised,
      selectedBackground: 'rgba(26, 86, 219, 0.12)',
      selectedFocusBackground: 'rgba(26, 86, 219, 0.18)',
      color: baseTextColor,
      focusColor: baseTextColor,
      selectedColor: accentColor,
      selectedFocusColor: accentActiveColor,
      icon: {
        color: mutedTextColor,
        focusColor: accentColor
      }
    },
    optionGroup: {
      background: surfaceBase,
      color: mutedTextColor
    }
  },
  navigation: {
    item: {
      focusBackground: surfaceRaised,
      activeBackground: 'rgba(26, 86, 219, 0.12)',
      color: baseTextColor,
      focusColor: accentColor,
      activeColor: accentColor,
      icon: {
        color: mutedTextColor,
        focusColor: accentColor,
        activeColor: accentActiveColor
      }
    },
    submenuLabel: {
      background: surfaceBase,
      color: mutedTextColor
    },
    submenuIcon: {
      color: mutedTextColor,
      focusColor: accentColor,
      activeColor: accentActiveColor
    }
  }
} as const;

export const appPrimePreset: Preset = definePreset(Aura, {
  semantic: {
    primary: appPrimaryPalette,
    surface: appSurfacePalette,
    focusRing: {
      width: '0',
      style: 'solid',
      color: 'transparent',
      offset: '0',
      shadow: '0 0 0 3px rgba(26, 86, 219, 0.14)'
    },
    colorScheme: {
      light: sharedColorScheme,
      dark: sharedColorScheme
    }
  }
});