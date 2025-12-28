import { state } from '../store.js';

/**
 * Render a generic clip to a container.
 * @param {HTMLElement} container 
 * @param {Array} items data array
 * @param {string} type 'verse' or 'section'
 * @param {Function} getCoords callback(item) => {start, end}
 * @param {Function} renderContent callback(item, index) => html string for inner content
 * @param {Object} styleOptions { bg, ring, text } details
 */
export function renderClips(container, items, type, getCoords, renderContent, styleOptions) {
    if (!container) return;

    // 1. Map existing elements by index for reuse (Reconciliation)
    const existingMap = new Map();
    Array.from(container.children).forEach(child => {
        if (child.dataset.index) {
            existingMap.set(child.dataset.index, child);
        }
    });

    const usedIndices = new Set();

    items.forEach((item, index) => {
        const { start, end } = getCoords(item);
        const startPx = start * state.zoom;
        let durationSec = end - start;
        if (durationSec < 0.5) durationSec = 0.5;
        const widthPx = durationSec * state.zoom;

        const isSelected = state.selectedIndices.has(index) && (state.selectionType || 'verse') === type;
        const indexStr = String(index);
        usedIndices.add(indexStr);

        // Determine classes
        let baseClass = `absolute top-2 h-20 rounded text-xs overflow-hidden select-none cursor-pointer group transition-colors duration-75 shadow-sm flex flex-col justify-between z-20`;
        let themeClass = isSelected
            ? `bg-white ring-2 ring-inset ${styleOptions.ringSelected} ${styleOptions.textSelected} font-bold`
            : `${styleOptions.bg} ring-1 ring-inset ${styleOptions.ring} text-white ${styleOptions.hoverBg}`;

        const outputClass = `${baseClass} ${themeClass}`;
        const outputTransform = `translateX(${startPx}px)`;
        const outputWidth = `${widthPx}px`;

        let clip = existingMap.get(indexStr);

        if (clip) {
            // UPDATE existing element (Fast path)
            // Only touch DOM if changed
            if (clip.className !== outputClass) clip.className = outputClass;

            // Use transform for better performance (Composite layer)
            if (clip.style.transform !== outputTransform) clip.style.transform = outputTransform;
            if (clip.style.width !== outputWidth) clip.style.width = outputWidth;

            // Content
            const innerHTML = `
            ${renderContent(item, index)}
            ${isSelected ? `
            <div class="resize-handle left absolute top-0 bottom-0 left-0 w-3 cursor-ew-resize bg-transparent hover:bg-white/20 z-20 flex items-center justify-center group-hover:bg-white/5" data-handle="left">
                <div class="w-0.5 h-6 bg-white/30 rounded"></div>
            </div>
            <div class="resize-handle right absolute top-0 bottom-0 right-0 w-3 cursor-ew-resize bg-transparent hover:bg-white/20 z-20 flex items-center justify-center group-hover:bg-white/5" data-handle="right">
                 <div class="w-0.5 h-6 bg-white/30 rounded"></div>
            </div>` : ''}
            `;

            if (clip.innerHTML !== innerHTML) clip.innerHTML = innerHTML;

        } else {
            // CREATE new element (Slow path - first render only)
            clip = document.createElement('div');
            clip.className = outputClass;
            // Use transform instead of left
            clip.style.transform = outputTransform;
            // Optimization hint
            clip.style.willChange = 'transform, width';
            clip.style.left = '0'; // Reset left just in case
            clip.style.width = outputWidth;
            clip.dataset.index = indexStr;
            if (type !== 'verse') clip.dataset.clipType = type;

            clip.innerHTML = `
            ${renderContent(item, index)}
            ${isSelected ? `
            <div class="resize-handle left absolute top-0 bottom-0 left-0 w-3 cursor-ew-resize bg-transparent hover:bg-white/20 z-20 flex items-center justify-center group-hover:bg-white/5" data-handle="left">
                <div class="w-0.5 h-6 bg-white/30 rounded"></div>
            </div>
            <div class="resize-handle right absolute top-0 bottom-0 right-0 w-3 cursor-ew-resize bg-transparent hover:bg-white/20 z-20 flex items-center justify-center group-hover:bg-white/5" data-handle="right">
                 <div class="w-0.5 h-6 bg-white/30 rounded"></div>
            </div>` : ''}
            `;
            container.appendChild(clip);
        }
    });

    // 3. Cleanup unused elements (Garbage collection)
    existingMap.forEach((node, idx) => {
        if (!usedIndices.has(idx)) {
            node.remove();
        }
    });
}

export function renderVerses() {
    const track = document.getElementById('track-verses');
    renderClips(
        track,
        state.estrofas,
        'verse',
        (v) => ({ start: v.tiempo_inicio, end: v.tiempo_fin }),
        (v, i) => `
            <div class="w-full h-full p-2 flex flex-col pointer-events-none">
                <span class="font-bold mb-1 opacity-70 text-[10px] tracking-wide">Verso ${i + 1}</span>
                <span class="whitespace-nowrap overflow-hidden text-ellipsis font-medium" style="color: inherit;">${v.contenido}</span>
            </div>`,
        {
            bg: 'bg-indigo-600',
            ring: 'ring-indigo-400',
            hoverBg: 'hover:bg-indigo-500',
            ringSelected: 'ring-indigo-300',
            textSelected: 'text-indigo-600'
        }
    );
}

export function renderSections() {
    const track = document.getElementById('track-sections');
    if (!state.settings.songSections) return;

    renderClips(
        track,
        state.settings.songSections,
        'section',
        (s) => ({ start: s.start, end: s.end }),
        (s, i) => `
            <div class="w-full h-full p-2 flex flex-col pointer-events-none">
                <span class="font-bold mb-1 opacity-70 text-[10px] tracking-wide">Sección ${i + 1}</span>
                <span class="whitespace-nowrap overflow-hidden text-ellipsis font-medium" style="color: inherit;">${s.label || 'Sin Nombre'}</span>
            </div>`,
        {
            bg: 'bg-teal-600',
            ring: 'ring-teal-400',
            hoverBg: 'hover:bg-teal-500',
            ringSelected: 'ring-teal-300',
            textSelected: 'text-teal-700'
        }
    );
}
