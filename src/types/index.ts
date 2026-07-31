export type ThemeMode = 'dark' | 'light';

export type AppLanguage = 'es' | 'en';

export interface AppSettings {
  theme: ThemeMode;
  language: AppLanguage;
  primaryColor: string;
}

export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: string;
  description?: string;
}

export type ModuleKey = 'dashboard' | 'assistant' | 'music' | 'references' | 'ideas';

export interface DashboardCard {
  key: ModuleKey;
  title: string;
  description: string;
  icon: string;
  accent: 'primary' | 'secondary' | 'gradient';
  path: string;
}
