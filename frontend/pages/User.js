import { usuarioService } from '../services/usuarioService.js';
import { ProfileHeader } from '../components/profile/ProfileHeader.js';
import { authService } from '../services/authService.js';
import { ProfileBio } from '../components/profile/ProfileBio.js';
import { Footer } from '../components/layout/Footer.js';

export function User(params) {
    const { id_usuario } = params || {};

    // Skeleton Loader structure
    return `
        <div id="user-profile-container" class="w-full bg-gray-900 text-white overflow-hidden relative min-h-[500px]" data-userid="${id_usuario}">
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
            const user = await usuarioService.getProfile(targetId, currentUser ? currentUser.id_usuario : null);
            renderUserContent(user);
        } catch (error) {
            container.innerHTML = `<p class="text-red-500 text-center p-10">Error: ${error.message}</p>`;
        }
    })();

    function renderUserContent(user) {
        const isAdmin = authService.isAdmin();
        // For User page, isOwner is generally false unless visiting own ID url, but even then we might want "User View"
        // But logic dictates: if id === me, it IS me.
        const isOwner = currentUser && currentUser.id_usuario == user.id_usuario;

        const loader = document.getElementById('user-loader');
        const content = document.getElementById('user-content');

        if (loader) loader.classList.add('hidden');
        if (content) {
            content.classList.remove('hidden');
            // We pass isOwner/isAdmin to header for consistency (e.g. admin editing)
            content.innerHTML = `
                ${ProfileHeader(user, isOwner, isAdmin)}
                ${ProfileBio(user)}
                ${Footer()}
            `;

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

            // Support Admin Edit on User Page
            if (isAdmin && !isOwner) {
                // Import logic dynamically or duplicate? 
                // Profile.js has a big 'setupStandardEvents' for editing.
                // We should probably factor that out if we want DRY, but for now allow duplicating the edit-modal logic
                // OR we can import 'attachProfileEvents' logic? No, too coupled.
                // Let's assume for this step user just wants VIEWING. 
                // "no quiero ver editar perfil a menos que YO sea admin"
                // If I am admin, I see the button (rendered by Header). I need the logic to open the modal.
                // I will duplicate the modal logic here briefly for safety and speed.
                setupEditLogic(user);
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

    function setupEditLogic(user) {
        // Re-use the existing modal in the DOM? 
        // The modal is currently injected by Profile.js. 
        // User.js needs to inject its own modal or assume one exists in layout?
        // Profile.js injects: ${EditProfileModal(authService.getCurrentUser())}
        // app.js root clears content. So we need to inject the modal here too.
        // Let's add the modal to HTML above.
    }
}
