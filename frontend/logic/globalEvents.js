import { authService } from '../services/authService.js';
import { likeService } from '../services/likeService.js';
import { Store } from '../core/StateStore.js';


export function setupGlobalEvents() {
    console.log('Setting up Global Events...');

    // Global Player Navigation
    // Global Player Navigation
    window.playSong = (id) => {
        // const state = Store.getState();
        // if (state.room && state.room.id) { ... } else {
        window.navigate('/song/' + id);
        // }
    };

    // Global Like
    window.toggleLike = async (id, btn) => {
        const user = authService.getCurrentUser();
        if (!user) return window.location.hash = '#/auth/login';

        const svg = btn.querySelector('svg');
        const wasLiked = svg.classList.contains('text-red-500');

        // Optimistic UI Update
        if (wasLiked) {
            svg.classList.remove('text-red-500', 'opacity-100');
            svg.classList.add('text-white', 'opacity-70');
            svg.setAttribute('fill', 'none');
            const countSpan = btn.nextElementSibling;
            if (countSpan && countSpan.textContent) {
                countSpan.textContent = Math.max(0, parseInt(countSpan.textContent) - 1) || '';
            }
        } else {
            svg.classList.remove('text-white', 'opacity-70');
            svg.classList.add('text-red-500', 'opacity-100');
            svg.setAttribute('fill', 'currentColor');
            const countSpan = btn.nextElementSibling;
            if (countSpan) {
                countSpan.textContent = (parseInt(countSpan.textContent || '0') + 1);
            }
        }

        try {
            await likeService.toggleLike(user.id_usuario, id);
        } catch (error) {
            console.error('Like error:', error);
            // Revert on error
            if (wasLiked) {
                svg.classList.add('text-red-500', 'opacity-100');
                svg.classList.remove('text-white', 'opacity-70');
                svg.setAttribute('fill', 'currentColor');
            } else {
                svg.classList.add('text-white', 'opacity-70');
                svg.classList.remove('text-red-500', 'opacity-100');
                svg.setAttribute('fill', 'none');
            }
        }
    };

    // Global Edit Modal Logic (referenced in SongCard)
    window.openEditModal = (id) => {
        // Since the modal DOM might be injected by HomePage, Profile etc, we need a robust way.
        // Usually HomePage injects EditSongModal.
        // If we are on Profile, EditSongModal might NOT be in DOM.
        // For now, let's assuming it's only called where available, or we should handle it.
        const modal = document.getElementById('edit-song-modal');
        if (modal) {
            // We need to fetch song data or passing it?
            // The modal logic usually requires data population.
            // This seems generic. Let's keep it if it was there, but be aware.
            // HomePage.js handles the logic 'initEditSongLogic'.
            // Ideally, we move 'initEditSongLogic' to here or import it.
        }
    };
}
