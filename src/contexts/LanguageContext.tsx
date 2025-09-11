import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'ml';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Header
    'header.title': 'Karela Metro Rail Limited',
    'header.subtitle': 'Asset Management Dashboard',
    'header.search': 'Search assets, faults...',
    'header.profile': 'Profile',
    'header.settings': 'Settings',
    'header.signout': 'Sign Out',
    
    // Sidebar
    'nav.dashboard': 'Dashboard',
    'nav.assets': 'Assets',
    'nav.faults': 'Fault Reports',
    'nav.maintenance': 'Maintenance',
    'nav.analytics': 'Analytics',
    'nav.personnel': 'Personnel',
    'nav.reports': 'Reports',
    'nav.settings': 'Settings',
    'nav.navigation': 'Navigation',
    
    // Dashboard
    'dashboard.overview': 'System Overview',
    'dashboard.totalAssets': 'Total Assets',
    'dashboard.activeFaults': 'Active Faults',
    'dashboard.criticalIssues': 'Critical Issues',
    'dashboard.maintenanceDue': 'Maintenance Due',
    'dashboard.recentActivity': 'Recent Activity',
    'dashboard.faultsByCategory': 'Faults by Category',
    'dashboard.systemStatus': 'System Status',
    'dashboard.viewAll': 'View All',
    
    // Status
    'status.operational': 'Operational',
    'status.warning': 'Warning',
    'status.critical': 'Critical',
    'status.maintenance': 'Maintenance',
    
    // Categories
    'category.electrical': 'Electrical',
    'category.mechanical': 'Mechanical',
    'category.signaling': 'Signaling',
    'category.hvac': 'HVAC',
    
    // Language
    'language.english': 'English',
    'language.malayalam': 'Malayalam',
    'language.changeLanguage': 'Change Language'
  },
  ml: {
    // Header
    'header.title': 'കേരള മെട്രോ റെയിൽ ലിമിറ്റഡ്',
    'header.subtitle': 'അസറ്റ് മാനേജ്മെന്റ് ഡാഷ്ബോർഡ്',
    'header.search': 'അസറ്റുകൾ, തകരാറുകൾ തിരയുക...',
    'header.profile': 'പ്രൊഫൈൽ',
    'header.settings': 'ക്രമീകരണങ്ങൾ',
    'header.signout': 'സൈൻ ഔട്ട്',
    
    // Sidebar
    'nav.dashboard': 'ഡാഷ്ബോർഡ്',
    'nav.assets': 'അസറ്റുകൾ',
    'nav.faults': 'ഫാൾട്ട് റിപ്പോർട്ടുകൾ',
    'nav.maintenance': 'മെയിന്റനൻസ്',
    'nav.analytics': 'അനലിറ്റിക്സ്',
    'nav.personnel': 'ജീവനക്കാർ',
    'nav.reports': 'റിപ്പോർട്ടുകൾ',
    'nav.settings': 'ക്രമീകരണങ്ങൾ',
    'nav.navigation': 'നാവിഗേഷൻ',
    
    // Dashboard
    'dashboard.overview': 'സിസ്റ്റം അവലോകനം',
    'dashboard.totalAssets': 'മൊത്തം അസറ്റുകൾ',
    'dashboard.activeFaults': 'സജീവ തകരാറുകൾ',
    'dashboard.criticalIssues': 'അടിയന്തിര പ്രശ്നങ്ങൾ',
    'dashboard.maintenanceDue': 'മെയിന്റനൻസ് വേണ്ടത്',
    'dashboard.recentActivity': 'സമീപകാല പ്രവർത്തനം',
    'dashboard.faultsByCategory': 'വിഭാഗം അനുസരിച്ച് തകരാറുകൾ',
    'dashboard.systemStatus': 'സിസ്റ്റം സ്റ്റാറ്റസ്',
    'dashboard.viewAll': 'എല്ലാം കാണുക',
    
    // Status
    'status.operational': 'പ്രവർത്തനക്ഷമം',
    'status.warning': 'മുന്നറിയിപ്പ്',
    'status.critical': 'അടിയന്തിരം',
    'status.maintenance': 'മെയിന്റനൻസ്',
    
    // Categories
    'category.electrical': 'ഇലക്ട്രിക്കൽ',
    'category.mechanical': 'മെക്കാനിക്കൽ',
    'category.signaling': 'സിഗ്നലിങ്',
    'category.hvac': 'എച്ച്വിഎസി',
    
    // Language
    'language.english': 'ഇംഗ്ലീഷ്',
    'language.malayalam': 'മലയാളം',
    'language.changeLanguage': 'ഭാഷ മാറ്റുക'
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}