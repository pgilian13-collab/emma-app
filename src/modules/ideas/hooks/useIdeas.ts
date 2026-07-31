import { useCallback, useMemo } from 'react';
import { generateIdeaParts } from '@modules/ideas/services/ideaGenerator';
import { useIdeasStore, makeIdea } from '@modules/ideas/store/ideasStore';
import type { Idea, IdeaCategory, IdeaSource } from '@modules/ideas/types';

export interface UseIdeas {
  ideas: Idea[];
  history: Idea[];
  favorites: Idea[];
  custom: Idea[];
  generate: (category?: IdeaCategory | 'all') => Idea;
  addCustom: (text: string, category: IdeaCategory) => Idea;
  remove: (id: string) => void;
  toggleFavorite: (id: string) => void;
  update: (id: string, patch: { text?: string; category?: IdeaCategory }) => void;
  clearHistory: () => void;
  clearAll: () => void;
}

export function useIdeas(): UseIdeas {
  const ideas = useIdeasStore((s) => s.ideas);
  const historyIds = useIdeasStore((s) => s.historyIds);
  const generateAction = useIdeasStore((s) => s.generateIdea);
  const addCustomAction = useIdeasStore((s) => s.addCustomIdea);
  const remove = useIdeasStore((s) => s.removeIdea);
  const toggleFavorite = useIdeasStore((s) => s.toggleFavorite);
  const update = useIdeasStore((s) => s.updateIdea);
  const clearHistoryAction = useIdeasStore((s) => s.clearHistory);
  const clearAll = useIdeasStore((s) => s.clearAll);

  const generate = useCallback(
    (category: IdeaCategory | 'all' = 'all') => {
      const { text, category: resolvedCategory } = generateIdeaParts(category);
      const idea = makeIdea({
        text,
        category: resolvedCategory,
        source: 'generated' as IdeaSource,
      });
      generateAction(idea);
      return idea;
    },
    [generateAction],
  );

  const addCustom = useCallback(
    (text: string, category: IdeaCategory) => {
      const idea = makeIdea({
        text: text.trim(),
        category,
        source: 'custom' as IdeaSource,
      });
      addCustomAction(idea);
      return idea;
    },
    [addCustomAction],
  );

  const history = useMemo(() => {
    const map = new Map(ideas.map((i) => [i.id, i]));
    return historyIds
      .map((id) => map.get(id))
      .filter((idea): idea is Idea => !!idea);
  }, [ideas, historyIds]);

  const favorites = useMemo(
    () => ideas.filter((i) => i.favorite),
    [ideas],
  );

  const custom = useMemo(
    () => ideas.filter((i) => i.source === 'custom'),
    [ideas],
  );

  return {
    ideas,
    history,
    favorites,
    custom,
    generate,
    addCustom,
    remove,
    toggleFavorite,
    update,
    clearHistory: clearHistoryAction,
    clearAll,
  };
}