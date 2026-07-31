import { useRef } from 'react';
import { Button } from '@components/ui/Button';
import { FiUpload, FiFolder, FiMusic } from 'react-icons/fi';
import { useMusicLoader } from '@modules/music/hooks/useMusicLoader';

interface FileLoaderProps {
  language: 'es' | 'en';
  trackCount: number;
}

export function FileLoader({ language, trackCount }: FileLoaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const loader = useMusicLoader();
  const es = language === 'es';

  const handleFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const list = event.target.files;
    if (list && list.length > 0) {
      void loader.addFiles(list);
      event.target.value = '';
    }
  };

  return (
    <div className="panel-card flex flex-col gap-3 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-white/40">
            {es ? 'Tu biblioteca' : 'Your library'}
          </h3>
          <p className="mt-1 text-xs text-white/50">
            {trackCount === 0
              ? es
                ? 'Carga archivos o una carpeta para empezar.'
                : 'Load files or a folder to get started.'
              : `${trackCount} ${es ? 'canciones cargadas' : 'tracks loaded'}`}
          </p>
        </div>
        {loader.loading ? (
          <span className="flex items-center gap-2 text-xs text-primary-light">
            <span className="h-2 w-2 animate-pulse-soft rounded-full bg-primary" />
            {es ? 'Procesando…' : 'Processing…'}
          </span>
        ) : null}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        multiple
        onChange={handleFiles}
        className="hidden"
      />

      <div className="flex flex-wrap gap-2">
        <Button
          variant="primary"
          size="sm"
          leftIcon={<FiUpload size={14} />}
          onClick={() => fileInputRef.current?.click()}
          disabled={loader.loading}
        >
          {es ? 'Cargar archivos' : 'Load files'}
        </Button>
        {loader.fsAccessSupported ? (
          <>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<FiMusic size={14} />}
              onClick={() => void loader.pickFiles()}
              disabled={loader.loading}
            >
              {es ? 'Selector nativo' : 'Native picker'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<FiFolder size={14} />}
              onClick={() => void loader.pickDirectory()}
              disabled={loader.loading}
            >
              {es ? 'Cargar carpeta' : 'Load folder'}
            </Button>
          </>
        ) : null}
      </div>

      {loader.error ? (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-200">
          {loader.error}
        </p>
      ) : null}

      {!loader.fsAccessSupported ? (
        <p className="text-[11px] text-white/40">
          {es
            ? 'Tu navegador no soporta selectores nativos de carpeta. Usa el botón "Cargar archivos" para seleccionar varios a la vez.'
            : 'Your browser does not support native folder pickers. Use "Load files" to select multiple at once.'}
        </p>
      ) : null}
    </div>
  );
}