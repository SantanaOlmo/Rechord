import { usuarioService } from '../services/usuarioService.js';
import { ProfileHeader } from '../components/profile/ProfileHeader.js';
import { authService } from '../services/authService.js';
import { ProfileBio } from '../components/profile/ProfileBio.js';
import { Footer, setupFooterTheme } from '../components/layout/Footer.js';

import { likeService } from '../services/likeService.js';
import { SongCard } from '../components/cards/SongCard.js?v=profile';
import { renderSection } from '../components/logic/HomeRenderer.js';

export function User(params) {
    const { id_usuario } = params || {};

    // Skeleton Loader structure
    return `
        <div id="user-profile-container" class="w-full bg-gray-900 text-white overflow-hidden relative min-h-[500px] pt-24" data-userid="${id_usuario}">

            <div id="user-loader" class="absolute inset-0 flex items-center justify-center">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
            <div id="user-content" class="hidden">
                <!-- Content injected via JS -->
            </div>
        </div>
    `;
}

export function attachUserEvents() {
    const container = document.getElementById('user-profile-container');
    if (!container) return;

    const targetId = container.dataset.userid;
    const currentUser = authService.getCurrentUser();

    (async () => {
        try {
            if (!targetId) throw new Error("ID de usuario no especificado");

            const promises = [
                usuarioService.getProfile(targetId, currentUser ? currentUser.id_usuario : null),
                likeService.getUserLikedSongs(targetId)
            ];

            if (currentUser) {
                promises.push(likeService.getUserLikes(currentUser.id_usuario));
            }

            const results = await Promise.all(promises);
            const user = results[0];
            const likedSongs = results[1];
            const myLikedIds = results[2] || [];

            renderUserContent(user, likedSongs, myLikedIds);
        } catch (error) {
            container.innerHTML = `<p class="text-red-500 text-center p-10">Error: ${error.message}</p>`;
        }
    })();

    function renderUserContent(user, likedSongs = [], myLikedIds = []) {
        const isAdmin = authService.isAdmin();
        const isOwner = currentUser && currentUser.id_usuario == user.id_usuario;

        const loader = document.getElementById('user-loader');
        const content = document.getElementById('user-content');

        if (loader) loader.classList.add('hidden');
        if (content) {
            content.classList.remove('hidden');

            // Render Songs Carousel
            let songsHtml = '';
            if (likedSongs.length > 0) {
                const likedSection = {
                    title: 'Canciones que le gustan',
                    type: 'liked',
                    id: 'user-profile',
                    songs: likedSongs
                };
                songsHtml = renderSection(likedSection, myLikedIds);
            } else {
                songsHtml = `<div class="p-6 border-t border-gray-800">
                    <h3 class="text-2xl font-bold text-white mb-6">Canciones que le gustan</h3>
                    <div class="text-center py-10 bg-gray-900/50 rounded-lg border border-gray-800 border-dashed">
                        <p class="text-gray-400">Este usuario no tiene canciones favoritas públicas.</p>
                   </div>
                   </div>`;
            }

            content.innerHTML = `
                ${ProfileHeader(user, isOwner, isAdmin)}
                ${ProfileBio(user)}
                
                <div class="p-6 border-t border-gray-800">
                    ${songsHtml}
                </div>

                ${Footer()}
            `;

            // Re-apply theme logic after re-render
            setupFooterTheme();



            // Follow Logic
            // Note: ProfileHeader adds the button HTML if !isOwner.
            // We need to attach listeners here.
            const btnFollow = document.getElementById('btn-follow');
            if (btnFollow) {
                btnFollow.onclick = async () => {
                    if (!currentUser) return alert('Inicia sesión para seguir');
                    const isFollowing = btnFollow.textContent.trim() === 'Siguiendo';

                    try {
                        btnFollow.disabled = true;
                        if (isFollowing) {
                            await usuarioService.unfollow(currentUser.id_usuario, user.id_usuario);
                            btnFollow.textContent = 'Seguir';
                            btnFollow.classList.remove('bg-gray-700', 'hover:bg-gray-600');
                            btnFollow.classList.add('bg-indigo-600', 'hover:bg-indigo-700');
                            updateCounter('stat-followers', -1);
                        } else {
                            await usuarioService.follow(currentUser.id_usuario, user.id_usuario);
                            btnFollow.textContent = 'Siguiendo';
                            btnFollow.classList.remove('bg-indigo-600', 'hover:bg-indigo-700');
                            btnFollow.classList.add('bg-gray-700', 'hover:bg-gray-600');
                            updateCounter('stat-followers', 1);
                        }
                    } catch (e) {
                        alert(e.message);
                    } finally {
                        btnFollow.disabled = false;
                    }
                };
            }

        }
    }

    function updateCounter(id, change) {
        const el = document.getElementById(id);
        if (el) {
            let val = parseInt(el.textContent) || 0;
            el.textContent = Math.max(0, val + change);
        }
    }
}
