import { motion } from 'framer-motion';
import { FiMusic, FiUpload, FiFolder, FiHeadphones } from 'react-icons/fi';
import { Button } from '@components/ui/Button';
import { useMusicLoader } from '@modules/music/hooks/useMusicLoader';

interface EmptyStateProps {
  language: 'es' | 'en';
}

export function EmptyState({ language }: EmptyStateProps) {
  const loader = useMusicLoader();
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
          <FiMusic size={28} className="text-white" />
        </div>
        <h3 className="text-xl font-bold text-white">
          {es ? 'Tu reproductor está vacío' : 'Your player is empty'}
        </h3>
        <p className="max-w-md text-sm text-white/60">
          {es
            ? 'Carga archivos MP3, WAV, OGG, M4A o FLAC desde tu dispositivo. La música seguirá sonando aunque navegues a otros módulos.'
            : 'Load MP3, WAV, OGG, M4A or FLAC files from your device. Music keeps playing while you navigate between modules.'}
        </p>

        <div className="mt-2 flex flex-wrap justify-center gap-2">
          <label className="focus-ring inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:brightness-110">
            <FiUpload size={16} />
            {es ? 'Cargar archivos' : 'Load files'}
            <input
              type="file"
              accept="audio/*"
              multiple
              className="hidden"
              onChange={(e) => {
                const list = e.target.files;
                if (list && list.length > 0) {
                  void loader.addFiles(list);
                  e.target.value = '';
                }
              }}
            />
          </label>
          {loader.fsAccessSupported ? (
            <Button
              variant="outline"
              size="md"
              leftIcon={<FiFolder size={16} />}
              onClick={() => void loader.pickDirectory()}
            >
              {es ? 'Cargar carpeta' : 'Load folder'}
            </Button>
          ) : null}
        </div>

        <div className="mt-4 grid w-full max-w-lg grid-cols-1 gap-2 text-left text-xs text-white/60 sm:grid-cols-3">
          <Tip icon={<FiHeadphones size={14} />} text={es ? 'Escucha mientras dibujas' : 'Listen while you draw'} />
          <Tip icon={<FiMusic size={14} />} text={es ? 'Shuffle y repeat' : 'Shuffle & repeat'} />
          <Tip icon={<FiUpload size={14} />} text={es ? 'Todo queda local' : 'Everything stays local'} />
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