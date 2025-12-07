import { authService } from '../services/authService.js';
import { getCancionesUsuario, createCancion, getHomeData, getCancion, updateCancion } from '../services/cancionService.js';
import { likeService } from '../services/likeService.js';
import { CONTENT_BASE_URL } from '../config.js';
import { DashboardHeader } from '../components/DashboardHeader.js';
import { SongCard } from '../components/SongCard.js?v=fixed';
import { NewSongModal } from '../components/NewSongModal.js';
import { EditSongModal } from '../components/EditSongModal.js';
import { FolderSidebar } from '../components/FolderSidebar.js';

export function Home() {
    const user = authService.getCurrentUser();

    // Init Logic moved to loadHomeContent called via setTimeout
    setTimeout(() => {
        loadHomeContent();
        setupEventListeners();
    }, 0);

    return `
        <div class="dashboard-container flex h-full w-full overflow-hidden">
            <!-- Sidebar -->
            ${FolderSidebar()}

            <div class="flex-1 flex flex-col h-full relative overflow-hidden">
                ${DashboardHeader(user)}
                
                <main class="flex-1 overflow-y-auto bg-gray-900 p-6 pb-24 scrollbar-hide">
                    <div id="loading-home" class="text-center py-10">
                        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                        <p class="mt-4 text-gray-500">Cargando música...</p>
                    </div>
                    
                    <div id="home-content" class="space-y-12">
                         <!-- Sections will be injected here -->
                    </div>
                </main>

                <!-- Fixed Bottom Floating Action Button -->
                <button id="btn-new-song" class="fixed bottom-8 right-8 z-50 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full h-14 transition-all duration-300 shadow-lg flex items-center justify-center overflow-hidden hover:pr-6 hover:pl-2 w-14 hover:w-auto group">
                    <svg class="w-8 h-8 flex-shrink-0 transition-transform duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                    <span class="font-bold whitespace-nowrap opacity-0 max-w-0 group-hover:opacity-100 group-hover:max-w-xs group-hover:ml-2 transition-all duration-500 ease-in-out">Nueva Canción</span>
                </button>
            </div>

            ${NewSongModal()}
            ${EditSongModal()}
        </div>
    `;
}

// Expose scroll helper to window
window.scrollContainer = (id, direction) => {
    const container = document.getElementById(id);
    if (container) {
        const scrollAmount = 600; // Scroll width of approx 3 cards
        container.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
    }
};

function renderSection(section, likedSongIds) {
    if (!section.songs || section.songs.length === 0) return '';

    const sectionId = `section-${section.type || 'custom'}-${section.id || Math.random().toString(36).substr(2, 9)}`;
    const cardsHtml = section.songs.map(song => {
        const isLiked = likedSongIds.includes(song.id_cancion);
        return SongCard(song, isLiked);
    }).join('');

    return `
        <section class="home-section animate-fade-in-up">
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-2xl font-bold text-white tracking-tight">${section.title}</h2>
            </div>
            
            <div class="relative group/carousel">
                <!-- Left Button -->
                <button onclick="window.scrollContainer('${sectionId}', -1)" 
                        class="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-30 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-black/80 backdrop-blur-sm hidden md:block">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
                </button>

                <!-- Swimlane container -->
                <div id="${sectionId}" class="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory scrollbar-hide scroll-smooth" style="-webkit-overflow-scrolling: touch;">
                    ${cardsHtml}
                </div>

                <!-- Right Button -->
                <button onclick="window.scrollContainer('${sectionId}', 1)"
                        class="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-30 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-black/80 backdrop-blur-sm hidden md:block">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                </button>
            </div>
        </section>
    `;
}

