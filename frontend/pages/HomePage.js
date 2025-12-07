import { authService } from '../services/authService.js';
import { getHomeData } from '../services/cancionService.js';
import { likeService } from '../services/likeService.js';
import { SongCard } from '../components/SongCard.js?v=fixed';
import { NewSongModal } from '../components/NewSongModal.js';
import { EditSongModal } from '../components/EditSongModal.js';
import { FolderSidebar } from '../components/FolderSidebar.js';
import { Store } from '../core/StateStore.js';
import { socketService } from '../services/socketService.js';

// Logic Modules
import { initNewSongLogic } from '../components/logic/NewSongLogic.js';
import { initEditSongLogic } from '../components/logic/EditSongLogic.js';
import { renderSection } from '../components/logic/HomeRenderer.js';

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
                <!-- Header is now Global in app.js -->
                
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
    // Initialize Logic Modules
    initNewSongLogic(loadHomeContent);
    initEditSongLogic(loadHomeContent);

    // Global Player Navigation (could also be moved to a GlobalEventHandler)
    window.playSong = (id) => {
        const state = Store.getState();
        if (state.room && state.room.id) {
            socketService.send('UPDATE_PLAYBACK', {
                roomId: state.room.id,
                songId: id,
                stateAction: 'PLAY',
                position: 0
            });
            window.navigate('/player/' + id);
        } else {
            window.navigate('/player/' + id);
        }
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
