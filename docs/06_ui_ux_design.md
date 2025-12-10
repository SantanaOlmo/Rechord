[ Volver al �ndice](index.md)

# UI/UX y Diseño

El diseño de Rechordb busca una estética moderna, oscura y enfocada en el contenido musical, inspirada en plataformas líderes como Spotify.

## 🎨 Sistema de Diseño

### Paleta de Colores
*   **Fondo Principal**: `bg-gray-900` (Casi negro, ideal para reducir fatiga visual).
*   **Fondo Secundario**: `bg-gray-800` (Paneles, tarjetas, modales).
*   **Acento**: `Indigo-600` a `Indigo-500` (Botones primarios, enlaces activos, branding).
*   **Texto**: 
    *   Primario: `text-white`
    *   Secundario: `text-gray-400`

### Tipografía
Se utiliza la fuente del sistema (sans-serif) optimizada por Tailwind, priorizando legibilidad a tamaños pequeños y peso visual en encabezados.

## 🛠️ Framework CSS: Tailwind CSS

Utilizamos Tailwind CSS via CDN (para desarrollo rápido) o compilado. Esto permite:
1.  **Utilidades**: Construcción rápida de layouts sin escribir CSS personalizado.
2.  **Consistencia**: Espaciados y colores estandarizados.
3.  **Responsive**: Diseño adaptable a móviles (Mobile First) y escritorio usando prefijos `md:`, `lg:`.

## 🧩 Componentes Clave

### Barra Lateral (Sidebar)
*   **Redimensionable**: El usuario puede arrastrar el borde para ajustar el ancho.
*   **Persistente**: El estado de anchura se guarda en `localStorage`.

### Reproductor (PlayerBar)
*   Fijo en la parte inferior (`fixed bottom-0`).
*   Controles centralizados.
*   Barra de progreso interactiva (Seek).

### Modales
*   Centrados en pantalla con `backdrop-blur`.
*   Animaciones de entrada (fade-in, scale-up) para una sensación premium.

[⬅️ Volver al Índice](index.md)

