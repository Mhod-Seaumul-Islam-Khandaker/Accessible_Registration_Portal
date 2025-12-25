export type ThemeMode = 'dark' | 'light';

export interface AccessibilitySettings {
  font_size: number;
  theme: ThemeMode;
  screen_reader: boolean;
  magnification: number;
  color_inversion: boolean;
}

export interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (
    newSettings: Partial<AccessibilitySettings>
  ) => Promise<void>;
  loading: boolean;
  fontSizeMultiplier: number;
}

export const defaultAccessibilitySettings: AccessibilitySettings = {
  font_size: 16,
  theme: 'light',
  screen_reader: false,
  magnification: 100,
  color_inversion: false,
};
