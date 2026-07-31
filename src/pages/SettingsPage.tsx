import { Card } from '@components/ui/Card';
import { SectionTitle } from '@components/ui/SectionTitle';
import { Button } from '@components/ui/Button';
import { useSettingsStore } from '@store/settingsStore';
import { translate } from '@utils/i18n';
import { FiMoon, FiSun, FiTrash2, FiCheck } from 'react-icons/fi';
import type { AppLanguage, ThemeMode } from '@app-types/index';
import { motion, AnimatePresence } from 'framer-motion';

const ACCENT_COLORS = [
  { value: '#8B5CF6', label: 'Violeta' },
  { value: '#EC4899', label: 'Magenta' },
  { value: '#3B82F6', label: 'Azul' },
  { value: '#10B981', label: 'Verde' },
  { value: '#F59E0B', label: 'Ámbar' },
  { value: '#EF4444', label: 'Rojo' },
];

export function SettingsPage() {
  const language = useSettingsStore((state) => state.language);
  const theme = useSettingsStore((state) => state.theme);
  const primaryColor = useSettingsStore((state) => state.primaryColor);
  const setTheme = useSettingsStore((state) => state.setTheme);
  const setLanguage = useSettingsStore((state) => state.setLanguage);
  const setPrimaryColor = useSettingsStore((state) => state.setPrimaryColor);
  const reset = useSettingsStore((state) => state.reset);
  const t = translate(language);

  const themes: { value: ThemeMode; label: string; icon: typeof FiSun }[] = [
    { value: 'dark', label: t.settings.dark, icon: FiMoon },
    { value: 'light', label: t.settings.light, icon: FiSun },
  ];

  const languages: { value: AppLanguage; label: string; flag: string }[] = [
    { value: 'es', label: 'Español', flag: 'ES' },
    { value: 'en', label: 'English', flag: 'EN' },
  ];

  const handleReset = () => {
    if (window.confirm(t.settings.reset + '?')) {
      reset();
    }
  };

  const handleClearAll = () => {
    if (window.confirm(t.settings.danger + '?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8">
      <SectionTitle
        eyebrow={t.settings.appearance}
        title={t.settings.title}
        description={t.settings.subtitle}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white/40">
            {t.settings.theme}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {themes.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setTheme(value)}
                className={`focus-ring flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                  theme === value
                    ? 'border-primary bg-primary/15 text-white shadow-glow'
                    : 'border-white/10 bg-panel text-white/70 hover:bg-panelLight'
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-white/40">
            {language === 'es'
              ? 'EMMA está optimizado para modo oscuro. El modo claro llegará pronto.'
              : 'EMMA is optimized for dark mode. Light mode coming soon.'}
          </p>
        </Card>

        <Card>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white/40">
            {t.settings.language}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {languages.map(({ value, label, flag }) => (
              <button
                key={value}
                onClick={() => setLanguage(value)}
                className={`focus-ring flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                  language === value
                    ? 'border-primary bg-primary/15 text-white shadow-glow'
                    : 'border-white/10 bg-panel text-white/70 hover:bg-panelLight'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] font-bold tracking-widest text-white/80">
                    {flag}
                  </span>
                  {label}
                </span>
                <AnimatePresence>
                  {language === value ? (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="text-primary-light"
                    >
                      <FiCheck size={16} />
                    </motion.span>
                  ) : null}
                </AnimatePresence>
              </button>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white/40">
            {t.settings.accentColor}
          </h3>
          <div className="flex flex-wrap gap-3">
            {ACCENT_COLORS.map((color) => (
              <button
                key={color.value}
                onClick={() => setPrimaryColor(color.value)}
                aria-label={color.label}
                className={`focus-ring group relative h-12 w-12 rounded-2xl border-2 transition-all ${
                  primaryColor === color.value
                    ? 'border-white scale-110 shadow-glow'
                    : 'border-white/10 hover:scale-105'
                }`}
                style={{ backgroundColor: color.value }}
              >
                <AnimatePresence>
                  {primaryColor === color.value ? (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute inset-0 flex items-center justify-center text-white"
                    >
                      <FiCheck size={18} />
                    </motion.span>
                  ) : null}
                </AnimatePresence>
              </button>
            ))}
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-panel px-3 py-2">
              <input
                type="color"
                value={primaryColor}
                onChange={(event) => setPrimaryColor(event.target.value)}
                className="h-7 w-7 cursor-pointer rounded-lg border-0 bg-transparent"
                aria-label="Color personalizado"
              />
              <span className="text-xs uppercase text-white/40">
                {language === 'es' ? 'Personalizado' : 'Custom'}
              </span>
            </div>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white/40">
            {language === 'es' ? 'Datos y privacidad' : 'Data & privacy'}
          </h3>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-white">{t.settings.reset}</p>
              <p className="mt-1 text-xs text-white/50">
                {language === 'es'
                  ? 'Restablece los ajustes a sus valores predeterminados.'
                  : 'Restore settings to default values.'}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={handleReset}>
              {t.settings.reset}
            </Button>
          </div>
          <div className="mt-4 flex flex-col gap-3 border-t border-white/5 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-red-300">{t.settings.danger}</p>
              <p className="mt-1 text-xs text-white/50">
                {language === 'es'
                  ? 'Elimina todas las referencias, listas de música e ideas guardadas.'
                  : 'Erase all references, music lists and saved ideas.'}
              </p>
            </div>
            <Button variant="danger" size="sm" leftIcon={<FiTrash2 size={14} />} onClick={handleClearAll}>
              {t.settings.danger}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}