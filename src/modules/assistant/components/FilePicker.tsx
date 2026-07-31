import { useRef } from 'react';
import { Button } from '@components/ui/Button';
import { readFileAsDataUrl } from '@modules/assistant/services/fileService';
import { FiImage, FiX, FiRefreshCw } from 'react-icons/fi';

interface FilePickerProps {
  imageUrl: string | null;
  imageName: string | null;
  onSelect: (dataUrl: string, name: string) => void;
  onClear: () => void;
  language: 'es' | 'en';
}

export function FilePicker({ imageUrl, imageName, onSelect, onClear, language }: FilePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = await readFileAsDataUrl(file);
    onSelect(url, file.name);
    if (inputRef.current) inputRef.current.value = '';
  };

  const t = {
    pick: language === 'es' ? 'Cargar imagen' : 'Load image',
    change: language === 'es' ? 'Cambiar imagen' : 'Change image',
    clear: language === 'es' ? 'Quitar imagen' : 'Remove image',
    noImage: language === 'es' ? 'Sin imagen cargada' : 'No image loaded',
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
        aria-hidden
      />

      {imageUrl ? (
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-panel/70 px-3 py-2">
          <div className="h-8 w-8 overflow-hidden rounded-lg bg-white/5">
            <img src={imageUrl} alt="" className="h-full w-full object-cover" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-white">{imageName ?? t.noImage}</p>
            <p className="text-[10px] uppercase tracking-widest text-white/40">
              {language === 'es' ? 'Imagen activa' : 'Active image'}
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-white/10 bg-panel/40 px-3 py-2 text-xs text-white/50">
          {t.noImage}
        </div>
      )}

      <Button
        variant="outline"
        size="sm"
        leftIcon={imageUrl ? <FiRefreshCw size={14} /> : <FiImage size={14} />}
        onClick={() => inputRef.current?.click()}
      >
        {imageUrl ? t.change : t.pick}
      </Button>

      {imageUrl ? (
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<FiX size={14} />}
          onClick={onClear}
        >
          {t.clear}
        </Button>
      ) : null}
    </div>
  );
}