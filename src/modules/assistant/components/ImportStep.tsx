import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@components/ui/Button';
import { FiUpload, FiImage, FiCamera, FiRefreshCw, FiX } from 'react-icons/fi';
import { readFileAsDataUrl } from '@modules/assistant/services/fileService';
import type { CameraState } from '@modules/assistant/types';

interface ImportStepProps {
  imageUrl: string | null;
  imageName: string | null;
  cameraState: CameraState;
  onSelectImage: (dataUrl: string, name: string) => void;
  onClearImage: () => void;
  onStartCamera: () => void;
  language: 'es' | 'en';
}

export function ImportStep({
  imageUrl,
  imageName,
  cameraState,
  onSelectImage,
  onClearImage,
  onStartCamera,
  language,
}: ImportStepProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const es = language === 'es';

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const url = await readFileAsDataUrl(file);
    onSelectImage(url, file.name);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) void handleFile(file);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) void handleFile(file);
  };

  const labels = {
    eyebrow: es ? 'Paso 1 de 2' : 'Step 1 of 2',
    title: es ? 'Importa una imagen' : 'Import an image',
    subtitle: es
      ? 'Carga la imagen que quieres calcar. Después activaremos la cámara.'
      : 'Load the image you want to trace. We will activate the camera next.',
    pick: es ? 'Seleccionar imagen' : 'Choose image',
    drag: es ? 'o arrastra un archivo aquí' : 'or drop a file here',
    loaded: es ? 'Imagen lista' : 'Image ready',
    change: es ? 'Cambiar imagen' : 'Change image',
    remove: es ? 'Quitar imagen' : 'Remove image',
    next: es ? 'Activar cámara y empezar' : 'Activate camera and start',
    nextHint: es
      ? 'Aceptaremos permisos de cámara y mostraremos tu imagen sobre la vista en vivo.'
      : 'We will request camera permission and overlay your image on the live view.',
    formats: es
      ? 'Formatos soportados: PNG, JPG, WEBP, GIF, BMP'
      : 'Supported formats: PNG, JPG, WEBP, GIF, BMP',
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-light">
          {labels.eyebrow}
        </p>
        <h1 className="mt-1 text-3xl font-extrabold text-white">{labels.title}</h1>
        <p className="mt-1 max-w-2xl text-sm text-white/60">{labels.subtitle}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]"
      >
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`panel-card relative flex min-h-[420px] items-center justify-center overflow-hidden p-6 transition ${
            dragging ? 'ring-2 ring-primary' : ''
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />

          {imageUrl ? (
            <motion.div
              key={imageUrl}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="flex h-full w-full flex-col"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary-light">
                    <FiImage size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">
                      {imageName ?? labels.loaded}
                    </p>
                    <p className="text-[11px] uppercase tracking-widest text-white/40">
                      {labels.loaded}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<FiRefreshCw size={14} />}
                    onClick={() => inputRef.current?.click()}
                  >
                    {labels.change}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<FiX size={14} />}
                    onClick={onClearImage}
                    className="text-red-300 hover:bg-red-500/10"
                  >
                    {labels.remove}
                  </Button>
                </div>
              </div>
              <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-xl bg-black/40">
                <img
                  src={imageUrl}
                  alt={imageName ?? 'Referencia'}
                  className="max-h-[480px] w-auto max-w-full object-contain"
                />
              </div>
            </motion.div>
          ) : (
            <motion.button
              type="button"
              onClick={() => inputRef.current?.click()}
              animate={{ borderColor: dragging ? '#8B5CF6' : 'rgba(255,255,255,0.1)' }}
              className="flex w-full max-w-md flex-col items-center gap-4 rounded-2xl border-2 border-dashed bg-panel/40 px-6 py-12 text-center transition hover:bg-panel/60"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-secondary shadow-glow">
                <FiUpload size={28} className="text-white" />
              </div>
              <div>
                <p className="text-lg font-semibold text-white">{labels.pick}</p>
                <p className="mt-1 text-xs text-white/50">{labels.drag}</p>
              </div>
              <span className="rounded-full border border-white/10 bg-panel px-3 py-1 text-[10px] uppercase tracking-widest text-white/40">
                {labels.formats}
              </span>
            </motion.button>
          )}
        </div>

        <motion.aside
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="panel-card flex flex-col gap-4 p-5"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
              {es ? 'Paso 2' : 'Step 2'}
            </p>
            <h2 className="mt-1 text-lg font-bold text-white">
              {es ? 'Activar la cámara' : 'Activate the camera'}
            </h2>
            <p className="mt-2 text-sm text-white/60">{labels.nextHint}</p>
          </div>

          <ul className="space-y-2 text-xs text-white/60">
            <Bullet text={es ? 'Se pedirá permiso solo en tu navegador.' : 'Permission is requested locally only.'} />
            <Bullet text={es ? 'Preferimos la cámara trasera.' : 'Back camera preferred.'} />
            <Bullet text={es ? 'Podrás ajustar transparencia, escala y rotación.' : 'You can adjust opacity, scale and rotation.'} />
          </ul>

          <Button
            variant="primary"
            size="lg"
            fullWidth
            leftIcon={<FiCamera size={18} />}
            disabled={!imageUrl || cameraState.status === 'requesting'}
            onClick={onStartCamera}
          >
            {cameraState.status === 'requesting'
              ? es ? 'Solicitando…' : 'Requesting…'
              : labels.next}
          </Button>

          {!imageUrl ? (
            <p className="text-[11px] text-white/40">
              {es
                ? 'Carga una imagen para habilitar este botón.'
                : 'Load an image to enable this button.'}
            </p>
          ) : null}
        </motion.aside>
      </motion.div>
    </div>
  );
}

function Bullet({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2 rounded-lg border border-white/5 bg-panel/60 px-3 py-2">
      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
      <span>{text}</span>
    </li>
  );
}