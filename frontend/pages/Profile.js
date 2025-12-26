import { authService } from '../services/authService.js';
import { usuarioService } from '../services/usuarioService.js';
import { ProfileHeader } from '../components/profile/ProfileHeader.js';
import { ProfileBio } from '../components/profile/ProfileBio.js';
import { EditProfileModal } from '../components/modals/EditProfileModal.js';
import { Footer, setupFooterTheme } from '../components/layout/Footer.js';
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
import { setupStandardEvents } from '../logic/profileLogic.js';
import { likeService } from '../services/likeService.js';
import { SongCard } from '../components/cards/SongCard.js?v=profile';
import { renderSection } from '../components/logic/HomeRenderer.js';


/**
 * Renderiza la página de perfil del usuario.
 * @param {object} user El objeto de usuario actual.
 */
export function Profile(user) {
    // Si no se pasa usuario, intentar obtener el actual
    if (!user) {
        user = authService.getCurrentUser();
    }

    // Si aún no hay usuario, mostrar mensaje o redirigir
    if (!user) {
        return `<div class="text-center text-[var(--text-primary)] mt-10">
            <p class="mb-4">Debes iniciar sesión para ver tu perfil.</p>
            <a href="#/auth/login" class="text-[var(--accent-light)] hover:text-[var(--accent-hover)]">Iniciar sesión</a>
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
        </div>`;
    }

    const currentUser = authService.getCurrentUser();
    const isOwner = currentUser && currentUser.id_usuario === user.id_usuario;
    const isAdmin = authService.isAdmin();

    return `
        <div id="profile-container" class="w-full bg-[var(--bg-primary)] text-[var(--text-primary)] relative">
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
            <div id="profile-content">
                ${ProfileHeader(user, isOwner)}
                ${ProfileBio(user)}
                
                ${isOwner && isAdmin ? `
                    <div class="p-6 border-t border-gray-800">
                        <h3 class="text-xl font-bold mb-4">Gestión de Home Page</h3>
                        <div id="admin-home-config" class="space-y-4">
                            <p class="text-[var(--text-muted)]">Cargando configuración...</p>
                        </div>
                        
                        <form id="add-category-form" class="mt-6 bg-[var(--bg-secondary)] p-4 rounded-lg hidden">
                            <h4 class="font-bold mb-2">Añadir Nueva Categoría</h4>
                            <div class="grid grid-cols-2 gap-4">
                                <input type="text" name="titulo" placeholder="Título (ej: Rock 90s)" class="form-input bg-[var(--bg-tertiary)] border-none" required>
                                <input type="text" name="valor" placeholder="Hashtag (ej: rock)" class="form-input bg-[var(--bg-tertiary)] border-none" required>
                            </div>
                            <div class="grid grid-cols-2 gap-4 mt-2">
                                <select name="tipo" class="form-input bg-[var(--bg-tertiary)] border-none">
                                    <option value="hashtag">Hashtag</option>
                                    <option value="static">Estático (top_likes, recent)</option>
                                </select>
                                <input type="number" name="orden" placeholder="Orden" class="form-input bg-[var(--bg-tertiary)] border-none" value="99">
                            </div>
                            <button type="submit" class="mt-2 btn-primary py-1 px-4 text-sm">Añadir</button>
                        </form>
                        <button id="btn-toggle-add-cat" class="mt-4 text-sm text-[var(--accent-light)] hover:text-[var(--accent-hover)]">+ Nueva Categoría</button>
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
                    </div>
                ` : ''}

                ${EditProfileModal(user)}
                
                ${Footer()}
            </div>
            <div id="profile-loader" class="hidden absolute inset-0 flex items-center justify-center bg-[var(--bg-primary)] z-50">
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
                <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        </div>
    `;
}

export function attachProfileEvents() {
    const container = document.getElementById('profile-container');
    if (!container) return;

    // Force Header to be Relative for this page
    const header = document.querySelector('header');
    if (header) {
        header.style.position = 'relative';
    }

    const currentUser = authService.getCurrentUser();
    if (!currentUser) return;

<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
    (async () => {
        try {
            // Re-fetch fresh data
            const [user, likedSongs] = await Promise.all([
                usuarioService.getProfile(currentUser.id_usuario, currentUser.id_usuario),
                likeService.getUserLikedSongs(currentUser.id_usuario)
            ]);
            renderProfileContent(user, likedSongs);
        } catch (error) {
            container.innerHTML = `<p class="text-red-500 text-center p-10">Error cargando perfil: ${error.message}</p>`;
        }
    })();

    function renderProfileContent(user, likedSongs = []) {
        const isOwner = true;
        const isAdmin = authService.isAdmin();

        const loader = document.getElementById('profile-loader');
        const content = document.getElementById('profile-content');

        if (loader) loader.classList.add('hidden');
        if (content) {
            content.classList.remove('hidden');

            // Render Songs Carousel
            let songsHtml = '';
            if (likedSongs.length > 0) {
                const likedSection = {
                    title: 'Canciones que me gustan',
                    type: 'liked',
                    id: 'profile-user',
                    songs: likedSongs
                };
                const likedIds = likedSongs.map(s => s.id_cancion);
                songsHtml = renderSection(likedSection, likedIds);
            } else {
                songsHtml = `<div class="p-6 border-t border-gray-800">
                    <h3 class="text-2xl font-bold text-white mb-6">Canciones que me gustan</h3>
                    <div class="text-center py-10 bg-gray-900/50 rounded-lg border border-gray-800 border-dashed">
                        <p class="text-gray-400">Aún no tienes canciones favoritas.</p>
                        <button onclick="window.navigate('/')" class="mt-2 text-indigo-400 hover:text-indigo-300 text-sm font-medium">Explorar música</button>
                   </div>
                   </div>`;
            }

            content.innerHTML = `
                ${ProfileHeader(user, isOwner, isAdmin)}
                ${ProfileBio(user)}
                
                <div class="p-6 border-t border-[var(--border-primary)]">
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
                    ${songsHtml}
                </div>

                ${EditProfileModal(user)}
                ${Footer()}
            `;

            setupStandardEvents(user, isOwner);
            setupFooterTheme();
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
        }
    }

}