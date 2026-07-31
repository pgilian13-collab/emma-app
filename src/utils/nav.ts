import type { NavItem, DashboardCard } from '@app-types/index';
import {
  FiHome,
  FiCamera,
  FiMusic,
  FiImage,
  FiZap,
  FiSettings,
  FiClock,
  FiBookOpen,
} from 'react-icons/fi';

export const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Inicio', path: '/', icon: 'home' },
  { id: 'assistant', label: 'Asistencia para Dibujar', path: '/assistant', icon: 'camera' },
  { id: 'music', label: 'Reproductor', path: '/music', icon: 'music' },
  { id: 'references', label: 'Referencias', path: '/references', icon: 'image' },
  { id: 'ideas', label: 'Ideas', path: '/ideas', icon: 'zap' },
  { id: 'settings', label: 'Configuración', path: '/settings', icon: 'settings' },
];

export const ICON_MAP = {
  home: FiHome,
  camera: FiCamera,
  music: FiMusic,
  image: FiImage,
  zap: FiZap,
  settings: FiSettings,
  clock: FiClock,
  book: FiBookOpen,
} as const;

export type IconName = keyof typeof ICON_MAP;

export const DASHBOARD_CARDS: DashboardCard[] = [
  {
    key: 'assistant',
    title: 'Asistencia para Dibujar',
    description: 'Calca imágenes con tu cámara en tiempo real.',
    icon: 'camera',
    accent: 'primary',
    path: '/assistant',
  },
  {
    key: 'music',
    title: 'Reproductor de música',
    description: 'Tu banda sonora local mientras dibujas.',
    icon: 'music',
    accent: 'secondary',
    path: '/music',
  },
  {
    key: 'references',
    title: 'Referencias',
    description: 'Biblioteca visual categorizada y buscable.',
    icon: 'image',
    accent: 'gradient',
    path: '/references',
  },
  {
    key: 'ideas',
    title: 'Generador de ideas',
    description: 'Combinaciones aleatorias para inspirarte.',
    icon: 'zap',
    accent: 'primary',
    path: '/ideas',
  },
];