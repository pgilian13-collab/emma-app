import {
  GENERIC_POOLS,
  IDEA_DATABASE,
  getAllCategories,
} from '@modules/ideas/services/ideaDatabase';
import type { IdeaCategory } from '@modules/ideas/types';

export interface GenerationParts {
  subject: string;
  action: string;
  context: string;
  extra: string;
}

interface PoolsShape {
  subjects: string[];
  actions: string[];
  contexts: string[];
  extras: string[];
}

function pickRandom<T>(list: T[], random: () => number): T {
  if (list.length === 0) throw new Error('Cannot pick from empty list');
  return list[Math.floor(random() * list.length)]!;
}

function pickFromPools(
  pools: PoolsShape,
  random: () => number,
): GenerationParts {
  return {
    subject: pickRandom(pools.subjects, random),
    action: pickRandom(pools.actions, random),
    context: pickRandom(pools.contexts, random),
    extra: pickRandom(pools.extras, random),
  };
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function joinParts(parts: GenerationParts, template: number): string {
  const { subject, action, context, extra } = parts;
  switch (template) {
    case 0:
      return `${capitalize(subject)} ${action}, ${context}.`;
    case 1:
      return `${capitalize(subject)} ${action} ${context} ${extra}.`;
    case 2:
      return `${capitalize(subject)} ${context} ${action} ${extra}.`;
    case 3:
      return `${capitalize(subject)} ${action}.`;
    case 4:
      return `${capitalize(subject)} ${context}.`;
    case 5:
      return `${capitalize(subject)} ${action} ${extra}.`;
    case 6:
      return `${capitalize(subject)} ${context}, ${extra}.`;
    default:
      return `${capitalize(subject)} ${action} ${context}.`;
  }
}

export interface GenerateIdeaOptions {
  category?: IdeaCategory | 'all';
  random?: () => number;
}

export function generateIdeaText({
  category = 'all',
  random = Math.random,
}: GenerateIdeaOptions = {}): string {
  const categories: IdeaCategory[] =
    category === 'all' ? getAllCategories() : [category];

  const chosenCategory = pickRandom(categories, random);
  const pools = IDEA_DATABASE[chosenCategory];

  const useBoth = random() < 0.35;
  const combined: PoolsShape = useBoth
    ? {
        subjects: [...pools.subjects, ...GENERIC_POOLS.subjects],
        actions: [...pools.actions, ...GENERIC_POOLS.actions],
        contexts: [...pools.contexts, ...GENERIC_POOLS.contexts],
        extras: [...pools.extras, ...GENERIC_POOLS.extras],
      }
    : pools;

  const parts = pickFromPools(combined, random);
  const template = Math.floor(random() * 7);

  return joinParts(parts, template);
}

export function generateIdeaParts(
  category: IdeaCategory | 'all',
  random: () => number = Math.random,
): { text: string; category: IdeaCategory } {
  const resolved = category === 'all' ? pickRandom(getAllCategories(), random) : category;
  return {
    text: generateIdeaText({ category: resolved, random }),
    category: resolved,
  };
}