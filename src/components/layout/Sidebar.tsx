import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';
import { NAV_ITEMS, ICON_MAP, type IconName } from '@utils/nav';
import { useSettingsStore } from '@store/settingsStore';
import { useUiStore } from '@store/uiStore';
import { translate } from '@utils/i18n';
import { cn } from '@utils/cn';

export function Sidebar() {
  const language = useSettingsStore((state) => state.language);
  const sidebarOpen = useUiStore((state) => state.sidebarOpen);
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);
  const setSidebarOpen = useUiStore((state) => state.setSidebarOpen);
  const t = translate(language);

  return (
    <>
      <button
        onClick={toggleSidebar}
        aria-label="Alternar menú"
        className="focus-ring fixed left-4 top-4 z-50 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-panel/80 text-white shadow-panel backdrop-blur lg:hidden"
      >
        {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
      </button>

      <AnimatePresence initial={false}>
        {sidebarOpen ? (
          <motion.aside
            key="sidebar"
            initial={{ x: -280, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -280, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-white/5 bg-panel/95 backdrop-blur-xl lg:static lg:translate-x-0"
          >
            <div className="flex items-center gap-3 px-6 py-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-lg font-extrabold text-white shadow-glow">
                E
              </div>
              <div className="leading-tight">
                <p className="text-base font-bold text-white">{t.appName}</p>
                <p className="text-xs text-white/50">{t.appTagline}</p>
              </div>
            </div>

            <nav className="flex-1 space-y-1 px-3">
              {NAV_ITEMS.map((item, index) => {
                const Icon = ICON_MAP[item.icon as IconName];
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: 0.05 * index }}
                  >
                    <NavLink
                      to={item.path}
                      end={item.path === '/'}
                      onClick={() => {
                        if (window.innerWidth < 1024) setSidebarOpen(false);
                      }}
                      className={({ isActive }) =>
                        cn(
                          'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                          'focus-ring',
                          isActive
                            ? 'bg-gradient-to-r from-primary/20 to-secondary/10 text-white shadow-glow'
                            : 'text-white/70 hover:bg-white/5 hover:text-white',
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {Icon ? (
                            <Icon
                              size={18}
                              className={cn(
                                'transition-colors',
                                isActive ? 'text-primary-light' : 'text-white/50 group-hover:text-white',
                              )}
                            />
                          ) : null}
                          <span>{item.label}</span>
                          {isActive ? (
                            <motion.span
                              layoutId="sidebar-active"
                              className="ml-auto h-2 w-2 rounded-full bg-primary"
                            />
                          ) : null}
                        </>
                      )}
                    </NavLink>
                  </motion.div>
                );
              })}
            </nav>

            <div className="border-t border-white/5 px-4 py-4 text-xs text-white/40">
              <p className="font-semibold text-white/60">v0.1 · Beta</p>
              <p className="mt-1">Almacenamiento local activo</p>
            </div>
          </motion.aside>
        ) : null}
      </AnimatePresence>
    </>
  );
}
