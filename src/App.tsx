import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@components/layout/Layout';
import { DashboardPage } from '@pages/DashboardPage';
import { IdeasPage } from '@pages/IdeasPage';
import { SettingsPage } from '@pages/SettingsPage';

const AssistantPage = lazy(() =>
  import('@pages/AssistantPage').then((module) => ({ default: module.AssistantPage })),
);
const MusicPage = lazy(() =>
  import('@pages/MusicPage').then((module) => ({ default: module.MusicPage })),
);
const ReferencesPage = lazy(() =>
  import('@pages/ReferencesPage').then((module) => ({ default: module.ReferencesPage })),
);

function PageFallback() {
  return (
    <div className="flex h-64 items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-primary" />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route
          path="assistant"
          element={
            <Suspense fallback={<PageFallback />}>
              <AssistantPage />
            </Suspense>
          }
        />
        <Route
          path="music"
          element={
            <Suspense fallback={<PageFallback />}>
              <MusicPage />
            </Suspense>
          }
        />
        <Route
          path="references"
          element={
            <Suspense fallback={<PageFallback />}>
              <ReferencesPage />
            </Suspense>
          }
        />
        <Route path="ideas" element={<IdeasPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;