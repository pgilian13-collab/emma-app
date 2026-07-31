import type { AppLanguage } from '@app-types/index';

export function formatTime(date: Date = new Date(), language: AppLanguage = 'es'): string {
  return date.toLocaleTimeString(language === 'es' ? 'es-ES' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function formatDate(date: Date = new Date(), language: AppLanguage = 'es'): string {
  return date.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatShortDate(date: Date = new Date(), language: AppLanguage = 'es'): string {
  return date.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function getGreeting(hour: number, language: AppLanguage = 'es'): string {
  if (language === 'en') {
    if (hour < 6) return 'Good night';
    if (hour < 12) return 'Good morning';
    if (hour < 19) return 'Good afternoon';
    return 'Good evening';
  }
  if (hour < 6) return 'Buenas noches';
  if (hour < 12) return 'Buenos días';
  if (hour < 19) return 'Buenas tardes';
  return 'Buenas noches';
}