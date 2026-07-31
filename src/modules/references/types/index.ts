export const REFERENCE_CATEGORIES = [
  'anime',
  'paisajes',
  'anatomia',
  'manos',
  'ojos',
  'cabello',
  'poses',
  'animales',
  'objetos',
  'otros',
] as const;

export type ReferenceCategory = (typeof REFERENCE_CATEGORIES)[number];

export interface ReferenceCategoryMeta {
  key: ReferenceCategory;
  label: string;
  emoji: string;
  accent: string;
}

export const CATEGORY_META: Record<ReferenceCategory, ReferenceCategoryMeta> = {
  anime: { key: 'anime', label: 'Anime', emoji: '✦', accent: 'from-pink-500/70 to-fuchsia-500/70' },
  paisajes: { key: 'paisajes', label: 'Paisajes', emoji: '⛰', accent: 'from-emerald-500/70 to-teal-500/70' },
  anatomia: { key: 'anatomia', label: 'Anatomía', emoji: '✺', accent: 'from-amber-500/70 to-orange-500/70' },
  manos: { key: 'manos', label: 'Manos', emoji: '✋', accent: 'from-yellow-500/70 to-amber-500/70' },
  ojos: { key: 'ojos', label: 'Ojos', emoji: '◉', accent: 'from-sky-500/70 to-blue-500/70' },
  cabello: { key: 'cabello', label: 'Cabello', emoji: '✦', accent: 'from-purple-500/70 to-violet-500/70' },
  poses: { key: 'poses', label: 'Poses', emoji: '⚡', accent: 'from-rose-500/70 to-red-500/70' },
  animales: { key: 'animales', label: 'Animales', emoji: '🐾', accent: 'from-lime-500/70 to-green-500/70' },
  objetos: { key: 'objetos', label: 'Objetos', emoji: '◇', accent: 'from-slate-500/70 to-gray-500/70' },
  otros: { key: 'otros', label: 'Otros', emoji: '✧', accent: 'from-indigo-500/70 to-purple-500/70' },
};

export interface Reference {
  id: string;
  name: string;
  category: ReferenceCategory;
  favorite: boolean;
  tags: string[];
  width: number;
  height: number;
  mimeType: string;
  size: number;
  createdAt: number;
  updatedAt: number;
}

export interface ReferenceFilter {
  search: string;
  category: ReferenceCategory | 'all';
  onlyFavorites: boolean;
}

export const DEFAULT_FILTER: ReferenceFilter = {
  search: '',
  category: 'all',
  onlyFavorites: false,
};