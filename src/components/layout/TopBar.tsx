import { useLocation } from 'react-router-dom';
import { useSettingsStore } from '@store/settingsStore';
import { useClock } from '@hooks/useClock';
import { formatTime, formatDate, getGreeting } from '@utils/date';
import { translate } from '@utils/i18n';
import { NAV_ITEMS } from '@utils/nav';
import { FiSearch, FiBell } from 'react-icons/fi';

export function TopBar() {
  const language = useSettingsStore((state) => state.language);
  const now = useClock();
  const location = useLocation();
  const t = translate(language);

  const current =
    NAV_ITEMS.find((item) =>
      item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path),
    ) ?? NAV_ITEMS[0];

  const greeting = getGreeting(now.getHours(), language);

  return (
    <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 border-b border-white/5 bg-background/80 px-6 py-4 backdrop-blur-xl">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-light">
          {greeting}
        </p>
        <h1 className="mt-1 text-xl font-bold text-white sm:text-2xl">{current?.label}</h1>
      </div>

      <div className="hidden items-center gap-3 md:flex">
        <div className="flex h-10 w-72 items-center gap-2 rounded-xl border border-white/5 bg-panel px-3 text-sm text-white/60">
          <FiSearch size={16} />
          <input
            type="text"
            placeholder={t.common.search}
            className="w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
          />
        </div>
        <button
          className="focus-ring flex h-10 w-10 items-center justify-center rounded-xl bg-panel text-white/70 hover:text-white"
          aria-label="Notificaciones"
        >
          <FiBell size={18} />
        </button>
      </div>

      <div className="text-right">
        <p className="text-lg font-bold text-white tabular-nums">{formatTime(now, language)}</p>
        <p className="text-xs capitalize text-white/50">{formatDate(now, language)}</p>
      </div>
    </header>
  );
}
