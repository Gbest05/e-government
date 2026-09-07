import React, { createContext, useContext, useState, useEffect } from 'react';
import { settingsService } from '../services/api';

const DEFAULT_SETTINGS = {
  site_name: 'Remo North Local Government',
  site_short_name: 'REMO NORTH',
  logo_url: null,
  hero_badge: 'Official E-Government Portal',
  hero_title: 'Empowering Remo North Through Modern Digital Governance',
  hero_subtitle: 'Access municipal services, submit statutory applications, report local infrastructure problems, and track approvals seamlessly from anywhere.',
  hero_cta_primary: 'Explore All Services',
  hero_cta_secondary: 'Report Community Issue',
  announcement_banner: 'Official Portal of Remo North Local Government, Ogun State • Secretariat: Isara-Remo',
  secretariat_address: 'Local Government Secretariat Complex, Palace Way, Isara-Remo',
  emergency_helpline: '0800-REMO-HELP',
  main_phone: '+234 (0) 803 111 2233',
  official_email: 'info@remonorth.og.gov.ng',
  state_name: 'Ogun State, Nigeria',
  about_summary: 'Remo North Local Government Area is an administrative hub in Ogun State with council headquarters situated in Isara-Remo. It encompasses 10 electoral wards across historic towns including Isara, Ode, Ipara, Akaka, Ilara, and Orile-Oko.'
};

const SettingsContext = createContext(null);

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await settingsService.getSettings();
      if (res.data?.settings) {
        setSettings((prev) => ({ ...prev, ...res.data.settings }));
      }
    } catch (err) {
      console.warn('Failed to load council settings, using defaults:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateSettings = (newSettings) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const value = {
    settings,
    loading,
    updateSettings,
    refreshSettings: fetchSettings,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export default SettingsContext;
