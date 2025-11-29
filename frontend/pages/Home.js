import { authService } from '../services/auth.js';
import { getCancionesUsuario, createCancion } from '../services/cancionService.js';
import { Player } from '../components/Player.js';

let player = null;

export function Home() {
    // Verificar autenticación
    if (!authService.isAuthenticated()) {
        if (window.navigate) window.navigate('/auth/login');
        else window.location.hash = '#/auth/login';
        return '';
    }

    const user = authService.getCurrentUser();

    // Inicializar lógica después de renderizar
    setTimeout(() => {
        loadSongs();
        setupEventListeners();

        // Inicializar Player si no existe
        if (!player) {
            player = new Player('global-player-container');
        }
    }, 0);

    return `
        <div class="min-h-screen bg-gray-900 pb-24">
            <!-- Header -->
            <div class="bg-gray-800 shadow-lg border-b border-gray-700">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
                    <div>
                        <h1 class="text-2xl font-bold text-white">Mis Proyectos</h1>
                        <p class="text-gray-400 text-sm">Hola, ${user?.nombre || 'Usuario'}</p>
                    </div>
                    <div class="flex gap-4">
                        <button id="btn-new-song" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition shadow-lg hover:shadow-indigo-500/30">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                            Nueva Canción
                        </button>
                        <button id="btn-logout" class="bg-gray-700 hover:bg-gray-600 text-gray-300 px-4 py-2 rounded-lg transition">
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>

            <!-- Content -->
            <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <!-- Loading State -->
                <div id="loading-songs" class="text-center py-12">
                    <svg class="animate-spin h-10 w-10 text-indigo-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <p class="text-gray-400">Cargando tus canciones...</p>
                </div>

                <!-- Empty State -->
                <div id="empty-state" class="hidden text-center py-16 bg-gray-800 rounded-xl border-2 border-dashed border-gray-700">
                    <div class="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path></svg>
                    </div>
                    <h3 class="text-xl font-medium text-white mb-2">No tienes canciones aún</h3>
                    <p class="text-gray-400 mb-6">Sube tu primera canción para empezar a sincronizar acordes.</p>
                    <button onclick="document.getElementById('btn-new-song').click()" class="text-indigo-400 hover:text-indigo-300 font-medium">Crear mi primera canción &rarr;</button>
                </div>

                <!-- Grid de Canciones -->
                <div id="songs-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 hidden">
                    <!-- Las tarjetas se insertarán aquí -->
                </div>
            </main>

            <!-- Modal Nueva Canción -->
            <div id="new-song-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50 backdrop-blur-sm">
                <div class="bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl border border-gray-700 transform transition-all scale-95 opacity-0" id="modal-content">
                    <h3 class="text-xl font-bold text-white mb-4">Nueva Canción</h3>
                    <form id="new-song-form" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-1">Título</label>
                            <input type="text" name="titulo" required class="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-1">Artista</label>
                            <input type="text" name="artista" class="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-1">Archivo de Audio (MP3)</label>
                            <input type="file" name="archivo" accept="audio/mp3" required class="w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700">
                        </div>
                        <div class="flex justify-end gap-3 mt-6">
                            <button type="button" id="btn-cancel-modal" class="px-4 py-2 text-gray-300 hover:text-white transition">Cancelar</button>
                            <button type="submit" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-lg transition">Crear Canción</button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Contenedor Global del Player -->
            <div id="global-player-container"></div>
        </div>
    `;
}

async function loadSongs() {
    const grid = document.getElementById('songs-grid');
    const loading = document.getElementById('loading-songs');
    const empty = document.getElementById('empty-state');

    try {
        const songs = await getCancionesUsuario();

        loading.classList.add('hidden');

        if (songs.length === 0) {
            empty.classList.remove('hidden');
            grid.classList.add('hidden');
        } else {
            empty.classList.add('hidden');
            grid.classList.remove('hidden');
            renderSongs(songs);
        }
    } catch (error) {
        console.error('Error loading songs:', error);
        loading.innerHTML = `<p class="text-red-500">Error al cargar canciones. Intenta recargar.</p>`;
    }
}

function renderSongs(songs) {
    const grid = document.getElementById('songs-grid');
    grid.innerHTML = songs.map(song => `
        <div class="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 hover:border-indigo-500 transition group">
            <div class="h-32 bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center relative">
                <svg class="w-12 h-12 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path></svg>
                
                <!-- Play Overlay -->
                <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onclick="playSong(${song.id_cancion})">
                    <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg transform scale-0 group-hover:scale-100 transition-transform">
                        <svg class="w-6 h-6 text-indigo-600 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                </div>
            </div>
            
            <div class="p-5">
                <h3 class="text-lg font-bold text-white truncate" title="${song.titulo}">${song.titulo}</h3>
                <p class="text-gray-400 text-sm mb-4 truncate">${song.artista || 'Artista desconocido'}</p>
                
                <div class="flex justify-between items-center">
                    <span class="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded">4/4 • 120 BPM</span>
                    <a href="#/songeditor/${song.id_cancion}" onclick="window.navigate('/songeditor/${song.id_cancion}'); return false;" class="text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center gap-1">
                        Editar <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    </a>
                </div>
            </div>
        </div>
    `).join('');

    // Exponer función global para el onclick (chapuza temporal, idealmente usar eventos delegados)
    window.playSong = (id) => {
        const song = songs.find(s => s.id_cancion === id);
        if (song && player) {
            player.loadSong(song);
        }
    };
}

function setupEventListeners() {
    // Logout
    document.getElementById('btn-logout')?.addEventListener('click', () => {
        authService.logout();
    });

    // Modal Logic
    const modal = document.getElementById('new-song-modal');
    const modalContent = document.getElementById('modal-content');
    const btnNew = document.getElementById('btn-new-song');
    const btnCancel = document.getElementById('btn-cancel-modal');

    const openModal = () => {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        setTimeout(() => {
            modalContent.classList.remove('scale-95', 'opacity-0');
            modalContent.classList.add('scale-100', 'opacity-100');
        }, 10);
    };

    const closeModal = () => {
        modalContent.classList.remove('scale-100', 'opacity-100');
        modalContent.classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }, 300);
    };

    btnNew?.addEventListener('click', openModal);
    btnCancel?.addEventListener('click', closeModal);

    // Form Submit
    document.getElementById('new-song-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button[type="submit"]');
        const originalText = btn.textContent;

        try {
            btn.disabled = true;
            btn.textContent = 'Subiendo...';

            const formData = new FormData(e.target);
            await createCancion(formData);

            closeModal();
            loadSongs(); // Reload list
            e.target.reset();
        } catch (error) {
            alert(error.message);
        } finally {
            btn.disabled = false;
            btn.textContent = originalText;
        }
    });
}