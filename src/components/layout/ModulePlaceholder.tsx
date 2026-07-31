import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { FiCamera } from 'react-icons/fi';
import { useSettingsStore } from '@store/settingsStore';
import { translate } from '@utils/i18n';

interface ModulePlaceholderProps {
  icon: ReactNode;
  title: string;
  description: string;
  features: string[];
}

export function ModulePlaceholder({ icon, title, description, features }: ModulePlaceholderProps) {
  const language = useSettingsStore((state) => state.language);
  const t = translate(language);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-start gap-3"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-white shadow-glow">
          {icon}
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-light">
            {t.placeholders.coming}
          </p>
          <h1 className="mt-1 text-3xl font-extrabold text-white">{title}</h1>
          <p className="mt-1 max-w-2xl text-sm text-white/60">{description}</p>
        </div>
      </motion.div>

      <Card>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-white/40">
          {language === 'es' ? 'Funciones previstas' : 'Planned features'}
        </h2>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {features.map((feature, index) => (
            <motion.li
              key={feature}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: 0.05 * index }}
              className="flex items-center gap-3 rounded-xl border border-white/5 bg-panel/50 px-3 py-2 text-sm text-white/80"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15 text-primary-light">
                <FiCamera size={14} />
              </span>
              {feature}
            </motion.li>
          ))}
        </ul>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-dashed border-white/10 bg-panel/40 px-5 py-4">
        <p className="text-sm text-white/60">
          {language === 'es'
            ? 'Este módulo se construirá en el siguiente paso del proyecto.'
            : 'This module will be built in the next project step.'}
        </p>
        <Button variant="outline" size="sm">
          {language === 'es' ? 'Más información' : 'Learn more'}
        </Button>
      </div>
    </div>
  );
}
