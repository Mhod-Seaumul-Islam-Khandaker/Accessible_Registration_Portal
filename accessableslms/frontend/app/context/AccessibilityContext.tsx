"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { Supabase } from '../lib/supabase-client';
import type {
  AccessibilitySettings,
  AccessibilityContextType,
} from '../types/accessibility';
import { defaultAccessibilitySettings } from '../types/accessibility';

const AccessibilityContext =
  createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [settings, setSettings] =
    useState<AccessibilitySettings>(defaultAccessibilitySettings);
  const [loading, setLoading] = useState(true);
  const supabase = Supabase;

  // Derived value (presentation concern)
  const fontSizeMultiplier = settings.font_size >= 18 ? 1.25 : 1;

  useEffect(() => {
    loadSettings();
  }, []);

  // Apply settings to the document
  useEffect(() => {
    if (typeof window === 'undefined') return;

    document.documentElement.classList.toggle(
      'dark',
      settings.theme === 'dark'
    );

    document.documentElement.style.filter =
      settings.color_inversion
        ? 'invert(1) hue-rotate(180deg)'
        : 'none';

    document.documentElement.style.zoom = `${settings.magnification}%`;

    document.documentElement.style.setProperty(
      '--base-font-size',
      `${settings.font_size}px`
    );
  }, [settings]);

  const loadSettings = async () => {
    try {
      const cookies = document.cookie.split(';');
      const userCookie = cookies.find(c =>
        c.trim().startsWith('user=')
      );

      if (!userCookie) {
        setLoading(false);
        return;
      }

      const userData = JSON.parse(
        decodeURIComponent(userCookie.split('=')[1])
      );

      const { data, error } = await supabase
        .from('accessibility_settings')
        .select('*')
        .eq('id', userData.id)
        .single();

      if (error?.code === 'PGRST116') {
        await createDefaultSettings(userData.id);
      } else if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error('Error loading accessibility settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const createDefaultSettings = async (userId: number) => {
    try {
      const { error } = await supabase
        .from('accessibility_settings')
        .insert([{ id: userId, ...defaultAccessibilitySettings }]);

      if (!error) {
        setSettings(defaultAccessibilitySettings);
      }
    } catch (error) {
      console.error('Error creating default settings:', error);
    }
  };

  const updateSettings = async (
    newSettings: Partial<AccessibilitySettings>
  ) => {
    try {
      const cookies = document.cookie.split(';');
      const userCookie = cookies.find(c =>
        c.trim().startsWith('user=')
      );

      if (!userCookie) return;

      const userData = JSON.parse(
        decodeURIComponent(userCookie.split('=')[1])
      );

      const updatedSettings = {
        ...settings,
        ...newSettings,
      };

      const { error } = await supabase
        .from('accessibility_settings')
        .update(newSettings)
        .eq('id', userData.id);

      if (!error) {
        setSettings(updatedSettings);
      }
    } catch (error) {
      console.error('Error updating accessibility settings:', error);
    }
  };

  return (
    <AccessibilityContext.Provider
      value={{
        settings,
        updateSettings,
        loading,
        fontSizeMultiplier,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error(
      'useAccessibility must be used within AccessibilityProvider'
    );
  }
  return context;
}
