export function EditorToolsPanel(activeTab, estrofas, acordesDisponibles) {
    const title = getPanelTitle(activeTab);
    const content = renderPanelContent(activeTab, estrofas, acordesDisponibles);

    return `
        <aside class="w-64 bg-gray-800 border-r border-gray-700 flex flex-col z-10">
            <div class="p-4 border-b border-gray-700 bg-lime-500/20 flex justify-between items-center">
                <h2 class="text-lime-400 font-bold uppercase tracking-wider text-sm" id="sidebar-title">${title}</h2>
                <span class="text-xs text-green-400 hidden" id="auto-save-indicator">Guardado</span>
            </div>
            <div id="sidebar-panel-content" class="flex-1 overflow-y-auto p-4 space-y-2">
                ${content}
            </div>
        </aside>
    `;
}

function getPanelTitle(tab) {
    const titles = {
        'chords': 'Acordes',
        'lyrics': 'Letras',
        'strumming': 'Rasgueo',
        'settings': 'Ajustes'
    };
    return titles[tab] || 'Opciones';
}

function renderPanelContent(tab, estrofas, acordesDisponibles) {
    if (tab === 'chords') {
        return `<div id="chords-list" class="space-y-2">
            ${acordesDisponibles.map(acorde => `
                <div class="draggable-chord bg-gray-700 hover:bg-gray-600 p-2 rounded cursor-grab flex items-center justify-between mb-2 select-none"
                     draggable="true"
                     data-id="${acorde.id_acorde}"
                     data-name="${acorde.nombre}"
                     data-color="${acorde.color_hex || '#34d399'}">
                    <span class="font-bold text-white">${acorde.nombre}</span>
                    <div class="w-4 h-4 rounded-full" style="background-color: ${acorde.color_hex || '#34d399'}"></div>
                </div>
            `).join('')}
        </div>`;
    } else if (tab === 'lyrics') {
        if (!estrofas || estrofas.length === 0) {
            return `
                <div class="flex flex-col items-center justify-center h-full text-center p-4 space-y-4">
                    <div class="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center text-gray-400">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    </div>
                    <p class="text-gray-400 text-sm">No hay letras registradas.</p>
                    <textarea id="lyrics-input" class="w-full h-40 bg-gray-900 border border-gray-700 rounded p-2 text-sm text-white focus:border-green-500 outline-none resize-none" placeholder="Pega aquí las lyrics..."></textarea>
                </div>
            `;
        } else {
            return `
                <div class="space-y-4">
                    <p class="text-gray-400 text-xs text-center">Gestión de estrofas</p>
                    ${estrofas.map((e, i) => `
                        <div class="bg-gray-700 p-2 rounded text-xs text-gray-300 truncate cursor-pointer hover:bg-gray-600">
                            ${i + 1}. ${e.contenido.substring(0, 30)}...
                        </div>
                    `).join('')}
                    <button class="w-full border border-gray-600 text-gray-300 hover:text-white py-2 rounded text-sm transition">Editar Letras</button>
                </div>
            `;
        }
    } else if (tab === 'strumming') {
        return `<div class="text-gray-500 text-center mt-10">Patrones de rasgueo (Próximamente)</div>`;
    } else if (tab === 'settings') {
        return `<div class="text-gray-500 text-center mt-10">Ajustes del editor (Próximamente)</div>`;
    }
    return '';
}
