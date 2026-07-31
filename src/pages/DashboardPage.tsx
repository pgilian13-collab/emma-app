import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '@components/ui/Card';
import { SectionTitle } from '@components/ui/SectionTitle';
import { Button } from '@components/ui/Button';
import { useSettingsStore } from '@store/settingsStore';
import { useClock } from '@hooks/useClock';
import { DASHBOARD_CARDS, ICON_MAP, type IconName } from '@utils/nav';
import { translate } from '@utils/i18n';
import { getGreeting } from '@utils/date';
import { FiPlay, FiArrowRight, FiRefreshCcw, FiHeart, FiBookmark } from 'react-icons/fi';

const QUICK_IDEAS = [
  'Un dragón leyendo un libro en una biblioteca flotante.',
  'Una samurái bajo la lluvia con faroles brillantes.',
  'Un gato astronauta en una estación espacial.',
  'Una ciudad suspendida entre nubes de cristal.',
  'Un bosque donde los árboles son instrumentos musicales.',
];

function pickIdea(seed: number): string {
  return QUICK_IDEAS[seed % QUICK_IDEAS.length] ?? QUICK_IDEAS[0]!;
}

export function DashboardPage() {
  const language = useSettingsStore((state) => state.language);
  const now = useClock();
  const t = translate(language);

  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000,
  );
  const ideaOfDay = pickIdea(dayOfYear);

  const stats = [
    { label: t.dashboard.referencesCount, value: '0', accent: 'from-primary/40 to-primary/0' },
    { label: t.dashboard.lastSong, value: t.dashboard.noSong, accent: 'from-secondary/40 to-secondary/0' },
    { label: t.dashboard.lastSession, value: t.dashboard.never, accent: 'from-primary/30 to-secondary/10' },
  ];

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-light">
          {getGreeting(now.getHours(), language)}
        </p>
        <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
          {t.dashboard.title} a <span className="gradient-text">EMMA</span>
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-white/60">{t.dashboard.subtitle}</p>
      </motion.div>

      <section>
        <SectionTitle
          eyebrow={t.dashboard.statsTitle}
          title={t.dashboard.quickAccess}
          action={
            <Button
              variant="outline"
              size="sm"
              leftIcon={<FiRefreshCcw size={14} />}
              onClick={() => window.location.reload()}
            >
              {language === 'es' ? 'Actualizar' : 'Refresh'}
            </Button>
          }
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, index) => (
            <Card key={stat.label} delay={index * 0.05} accent="gradient">
              <p className="text-xs uppercase tracking-widest text-white/40">{stat.label}</p>
              <p className="mt-2 text-2xl font-bold text-white">{stat.value}</p>
              <div
                className={`mt-4 h-1 rounded-full bg-gradient-to-r ${stat.accent}`}
                aria-hidden
              />
            </Card>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle
          eyebrow={t.dashboard.modulesTitle}
          title={language === 'es' ? 'Tus herramientas' : 'Your tools'}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DASHBOARD_CARDS.map((card, index) => {
            const Icon = ICON_MAP[card.icon as IconName];
            return (
              <Link key={card.key} to={card.path} className="block focus:outline-none">
                <Card
                  interactive
                  accent={card.accent === 'gradient' ? 'gradient' : card.accent === 'primary' ? 'primary' : 'secondary'}
                  delay={0.1 + index * 0.05}
                  icon={Icon ? <Icon size={22} /> : null}
                >
                  <h3 className="text-base font-semibold text-white">{card.title}</h3>
                  <p className="mt-1 text-sm text-white/60">{card.description}</p>
                  <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary-light">
                    {t.common.open} <FiArrowRight size={14} />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <SectionTitle
          eyebrow={t.dashboard.ideaOfDay}
          title={language === 'es' ? 'Inspiración del momento' : 'Fresh inspiration'}
          action={
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<FiRefreshCcw size={14} />}
              onClick={() => window.location.reload()}
            >
              {t.dashboard.generateIdea}
            </Button>
          }
        />

        <Card delay={0.2} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-semibold text-white sm:text-xl">"{ideaOfDay}"</p>
            <p className="mt-1 text-xs text-white/50">
              {language === 'es'
                ? 'Generado a partir del día del año.'
                : 'Generated from the day of the year.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" leftIcon={<FiHeart size={14} />}>
              {language === 'es' ? 'Favorito' : 'Favorite'}
            </Button>
            <Button variant="outline" size="sm" leftIcon={<FiBookmark size={14} />}>
              {language === 'es' ? 'Guardar' : 'Save'}
            </Button>
            <Button variant="primary" size="sm" leftIcon={<FiPlay size={14} />}>
              {language === 'es' ? 'Empezar a dibujar' : 'Start drawing'}
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
}
