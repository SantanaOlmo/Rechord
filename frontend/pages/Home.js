import { authService } from '../services/auth.js';
import { getCancionesUsuario, createCancion } from '../services/cancionService.js';
import { Player } from '../components/Player.js';
import { CONTENT_BASE_URL } from '../config.js';

let player; // Variable global al módulo para mantener la instancia del reproductor

export function Home() {
    const user = authService.getCurrentUser();

    // Programar la carga de datos y eventos para después del renderizado
    setTimeout(() => {
        loadSongs();
        setupEventListeners();

        // Inicializar Player si no existe
        if (!player) {
            player = new Player('global-player-container');
        }
    }, 0);

    return `
        <div class="dashboard-container">
            <!-- Header -->
            <div class="dashboard-header">
                <div class="header-content">
                    <div class="header-title">
                        <h1>Mis Proyectos</h1>
                        <p>Hola, ${user?.nombre || 'Usuario'}</p>
                    </div>
                    <div class="header-actions">
                        <button id="btn-new-song" class="btn-new-song">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                            Nueva Canción
                        </button>
                    </div>
                </div>
            </div>

            <!-- Content -->
            <main class="dashboard-main">
                <!-- Loading State -->
                <div id="loading-songs" class="loading-state">
                    <svg class="animate-spin h-10 w-10 text-indigo-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <p class="text-gray-400">Cargando tus canciones...</p>
                </div>

                <!-- Empty State -->
                <div id="empty-state" class="empty-state hidden">
                    <div class="empty-icon">
                        <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path></svg>
                    </div>
                    <h3 class="text-xl font-medium text-white mb-2">No tienes canciones aún</h3>
                    <p class="text-gray-400 mb-6">Sube tu primera canción para empezar a sincronizar acordes.</p>
                    <button onclick="document.getElementById('btn-new-song').click()" class="link-primary">Crear mi primera canción &rarr;</button>
                </div>

                <!-- Grid de Canciones -->
                <div id="songs-grid" class="songs-grid hidden">
                    <!-- Las tarjetas se insertarán aquí -->
                </div>
            </main>

            <!-- Modal Nueva Canción -->
            <div id="new-song-modal" class="modal-overlay hidden">
                <div class="modal-content" id="modal-content">
                    <h3 class="modal-title">Nueva Canción</h3>
                    <form id="new-song-form" class="space-y-4">
                        <div class="form-group">
                            <label class="form-label">Título</label>
                            <input type="text" name="titulo" required class="form-input" placeholder="Ej: Wonderwall">
                        </div>
                        
                        <div class="grid grid-cols-2 gap-4">
                            <div class="form-group">
                                <label class="form-label">Artista</label>
                                <input type="text" name="artista" required class="form-input" placeholder="Ej: Oasis">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Nivel</label>
                                <select name="nivel" class="form-input">
                                    <option value="Principiante">Principiante</option>
                                    <option value="Intermedio">Intermedio</option>
                                    <option value="Avanzado">Avanzado</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Archivo de Audio (MP3, WAV, OGG)</label>
                            <div id="drop-zone" class="drop-zone border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200">
                                <input type="file" name="audio_file" accept=".mp3,.wav,.ogg" required class="hidden">
                                <p class="text-gray-400">Arrastra tu archivo de audio aquí o haz clic para seleccionar</p>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Portada (Opcional)</label>
                            <input type="file" name="image_file" accept="image/*" class="form-input file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100">
                        </div>

                        <div class="modal-actions">
                            <button type="button" id="btn-cancel-modal" class="btn-cancel">Cancelar</button>
                            <button type="submit" class="btn-primary" style="width: auto;">Crear Canción</button>
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
    grid.innerHTML = songs.map(song => {
        // Construir URL completa de la imagen si existe
        const imageUrl = song.ruta_imagen
            ? `${CONTENT_BASE_URL}/${song.ruta_imagen}`
            : null;

        return `
        <div class="song-card group">
            <div class="card-image">
                ${imageUrl
                ? `<img src="${imageUrl}" alt="${song.titulo}" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition">`
                : `<svg class="w-12 h-12 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path></svg>`
            }
                
                <!-- Play Overlay -->
                <div class="play-overlay" onclick="playSong(${song.id_cancion})">
                    <div class="play-icon-circle">
                        <svg class="w-6 h-6 text-indigo-600 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                </div>
            </div>
            
            <div class="card-content">
                <h3 class="song-title" title="${song.titulo}">${song.titulo}</h3>
                <p class="song-artist" title="${song.artista}">${song.artista || 'Artista desconocido'}</p>
                
                <div class="card-footer">
                    <span class="song-meta">4/4 • 120 BPM</span>
                    <a href="#/songeditor/${song.id_cancion}" onclick="window.navigate('/songeditor/${song.id_cancion}'); return false;" class="btn-edit">
                        Editar <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    </a>
                </div>
            </div>
        </div>
    `}).join('');

    // Exponer función global para el onclick
    window.playSong = (id) => {
        const song = songs.find(s => s.id_cancion === id);
        if (song && player) {
            player.loadSong(song);
        }
    };
}

function setupEventListeners() {
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

    // Drag & Drop Logic
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.querySelector('input[name="audio_file"]');

    if (dropZone && fileInput) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, unhighlight, false);
        });

        function highlight(e) {
            dropZone.classList.add('border-indigo-500', 'bg-indigo-50');
        }

        function unhighlight(e) {
            dropZone.classList.remove('border-indigo-500', 'bg-indigo-50');
        }

        dropZone.addEventListener('drop', handleDrop, false);

        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;

            if (files.length > 0) {
                fileInput.files = files;
                // Visual feedback
                const fileName = files[0].name;
                dropZone.querySelector('p').textContent = `Archivo seleccionado: ${fileName}`;
            }
        }

        // Also update text when selecting via click
        fileInput.addEventListener('change', () => {
            if (fileInput.files.length > 0) {
                dropZone.querySelector('p').textContent = `Archivo seleccionado: ${fileInput.files[0].name}`;
            }
        });
    }

    // Form Submit
    document.getElementById('new-song-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button[type="submit"]');
        const originalText = btn.textContent;

        try {
            btn.disabled = true;
            btn.textContent = 'Subiendo...';

            const formData = new FormData(e.target);

            // Append user ID
            const user = authService.getCurrentUser();
            if (user && user.id_usuario) {
                formData.append('id_usuario', user.id_usuario);
            } else {
                throw new Error('Usuario no identificado. Recarga la página.');
            }

            await createCancion(formData);

            closeModal();
            loadSongs(); // Reload list
            e.target.reset();
            if (dropZone) dropZone.querySelector('p').textContent = 'Arrastra tu archivo de audio aquí o haz clic para seleccionar';
        } catch (error) {
            console.error(error);
            alert(error.message || 'Error al subir la canción');
        } finally {
            btn.disabled = false;
            btn.textContent = originalText;
        }
    });
}