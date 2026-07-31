export const IDEA_CATEGORIES = [
  'anime',
  'fantasia',
  'ciencia-ficcion',
  'paisajes',
  'animales',
  'monstruos',
  'chibi',
  'robots',
  'escenas',
  'personajes',
] as const;

export type IdeaCategory = (typeof IDEA_CATEGORIES)[number];

export interface IdeaCategoryMeta {
  key: IdeaCategory;
  label: string;
  emoji: string;
  accent: string;
}

export const CATEGORY_META: Record<IdeaCategory, IdeaCategoryMeta> = {
  anime: { key: 'anime', label: 'Anime', emoji: '✦', accent: 'from-pink-500/70 to-fuchsia-500/70' },
  fantasia: { key: 'fantasia', label: 'Fantasía', emoji: '✺', accent: 'from-purple-500/70 to-violet-500/70' },
  'ciencia-ficcion': { key: 'ciencia-ficcion', label: 'Ciencia ficción', emoji: '⚛', accent: 'from-sky-500/70 to-blue-500/70' },
  paisajes: { key: 'paisajes', label: 'Paisajes', emoji: '⛰', accent: 'from-emerald-500/70 to-teal-500/70' },
  animales: { key: 'animales', label: 'Animales', emoji: '🐾', accent: 'from-lime-500/70 to-green-500/70' },
  monstruos: { key: 'monstruos', label: 'Monstruos', emoji: '☠', accent: 'from-rose-500/70 to-red-500/70' },
  chibi: { key: 'chibi', label: 'Chibi', emoji: '✿', accent: 'from-amber-500/70 to-orange-500/70' },
  robots: { key: 'robots', label: 'Robots', emoji: '⚙', accent: 'from-slate-500/70 to-gray-500/70' },
  escenas: { key: 'escenas', label: 'Escenas', emoji: '◐', accent: 'from-indigo-500/70 to-purple-500/70' },
  personajes: { key: 'personajes', label: 'Personajes', emoji: '✧', accent: 'from-teal-500/70 to-cyan-500/70' },
};

export type IdeaSource = 'generated' | 'custom';

export interface Idea {
  id: string;
  text: string;
  category: IdeaCategory;
  source: IdeaSource;
  favorite: boolean;
  createdAt: number;
  usageCount: number;
}

export interface IdeaGenerationOptions {
  category?: IdeaCategory | 'all';
  pinnedText?: string;
}

export interface IdeaFilter {
  category: IdeaCategory | 'all';
  source: IdeaSource | 'all';
  onlyFavorites: boolean;
  search: string;
}

export const DEFAULT_FILTER: IdeaFilter = {
  category: 'all',
  source: 'all',
  onlyFavorites: false,
  search: '',
};