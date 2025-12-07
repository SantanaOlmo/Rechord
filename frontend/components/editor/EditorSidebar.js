import { CONTENT_BASE_URL } from '../../config.js';

export function EditorSidebar(activeTab) {
    const user = JSON.parse(localStorage.getItem('user')) || {};
    const avatarUrl = user.foto_perfil ? `${CONTENT_BASE_URL}/${user.foto_perfil}` : 'assets/icons/profile.svg';

    return `
        <aside class="w-16 bg-gray-800 border-r border-gray-700 flex flex-col items-center py-4 z-30 justify-between">
            <div class="flex flex-col items-center space-y-4">
                <a href="#/" class="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-700 transition" title="Volver">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                </a>
                
                <button id="btn-search-tools" class="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-700 transition" title="Buscar Herramienta">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </button>
            </div>
            
            <div class="flex flex-col items-center space-y-6" id="sidebar-icons">
                ${renderSidebarIcon('chords', 'Guitarra', 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3', activeTab)}
                ${renderSidebarIcon('audio', 'Audio', 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3', activeTab, true)}
                ${renderSidebarIcon('lyrics', 'Letras', 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z', activeTab)}
                ${renderSidebarIcon('strumming', 'Rasgueo', 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z', activeTab)}
                ${renderSidebarIcon('settings', 'Ajustes', 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z', activeTab)}
            </div>

            <div class="flex flex-col items-center space-y-4">
                <a href="#/profile" class="block w-10 h-10 shrink-0 aspect-square rounded-full overflow-hidden border-2 border-transparent hover:border-green-500 transition" title="Mi Perfil">
                    <img src="${avatarUrl}" alt="Perfil" class="w-full h-full object-cover" onerror="this.src='assets/icons/profile.svg'">
                </a>
            </div>
        </aside>
    `;
}

function renderSidebarIcon(id, title, path, activeTab, isFilled = false) {
    const isActive = activeTab === id;
    const colorClass = isActive ? 'text-green-500' : 'text-gray-400 hover:text-white';
    const bgClass = isActive ? 'bg-gray-700' : 'hover:bg-gray-700';

    return `
        <button onclick="window.switchTab('${id}')" class="${colorClass} p-2 rounded-lg ${bgClass} transition relative group" title="${title}">
            <svg class="w-6 h-6" fill="${isFilled ? 'currentColor' : 'none'}" stroke="${isFilled ? 'none' : 'currentColor'}" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${path}"></path>
            </svg>
            ${isActive ? '<div class="absolute right-0 top-2 bottom-2 w-1 bg-green-500 rounded-l"></div>' : ''}
        </button>
    `;
}
