# Mapa de UI del Sincronizador

Este documento sirve como referencia visual para nombrar los elementos de la interfaz.

## 1. Vista de Escritorio (PC/Tablet)

### Nivel Superior (High Level)
```mermaid
graph TD
    A[WINDOW / VIEWPORT]
    A --> B[HEADER SyncHeader]
    A --> C[MAIN WORKSPACE]
    A --> D[BOTTOM TIMELINE]

    C --> C1[EDITOR SIDEBAR SyncSidebar]
    C --> C2[DISPLAY AREA Active Verse Display]
    C --> C3[PLAYBACK BAR Song Info Controls]
```

### Nivel Detallado (Detailed)
```mermaid
graph TD
    subgraph Header [HEADER SyncHeader]
        H1[Btn Volver]
        H2[Titulo]
        H3[Btn Metrónomo]
        H4[Btn Guardar]
    end

    subgraph Main [MAIN WORKSPACE]
        subgraph Sidebar [EDITOR SIDEBAR]
            S1[Barra Nav: Letra, Acordes, Ajustes]
            S2[Panel Activo: Edición]
            S3[Botones]
        end

        subgraph Display [DISPLAY AREA]
            D1[Modo Letra: Verso Gigante]
            D2[Modo Acordes: Grid]
            D3[Ruler de Reproducción]
        end
    end

    subgraph Timeline [BOTTOM TIMELINE]
        T1[Time Ruler]
        T2[Vertical Icon Bar: Vistas]
        T3[Track Headers]
        T4[Tracks Container]
    end
```

---

## 2. Vista Móvil (< 820px)

### Nivel Superior (High Level)
> **Nota:** En móvil, el orden visual cambia para facilitar el flujo de trabajo:
> 1. **Editor Sidebar** (Arriba)
> 2. **Timeline** (Centro, altura reducida)
> 3. **Playback Bar / Display** (Abajo, desplegable)

```mermaid
graph TD
    A[WINDOW / VIEWPORT]
    A --> C[MAIN WORKSPACE]
    A --> D[BOTTOM TIMELINE]

    C --> C1[EDITOR SIDEBAR: Colapsable]
    C --> C2[DISPLAY AREA]
    
    D --> D1[TIMELINE CONTROLS]
    D --> D2[TRACKS AREA]
```

### Nivel Detallado (Detailed)
```mermaid
graph TD
    subgraph Main [MAIN WORKSPACE]
        subgraph Sidebar [EDITOR SIDEBAR]
            S1[Tabs de Navegación]
            S2[Area de Edición Input]
        end
        
        subgraph Display [DISPLAY AREA]
             D1[Verso Actual]
        end
        
        subgraph PB [PLAYBACK BAR]
             P1[Info Canción]
             P2[Btn Play/Pause]
        end
    end

    subgraph Timeline [BOTTOM TIMELINE]
        subgraph IconBar [VERTICAL ICON BAR]
            I1[Btn Guardar Mobile]
            I2[Btn Metrónomo Mobile]
            I3[Separador]
            I4[Btn Vista Beat]
            I5[Btn Vista Secciones]
        end

        T1[Track Headers]
        T2[Tracks Scroll Area]
    end
```

## Leyenda de Términos

| Término | Descripción |
| :--- | :--- |
| **Header** | Barra superior azul oscura con botón volver y guardar (Solo PC). |
| **Editor Sidebar** | Columna izquierda donde se pega la letra, se editan acordes o se ajustan secciones. |
| **Display Area** | Zona central grande donde se ve el verso actual gigante o la lista de acordes disponibles. |
| **Playback Bar** | Barra horizontal debajo del Display con la foto de la canción y el botón Play. |
| **Timeline** | Toda la zona inferior roja/negra donde están las pistas. |
| **Vertical Icon Bar** | Barra estrecha a la izquierda del Timeline. En móvil contiene Guardar y Metrónomo. |
| **Track Headers** | Columna izquierda del timeline con los nombres (Audio, Letra, Acordes...). |
| **Tracks Area** | Zona scrolleable derecha donde aparecen los bloques de colores. |
