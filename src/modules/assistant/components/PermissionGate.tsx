import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@components/ui/Button';
import { FiCamera, FiShield, FiAlertTriangle, FiLock } from 'react-icons/fi';
import type { CameraErrorCode } from '@modules/assistant/types';

interface PermissionGateProps {
  status: 'idle' | 'requesting' | 'ready' | 'error';
  error: CameraErrorCode | null;
  onRequest: () => void;
  onRetry: () => void;
  language: 'es' | 'en';
  children: ReactNode;
}

const COPY = {
  es: {
    title: 'Asistencia para Dibujar',
    subtitle: 'Calca imágenes sobre tu cámara en tiempo real.',
    request: 'Activar cámara',
    requesting: 'Solicitando permiso…',
    readyNote: 'Cámara activa · toca los controles para ajustar el overlay.',
    errors: {
      'permission-denied': 'Permiso denegado. Permite el acceso a la cámara en tu navegador.',
      'not-found': 'No se detectó ninguna cámara compatible.',
      'not-readable': 'La cámara está siendo usada por otra aplicación.',
      'overconstrained': 'La configuración solicitada no es compatible con tu cámara.',
      'insecure-context': 'La cámara solo funciona en conexiones seguras (HTTPS o localhost).',
      unsupported: 'Tu navegador no soporta acceso a la cámara.',
      unknown: 'Ocurrió un error inesperado al iniciar la cámara.',
    } satisfies Record<CameraErrorCode, string>,
  },
  en: {
    title: 'Drawing Assistant',
    subtitle: 'Trace images over your camera in real time.',
    request: 'Enable camera',
    requesting: 'Requesting permission…',
    readyNote: 'Camera active · tweak the overlay using the controls.',
    errors: {
      'permission-denied': 'Permission denied. Allow camera access in your browser.',
      'not-found': 'No compatible camera was detected.',
      'not-readable': 'The camera is being used by another application.',
      'overconstrained': 'The requested settings are not supported by your camera.',
      'insecure-context': 'Camera access only works on secure connections (HTTPS or localhost).',
      unsupported: 'Your browser does not support camera access.',
      unknown: 'An unexpected error occurred while starting the camera.',
    } satisfies Record<CameraErrorCode, string>,
  },
} as const;

export function PermissionGate({
  status,
  error,
  onRequest,
  onRetry,
  language,
  children,
}: PermissionGateProps) {
  const t = COPY[language];

  if (status === 'ready') {
    return <>{children}</>;
  }

  if (status === 'error' && error) {
    const isPermission = error === 'permission-denied';
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="panel-card mx-auto flex max-w-xl flex-col items-center gap-4 p-8 text-center"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/15 text-red-300">
          {isPermission ? <FiLock size={24} /> : <FiAlertTriangle size={24} />}
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">{t.title}</h2>
          <p className="mt-2 text-sm text-white/70">{t.errors[error]}</p>
        </div>
        <Button variant="primary" onClick={onRetry} leftIcon={<FiCamera size={16} />}>
          {language === 'es' ? 'Reintentar' : 'Retry'}
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="panel-card mx-auto flex max-w-xl flex-col items-center gap-5 p-8 text-center"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-secondary text-white shadow-glow">
        <FiCamera size={28} />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-white">{t.title}</h2>
        <p className="mt-2 text-sm text-white/60">{t.subtitle}</p>
      </div>
      <ul className="grid w-full grid-cols-1 gap-2 text-left text-xs text-white/60 sm:grid-cols-2">
        <li className="flex items-start gap-2 rounded-lg bg-panel/60 px-3 py-2">
          <FiShield className="mt-0.5 shrink-0 text-primary-light" size={14} />
          <span>{language === 'es' ? 'Permiso solicitado solo en tu navegador.' : 'Permission is only requested locally.'}</span>
        </li>
        <li className="flex items-start gap-2 rounded-lg bg-panel/60 px-3 py-2">
          <FiCamera className="mt-0.5 shrink-0 text-primary-light" size={14} />
          <span>{language === 'es' ? 'Cámara trasera preferente.' : 'Back camera preferred.'}</span>
        </li>
      </ul>
      <Button
        variant="primary"
        size="lg"
        onClick={onRequest}
        leftIcon={<FiCamera size={18} />}
        disabled={status === 'requesting'}
      >
        {status === 'requesting' ? t.requesting : t.request}
      </Button>
    </motion.div>
  );
}