# EMMA · Tu espacio de trabajo creativo

Aplicación web para artistas tradicionales que dibujan en papel. Música, referencias, ideas y asistencia para calcar, todo en un solo lugar y 100% del lado del cliente.

## Stack

- React 19 + Vite 6 + TypeScript
- TailwindCSS 3 con tema personalizado
- React Router 7
- Zustand 5 (estado global con persistencia)
- Framer Motion 11 (animaciones)
- Fabric.js 6 (manipulación de imágenes)
- React Icons 5

## Scripts

```bash
npm install      # instalar dependencias
npm run dev      # servidor de desarrollo
npm run build    # build de producción
npm run preview  # previsualizar build
npm run lint     # typecheck
```

## Estructura

```
src/
├── App.tsx              # Router principal
├── main.tsx             # Bootstrap
├── index.css            # Estilos globales + Tailwind
│
├── components/          # Componentes compartidos
│   ├── layout/          # Layout, Sidebar, TopBar, ModulePlaceholder
│   └── ui/              # Button, Card, SectionTitle
│
├── hooks/               # Hooks reutilizables
│   ├── useClock.ts
│   └── useAccentColor.ts
│
├── modules/             # Módulos independientes
│   ├── assistant/       # Módulo 1: asistencia para dibujar
│   ├── music/           # Módulo 2: reproductor
│   ├── references/      # Módulo 3: referencias
│   └── ideas/           # Módulo 4: generador de ideas
│
├── pages/               # Páginas montadas en el router
│
├── store/               # Stores Zustand
│   ├── uiStore.ts
│   └── settingsStore.ts
│
├── types/               # Tipos compartidos
│
└── utils/               # Utilidades puras
    ├── cn.ts
    ├── date.ts
    ├── i18n.ts
    └── nav.ts
```

## Estado actual

- [x] Arquitectura base
- [x] Layout principal + Sidebar + TopBar
- [x] Dashboard con tarjetas, idea del día y resumen
- [x] Página de Configuración (tema, idioma, color, reset)
- [x] i18n ES / EN
- [x] Persistencia en LocalStorage
- [ ] Módulo 1 · Asistencia para Dibujar
- [ ] Módulo 2 · Reproductor de música
- [ ] Módulo 3 · Referencias
- [ ] Módulo 4 · Generador de ideas
