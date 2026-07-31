import { motion } from 'framer-motion';
import { FiImage, FiUpload, FiHeart } from 'react-icons/fi';

interface EmptyStateProps {
  language: 'es' | 'en';
  onUploadClick?: () => void;
}

export function EmptyState({ language }: EmptyStateProps) {
  const es = language === 'es';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="panel-card relative overflow-hidden p-10 text-center"
    >
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/15 blur-3xl" aria-hidden />
      <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-secondary/15 blur-3xl" aria-hidden />

      <div className="relative flex flex-col items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-secondary shadow-glow">
          <FiImage size={28} className="text-white" />
        </div>
        <h3 className="text-xl font-bold text-white">
          {es ? 'Tu biblioteca está vacía' : 'Your library is empty'}
        </h3>
        <p className="max-w-md text-sm text-white/60">
          {es
            ? 'Sube tus primeras referencias. Se guardan localmente en tu navegador y puedes categorizarlas para encontrarlas rápido.'
            : 'Upload your first references. They are stored locally in your browser and can be categorized for quick access.'}
        </p>

        <div className="mt-4 grid w-full max-w-lg grid-cols-1 gap-2 text-left text-xs text-white/60 sm:grid-cols-3">
          <Tip icon={<FiUpload size={14} />} text={es ? 'Arrastra o selecciona' : 'Drag or pick files'} />
          <Tip icon={<FiImage size={14} />} text={es ? '10 categorías' : '10 categories'} />
          <Tip icon={<FiHeart size={14} />} text={es ? 'Marca tus favoritas' : 'Mark favorites'} />
        </div>
      </div>
    </motion.div>
  );
}

function Tip({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-white/5 bg-panel/60 px-3 py-2">
      <span className="mt-0.5 text-primary-light">{icon}</span>
      <span>{text}</span>
    </div>
  );
}