import { state, actions } from '../store.js';

export function renderHeaders() {
    const container = document.getElementById('headers-container');
    if (!container) return;

    container.innerHTML = '';

    // Use state.trackOrder instead of hardcoded list
    state.trackOrder.forEach((key, index) => {
        const t = state.trackState[key];
        // Ensure state exists for key, if not, skip
        if (!t) return;

        let h = t.collapsed ? 'h-8' : 'h-24';
        let showToggle = true;

        // FIXED AUDIO TRACK
        if (key === 'audio') {
            h = 'h-12'; // 48px (Half of 96px)
            showToggle = false;
        }

        const div = document.createElement('div');
        div.className = `${h} track-header border-b border-gray-700 flex items-center px-4 transition-all duration-200 select-none justify-between group hover:bg-gray-700 bg-gray-800 cursor-grab active:cursor-grabbing`;
        div.draggable = true;

        // Drag Events
        div.ondragstart = (e) => {
            e.dataTransfer.setData('text/plain', index);
            div.classList.add('opacity-50');
        };
        div.ondragover = (e) => {
            e.preventDefault();
            div.classList.add('bg-gray-700');
        };
        div.ondragleave = (e) => {
            div.classList.remove('bg-gray-700');
            div.classList.remove('opacity-50');
        };
        div.ondrop = (e) => {
            e.preventDefault();
            div.classList.remove('bg-gray-700');
            div.classList.remove('opacity-50');
            const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'));
            if (sourceIndex !== index && !isNaN(sourceIndex)) {
                actions.moveTrack(sourceIndex, index);
            }
        };

        div.innerHTML = `
            <div class="flex items-center flex-1 gap-2 pointer-events-none">
                <!-- Drag Handle Icon -->
                <svg class="w-4 h-4 text-gray-600 group-hover:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16"></path></svg>
                <span class="font-bold ${t.color} ${t.collapsed ? 'text-xs' : ''}">${t.label}</span>
            </div>
            ${showToggle ? `
            <button class="text-gray-500 hover:text-white focus:outline-none p-1 rounded" onclick="event.stopPropagation(); window.triggerToggle('${key}')">
                <svg class="w-4 h-4 transform transition-transform ${t.collapsed ? '-rotate-90' : 'rotate-0'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </button>` : ''}
        `;

        // Only allow double click toggle for non-audio tracks
        if (showToggle) {
            div.ondblclick = () => actions.toggleTrack(key);
        }

        container.appendChild(div);
    });

    // Ensure global toggle is available
    window.triggerToggle = (key) => actions.toggleTrack(key);
}
