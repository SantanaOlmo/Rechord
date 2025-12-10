import { setupActionButtons, setupDragEvents } from './eventHandlers.js';

export function renderList(container, sections, editingId, actions) {
    if (sections.length === 0) {
        container.innerHTML = '<p class="text-gray-500">No hay categorías configuradas.</p>';
        return;
    }
    container.innerHTML = sections.map((s, index) => {
        if (s.id == editingId) {
            return renderEditRow(s);
        }

        const isStatic = s.type === 'static';
        let rawActive = s.activo ?? s.active;
        if (rawActive === undefined || rawActive === null) rawActive = 1;
        const isActive = parseInt(rawActive) === 1;

        return `
    <div class="draggable-item flex items-center justify-between bg-gray-800 p-3 rounded cursor-move hover:bg-gray-750 transition-colors mb-2 ${s.activo == 0 ? 'opacity-60' : ''}" 
            draggable="true" 
            data-index="${index}"
            data-id="${s.id}">
        <div class="flex items-center flex-1">
            <svg class="w-5 h-5 text-gray-500 mr-3 cursor-move" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            <div>
                <span class="font-bold block ${s.activo == 0 ? 'text-gray-500 line-through' : ''}">${s.title}</span>
                <span class="text-xs text-gray-400">(${s.type}: ${s.value})</span>
            </div>
        </div>
            <button class="btn-toggle-visibility text-gray-400 hover:text-white p-1" data-id="${s.id}" data-active="${s.activo}">
                ${isActive // Using the parsed isActive variable which defaults to 1
                ? '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>'
                : '<svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>'
            }
            </button>
            <button class="btn-edit-category text-indigo-400 hover:text-indigo-300 p-1" data-id="${s.id}">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
            </button>
            <button class="btn-delete-category text-red-400 hover:text-red-300 p-1" data-id="${s.id}">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
        </div>
    </div>
`}).join('');

    setupDragEvents(container, actions);
    setupActionButtons(container, actions);
}

export function renderEditRow(s) {
    const isStatic = s.type === 'static';
    return `
        <div class="bg-gray-800 p-4 rounded mb-2 border border-indigo-500 shadow-xl">
            <h4 class="text-white text-sm font-bold mb-3">Editar: ${s.title}</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <input type="text" id="edit-title-${s.id}" value="${s.title}" class="bg-gray-700 text-white rounded p-2 text-sm border border-gray-600 focus:border-indigo-500 outline-none" placeholder="Título">
                <input type="text" id="edit-value-${s.id}" value="${s.value}" ${isStatic ? 'disabled title="No editable en estático"' : ''} class="bg-gray-700 text-white rounded p-2 text-sm border border-gray-600 focus:border-indigo-500 outline-none ${isStatic ? 'opacity-50 cursor-not-allowed' : ''}" placeholder="Valor/Hashtag">
            </div>
            <div class="grid grid-cols-1 gap-3 mb-4">
                 <select id="edit-type-${s.id}" ${isStatic ? 'disabled' : ''} class="bg-gray-700 text-white rounded p-2 text-sm border border-gray-600 outline-none w-full ${isStatic ? 'opacity-50 cursor-not-allowed' : ''}">
                    <option value="hashtag" ${s.type === 'hashtag' ? 'selected' : ''}>Hashtag</option>
                    <option value="static" ${s.type === 'static' ? 'selected' : ''}>Estático</option>
                </select>
            </div>
            <div class="flex justify-end gap-2">
                <button class="btn-cancel-edit bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors" data-id="${s.id}">
                    Cancelar
                </button>
                <button class="btn-save-edit bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded text-xs font-medium transition-colors shadow-lg" data-id="${s.id}">
                    Guardar
                </button>
            </div>
        </div>
    `;
}
