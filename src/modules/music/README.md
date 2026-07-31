# Módulo · Reproductor de Música

Reproductor completamente local.

**Estado:** pendiente de implementación.

Estructura prevista:

```
music/
├── components/   # PlayerBar, TrackList, NowPlaying, FilePicker
├── hooks/        # useAudioPlayer, usePlaylist
├── services/     # audioService, metadataService
├── types/        # Track, Playlist, PlaybackState
└── store/        # musicStore (Zustand con persistencia)
```
