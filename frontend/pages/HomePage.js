import { authService } from '../services/authService.js';
import { getCancionesUsuario, createCancion } from '../services/cancionService.js';
import { likeService } from '../services/likeService.js';
import { CONTENT_BASE_URL } from '../config.js';
import { DashboardHeader } from '../components/DashboardHeader.js';
import { SongGrid } from '../components/SongGrid.js';
import { SongCard } from '../components/SongCard.js';
import { NewSongModal } from '../components/NewSongModal.js';

export function Home() {
    const user = authService.getCurrentUser();

    // Programar la carga de datos y eventos para después del renderizado
    setTimeout(() => {
        loadSongs();
        setupEventListeners();
    }, 0);

    return `
        <div class="dashboard-container">
            ${DashboardHeader(user)}

            <main class="dashboard-main">
                ${SongGrid()}
            </main>

            ${NewSongModal()}
        </div>
    `;
}

async function loadSongs() {
    const grid = document.getElementById('songs-grid');
    const loading = document.getElementById('loading-songs');
    const empty = document.getElementById('empty-state');

    try {
        const songs = await getCancionesUsuario();
        const user = authService.getCurrentUser();
        const likedSongIds = user ? await likeService.getUserLikes(user.id_usuario) : [];

        loading.classList.add('hidden');

        if (songs.length === 0) {
            empty.classList.remove('hidden');
            grid.classList.add('hidden');
        } else {
            empty.classList.add('hidden');
            grid.classList.remove('hidden');
            renderSongs(songs, likedSongIds);
        }
    } catch (error) {
        console.error('Error loading songs:', error);
        loading.innerHTML = `<p class="text-red-500">Error al cargar canciones. Intenta recargar.</p>`;
    }
}

function renderSongs(songs, likedSongIds = []) {
    const grid = document.getElementById('songs-grid');
    grid.innerHTML = songs.map(song => {
        const isLiked = likedSongIds.includes(song.id_cancion);
        return SongCard(song, isLiked);
    }).join('');

    // Exponer función global para el onclick
    window.playSong = (id) => {
        // Navegar a la página del reproductor inmersivo
        if (window.navigate) {
            window.navigate('/player/' + id);
        } else {
            window.location.hash = '/player/' + id;
        }
    };

    window.toggleLike = async (id, btn) => {
        const user = authService.getCurrentUser();
        if (!user) {
            alert('Debes iniciar sesión para dar like.');
            return;
        }

        // Optimistic UI update
        const svg = btn.querySelector('svg');
        const isCurrentlyLiked = svg.classList.contains('text-red-500');

        // Toggle visual state immediately
        if (isCurrentlyLiked) {
            svg.classList.remove('text-red-500', 'opacity-100');
            svg.classList.add('text-black', 'opacity-50');
            svg.setAttribute('fill', 'none');
            btn.title = 'Dar like';
        } else {
            svg.classList.remove('text-black', 'opacity-50');
            svg.classList.add('text-red-500', 'opacity-100');
            svg.setAttribute('fill', 'currentColor');
            btn.title = 'Quitar like';
        }

        try {
            await likeService.toggleLike(user.id_usuario, id);
            // Success - state already updated
        } catch (error) {
            console.error('Error toggling like:', error);
            // Revert on error
            if (isCurrentlyLiked) {
                svg.classList.add('text-red-500', 'opacity-100');
                svg.classList.remove('text-black', 'opacity-50');
                svg.setAttribute('fill', 'currentColor');
            } else {
                svg.classList.add('text-black', 'opacity-50');
                svg.classList.remove('text-red-500', 'opacity-100');
                svg.setAttribute('fill', 'none');
            }
            alert('Error al actualizar el like.');
        }
    };
}

function setupEventListeners() {
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