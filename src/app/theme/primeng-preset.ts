import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import type { Preset } from '@primeuix/themes/types';

// Preset tuned to match the application's existing blues and neutral surfaces.
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

export const appPrimePreset: Preset = definePreset(Aura, {
  semantic: {
    primary: appPrimaryPalette,
    surface: appSurfacePalette
  }
});
