export function EditorLyrics(estrofas, acordesSincronizados) {
    if (!estrofas || estrofas.length === 0) {
        return `
            <div id="lyrics-area" class="flex-1 overflow-y-auto p-8 text-center relative">
                <div id="lyrics-content" class="max-w-3xl mx-auto space-y-12 pb-64">
                    <p class="text-gray-500 mt-20">No hay letras. Añade estrofas primero.</p>
                </div>
            </div>
        `;
    }

    const content = estrofas.map(estrofa => {
        const duration = parseFloat(estrofa.tiempo_fin) - parseFloat(estrofa.tiempo_inicio);
        const hasTime = duration > 0;

        return `
            <div class="estrofa-block mb-12 p-4 rounded border border-transparent hover:border-gray-700 transition" 
                 data-id="${estrofa.id_estrofa}" 
                 data-start="${estrofa.tiempo_inicio}" 
                 data-end="${estrofa.tiempo_fin}">
                
                <div class="mb-4">
                    <p class="text-2xl font-medium text-white select-text whitespace-pre-line leading-relaxed">${estrofa.contenido}</p>
                </div>

                <!-- Mini Timeline Bar for this Estrofa -->
                ${hasTime ? `
                <div class="mini-timeline-container relative h-12 bg-gray-800/50 rounded border border-gray-600 w-full group">
                    <!-- Background Grid/Ruler hint -->
                    <div class="absolute inset-0 opacity-20 pointer-events-none" style="background-image: linear-gradient(to right, #555 1px, transparent 1px); background-size: 20% 100%;"></div>
                    
                    <!-- Chords Container -->
                    <div class="mini-timeline-tracks absolute inset-0 overflow-hidden" data-estrofa-id="${estrofa.id_estrofa}">
                        ${renderChordsForEstrofa(estrofa, acordesSincronizados)}
                    </div>

                    <!-- Time Label -->
                    <div class="absolute -top-3 right-0 text-xs text-gray-500 bg-gray-900 px-1 rounded">
                        ${parseFloat(estrofa.tiempo_inicio).toFixed(1)}s - ${parseFloat(estrofa.tiempo_fin).toFixed(1)}s
                    </div>
                </div>
                ` : `
                <div class="text-xs text-red-500">
                    Estrofa sin tiempo definido. Ajusta el tiempo en la vista de lista o arrastra en el timeline global.
                </div>
                `}
            </div>
        `;
    }).join('');

    return `
        <div id="lyrics-area" class="flex-1 overflow-y-auto p-8 text-center relative">
            <div id="lyrics-content" class="max-w-3xl mx-auto space-y-12 pb-64">
                ${content}
            </div>
        </div>
    `;
}

function renderChordsForEstrofa(estrofa, acordesSincronizados) {
    const start = parseFloat(estrofa.tiempo_inicio);
    const end = parseFloat(estrofa.tiempo_fin);
    const duration = end - start;

    if (duration <= 0) return '';

    // Filter chords that overlap with this estrofa
    const chords = acordesSincronizados.filter(c => {
        const cStart = parseFloat(c.tiempo_inicio);
        const cEnd = parseFloat(c.tiempo_fin);
        return (cStart < end && cEnd > start);
    });

    return chords.map(c => {
        const cStart = parseFloat(c.tiempo_inicio);
        const cEnd = parseFloat(c.tiempo_fin);

        // Calculate relative position in %
        const relStart = Math.max(0, (cStart - start) / duration) * 100;
        const relEnd = Math.min(100, (cEnd - start) / duration) * 100;
        const relWidth = relEnd - relStart;

        return `
            <div class="mini-chord-block absolute top-1 bottom-1 rounded shadow-sm flex items-center justify-center text-xs font-bold text-white cursor-pointer select-none overflow-hidden group/chord"
                 style="left: ${relStart}%; width: ${relWidth}%; background-color: ${c.color_hex || '#34d399'};"
                 data-id="${c.id_sincronia_acorde}"
                 data-start="${cStart}"
                 data-end="${cEnd}">
                ${c.nombre_acorde}
                
                <!-- Resize Handles -->
                <div class="absolute left-0 top-0 bottom-0 w-2 cursor-w-resize bg-black/20 hover:bg-white/50 opacity-0 group-hover/chord:opacity-100 transition-opacity handle-l"></div>
                <div class="absolute right-0 top-0 bottom-0 w-2 cursor-e-resize bg-black/20 hover:bg-white/50 opacity-0 group-hover/chord:opacity-100 transition-opacity handle-r"></div>
            </div>
        `;
    }).join('');
}
