import { PlayerControls } from '../components/player/PlayerControls.js';
import { versionService } from '../services/VersionService.js';
import { getCancion } from '../services/cancionService.js';
import { initPlayer } from '../components/player/PlayerController.js';
import { CONTENT_BASE_URL } from '../config.js';



import { attachKeyboardListeners } from '../components/synchronizer/events/keyboardEvents.js';


export function SongPage(songId) {
    // We initiate the player logic (audio, lyrics sync) but in a "sidebar mode"
    // This allows reusing the same controller logic.
    setTimeout(() => {
        initPlayer(songId);
        loadVersions(songId);
        attachKeyboardListeners();

    }, 0);

    return `
        <div class="song-page-container">
            
            <!-- Main Content Grid -->
            <div class="song-page-grid">
                
                <!-- Left Section: Hero & Versions -->
                <!-- Left Section: Hero & Versions -->
                <div class="main-content-wrapper" id="main-content-area">
                    
                    <!-- Scrollable Container -->
                    <div class="main-content-scroll">
                        
                        <!-- Hero Section -->
                        <div id="hero-section" class="hero-section">
                            <div class="hero-info">
                                <h1 id="song-title" class="hero-title">Cargando...</h1>
                                <p id="song-artist" class="hero-artist">...</p>
                            </div>
                        </div>

                        <!-- Versions List Section -->
                        <div class="versions-section">
                            <div class="versions-header">
                                <h2 class="versions-title">Versiones Disponibles</h2>
                            </div>

                            <div id="versions-list" class="versions-grid">
                                <!-- Versions injected here -->
                                <div class="col-span-full text-center py-10 opacity-50">Cargando versiones...</div>
                            </div>
                        </div>
                    </div>
                
                    <!-- Floating Create Version Button (FAB) inside Main Area Wrapper (Fixed) -->
                    <button onclick="alert('Funcionalidad de crear versión próximamente')" class="btn-animated-expand song-page-fab group">
                        <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                        <span class="text">Crear Versión</span>
                    </button>
                </div>

                <!-- Right Sidebar: Lyrics Preview -->
                <aside id="lyrics-sidebar" 
                       class="lyrics-sidebar group"
                       onclick="expandPlayer(${songId})">
                    
                    <div class="p-4 border-b border-[var(--border-primary)] flex justify-between items-center text-[var(--text-muted)]">

                        <span class="text-xs uppercase tracking-widest">Letra</span>
                        <div class="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-green-400 flex items-center gap-1">
                            Expandir <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg>
                        </div>
                    </div>

                    <!-- Lyrics Container -->
                    <div id="lyrics-container" class="flex-1 overflow-y-auto p-6 text-left text-lg text-[var(--text-secondary)] select-none relative mask-linear-y grid justify-center content-start scrollbar-hide">

                        <p class="mt-40">Cargando letra...</p>
                    </div>

                    <!-- Gradient Bottom -->
                    <div class="h-24 bg-gradient-to-t from-[var(--bg-primary)] to-transparent absolute bottom-0 inset-x-0 pointer-events-none"></div>

                    <!-- Sync Button (Hidden by default) -->
                    <button id="btn-sync-lyrics" 
                            class="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-[var(--accent-primary)] text-white px-4 py-2 rounded-full shadow-lg text-sm font-bold opacity-0 translate-y-4 transition-all duration-300 pointer-events-none z-20 flex items-center gap-2 hover:bg-[var(--accent-hover)]"

                            onclick="event.stopPropagation(); window.resyncLyrics()">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
                        Sincronizar
                    </button>
                </aside>

            </div>

             <!-- Bottom Player Controls (Sticky) -->
            <div class="shrink-0 z-50 bg-[var(--bg-secondary)] backdrop-blur-lg border-t border-[var(--border-primary)]">

                ${PlayerControls(songId, false)}
            </div>

        </div>
    `;
}

async function loadVersions(songId) {
    const list = document.getElementById('versions-list');
    const heroTitle = document.getElementById('song-title');
    const heroArtist = document.getElementById('song-artist');
    const heroSection = document.getElementById('hero-section');

    try {
        // Fetch song details for Hero
        const song = await getCancion(songId);
        if (song) {
            heroTitle.innerText = song.titulo;
            heroArtist.innerText = song.artista;

            if (song.ruta_imagen) {
                const imgPath = song.ruta_imagen.startsWith('http') ? song.ruta_imagen : `${CONTENT_BASE_URL}/${song.ruta_imagen}`;
                heroSection.style.backgroundImage = `url('${imgPath}')`;
            }
        }

        // Fetch Versions
        const versions = await versionService.getVersionsBySongId(songId);

        if (!versions || versions.length === 0) {
            list.innerHTML = `<div class="col-span-full text-center py-10 text-gray-500">No hay versiones creadas aún. ¡Sé el primero!</div>`;
            return;
        }

        list.innerHTML = versions.map((v, index) => `
            <div class="version-card group">
                <div class="absolute top-0 right-0 p-3 opacity-50 group-hover:opacity-100 text-yellow-400 font-bold text-sm">
                    ${index === 0 ? '★ TOP 1' : ''}
                </div>
                
                <div class="flex items-center gap-3 mb-3">
                    <img src="${v.usuario.foto_perfil || 'assets/icons/default_avatar.png'}" class="w-8 h-8 rounded-full border border-[var(--border-primary)]" alt="${v.usuario.nombre}">
                    <span class="text-sm text-[var(--text-secondary)]">por <span class="text-[var(--text-primary)] font-medium">${v.usuario.nombre}</span></span>
                </div>
                
                <h3 class="text-xl font-bold mb-1 text-[var(--text-primary)] group-hover:text-green-400 transition-colors">${v.titulo_version}</h3>
                <p class="text-xs text-[var(--text-muted)] mb-4">Creada el ${new Date(v.fecha_creacion).toLocaleDateString()}</p>
                
                <div class="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                    <span class="flex items-center gap-1"><svg class="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg> ${v.likes}</span>
                    <span class="bg-white/10 px-2 py-1 rounded hover:bg-white/20 text-[var(--text-primary)]">Ver Detalles</span>

                </div>
            </div>
        `).join('');

    } catch (e) {
        console.error("Error loading song page data", e);
    }
}

// Global function for transition interacton
window.expandPlayer = function (id) {
    // 1. Animate sidebar expanding to left
    const sidebar = document.getElementById('lyrics-sidebar');
    const mainContent = document.getElementById('main-content-area');

    if (sidebar && mainContent) {
        // Visual trick before navigation
        document.startViewTransition ? document.startViewTransition(() => {
            window.navigate('/player/' + id);
        }) : window.navigate('/player/' + id);
    } else {
        window.navigate('/player/' + id);
    }
};
