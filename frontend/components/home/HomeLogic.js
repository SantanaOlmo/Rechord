import { authService } from '../../services/authService.js';
import { getHomeData } from '../../services/cancionService.js';
import { likeService } from '../../services/likeService.js';
import { renderSection } from '../logic/HomeRenderer.js';
import { initNewSongLogic } from '../logic/NewSongLogic.js';
import { initEditSongLogic } from '../logic/EditSongLogic.js';

export function setupHomeEventListeners() {
    initNewSongLogic(loadHomeContent);
    initEditSongLogic(loadHomeContent);
}


export async function loadHomeContent() {
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
                const rawActive = section.activo ?? section.active;
                const isActive = (rawActive === undefined || rawActive === null) ? 1 : parseInt(rawActive);

                if (isActive === 1) {
                    const html = renderSection(section, likedSongIds);
                    container.insertAdjacentHTML('beforeend', html);
                }
            });

            // Handle Persistence Scroll (Skip Hero)
            const hasSeenHero = sessionStorage.getItem('rechord_hero_seen');
            if (hasSeenHero) {
                setTimeout(() => {
                    const el = document.getElementById('home-content');
                    if (el) el.scrollIntoView({ behavior: 'auto' });
                }, 100);
            } else {
                sessionStorage.setItem('rechord_hero_seen', 'true');
            }
        }
    } catch (error) {
        console.error('Error loading home:', error);
        if (loading) loading.innerHTML = `<p class="text-red-500 text-center">Error al cargar contenido. Intenta recargar.</p>`;
    }
}