async function loadHomeContent() {
    const container = document.getElementById('home-content');
    const loading = document.getElementById('loading-home');

    try {
        const sections = await getHomeData();
        const user = authService.getCurrentUser();
        const likedSongIds = user ? await likeService.getUserLikes(user.id_usuario) : [];

        if (loading) loading.classList.add('hidden');
        if (container) {
            container.innerHTML = '';

            if (sections.length === 0) {
                container.innerHTML = '<p class="text-center text-gray-500">No hay contenido disponible.</p>';
                return;
            }

            sections.forEach(section => {
                const html = renderSection(section, likedSongIds);
                container.insertAdjacentHTML('beforeend', html);
            });
        }
    } catch (error) {
        console.error('Error loading home:', error);
        if (loading) loading.innerHTML = `<p class="text-red-500 text-center">Error al cargar contenido. Intenta recargar.</p>`;
    }
}

function setupEventListeners() {
    // === NEW SONG MODAL ===
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

    // Audio Duration Logic
    const audioInput = document.getElementById('audio-input');
    const dropZone = document.getElementById('drop-zone');

    if (audioInput) {
        audioInput.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (file) {
                // Update dropzone text
                if (dropZone) dropZone.querySelector('p').textContent = `Archivo: ${file.name}`;

                // Get Duration
                const audio = new Audio(URL.createObjectURL(file));
                audio.onloadedmetadata = function () {
                    const dur = Math.round(audio.duration);
                    document.getElementById('song-duration').value = dur;
                    console.log('Duration detected:', dur);
                };
            }
        });
    }

    // Drag & Drop
    if (dropZone && audioInput) {
        dropZone.addEventListener('click', () => audioInput.click());
        dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('bg-indigo-50'); });
        dropZone.addEventListener('dragleave', () => dropZone.classList.remove('bg-indigo-50'));
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('bg-indigo-50');
            if (e.dataTransfer.files.length) {
                audioInput.files = e.dataTransfer.files;
                // Trigger change manually to calc duration
                const event = new Event('change');
                audioInput.dispatchEvent(event);
            }
        });
    }

    // New Song Submit
    document.getElementById('new-song-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        try {
            btn.disabled = true;
            btn.textContent = 'Subiendo...';
            const formData = new FormData(e.target);
            const user = authService.getCurrentUser();
            if (user) formData.append('id_usuario', user.id_usuario);

            await createCancion(formData);
            closeModal();
            loadHomeContent();
            e.target.reset();
            if (dropZone) dropZone.querySelector('p').textContent = 'Arrastra audio...';
        } catch (error) {
            alert(error.message);
        } finally {
            btn.disabled = false;
            btn.textContent = originalText;
        }
    });


    // === EDIT SONG MODAL ===
    const editModal = document.getElementById('edit-song-modal');
    const btnCancelEdit = document.getElementById('btn-cancel-edit');
    const editForm = document.getElementById('edit-song-form');

    const closeEditModal = () => {
        const editContent = document.getElementById('edit-modal-content');
        editContent.classList.remove('scale-100', 'opacity-100');
        editContent.classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
            editModal.classList.add('hidden');
            editModal.classList.remove('flex');
        }, 300);
    };

    btnCancelEdit?.addEventListener('click', closeEditModal);

    window.openEditModal = async (id) => {
        try {
            const song = await getCancion(id);
            if (!song) throw new Error('No se pudo cargar la canción');
            document.getElementById('edit-id-cancion').value = song.id_cancion;
            document.getElementById('edit-titulo').value = song.titulo;
            document.getElementById('edit-artista').value = song.artista;
            document.getElementById('edit-album').value = song.album || '';
            document.getElementById('edit-nivel').value = song.nivel;
            document.getElementById('edit-duracion').value = song.duracion || 0;
            document.getElementById('edit-fecha').value = song.fecha_lanzamiento || '';

            // Image Preview Logic
            const preview = document.getElementById('edit-image-preview');
            const input = document.getElementById('edit-image-input');
            if (preview) {
                preview.src = song.ruta_imagen ? `${CONTENT_BASE_URL}/${song.ruta_imagen}` : 'assets/images/default-album.png';
            }
            if (input) input.value = ''; // Reset input

            const btnDetect = document.getElementById('btn-detect-duration');
            if (btnDetect) {
                btnDetect.dataset.url = song.ruta_mp3 ? `${CONTENT_BASE_URL}/${song.ruta_mp3}` : '';
                btnDetect.classList.toggle('hidden', !song.ruta_mp3);
            }

            let tags = song.hashtags;
            if (typeof tags === 'string') { try { tags = JSON.parse(tags); } catch (e) { tags = []; } }
            if (!Array.isArray(tags)) tags = [];
            document.getElementById('edit-hashtags').value = tags.join(', ');
            editModal.classList.remove('hidden');
            editModal.classList.add('flex');

            // Animate content
            const editContent = document.getElementById('edit-modal-content');
            setTimeout(() => {
                editContent.classList.remove('scale-95', 'opacity-0');
                editContent.classList.add('scale-100', 'opacity-100');
            }, 10);
        } catch (error) {
            alert('Error: ' + error.message);
        }
    };

    // Detect Duration Handler
    document.getElementById('btn-detect-duration')?.addEventListener('click', (e) => {
        const btn = e.currentTarget;
        const url = btn.dataset.url;
        if (!url) return alert('No hay archivo de audio asociado');

        const originalText = btn.innerHTML;
        btn.innerHTML = '...';
        btn.disabled = true;

        const audio = new Audio(url);
        audio.onloadedmetadata = () => {
            const duration = Math.round(audio.duration);
            document.getElementById('edit-duracion').value = duration;
            btn.innerHTML = originalText;
            btn.disabled = false;
        };
        audio.onerror = () => {
            alert('Error al cargar el audio para detectar duración');
            btn.innerHTML = originalText;
            btn.disabled = false;
        };
    });

    // Preview change listener (Adding check to avoid duplicate listeners if called multiple times, though setupEventListeners is usually once)
    const imgInput = document.getElementById('edit-image-input');
    // Remove old listener if any? Hard to do with anonymous functions. 
    // Ideally we assign a named function or ensure this is idempotent. 
    // For now, assigning onchange property is safer than addEventListener to prevent duplicates if re-run, 
    // but addEventListener is standard. setupEventListeners runs once per reload usually.
    if (imgInput) {
        imgInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (evt) => document.getElementById('edit-image-preview').src = evt.target.result;
                reader.readAsDataURL(file);
            }
        };
    }

    editForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData(editForm);
            // formData already includes files if input has distinct name
            formData.append('action', 'update');
            await updateCancion(formData);
            closeEditModal();
            loadHomeContent();
        } catch (error) {
            alert(error.message);
        }
    });



    // Global Player Navigation
    window.playSong = (id) => {
        if (window.navigate) window.navigate('/player/' + id);
        else window.location.hash = '/player/' + id;
    };

    // Global Like
    window.toggleLike = async (id, btn) => {
        const user = authService.getCurrentUser();
        if (!user) return alert('Inicia sesión');

        const svg = btn.querySelector('svg');
        const wasLiked = svg.classList.contains('text-red-500');

        if (wasLiked) {
            svg.classList.remove('text-red-500', 'opacity-100');
            svg.classList.add('text-black', 'opacity-50');
            svg.setAttribute('fill', 'none');
        } else {
            svg.classList.remove('text-black', 'opacity-50');
            svg.classList.add('text-red-500', 'opacity-100');
            svg.setAttribute('fill', 'currentColor');
        }

        try {
            await likeService.toggleLike(user.id_usuario, id);
        } catch (error) {
            if (wasLiked) {
                svg.classList.add('text-red-500', 'opacity-100');
                svg.classList.remove('text-black', 'opacity-50');
                svg.setAttribute('fill', 'currentColor');
            } else {
                svg.classList.add('text-black', 'opacity-50');
                svg.classList.remove('text-red-500', 'opacity-100');
                svg.setAttribute('fill', 'none');
            }
        }
    };
}
