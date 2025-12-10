import { CONTENT_BASE_URL } from '../../config.js';

export function ProfileHeader(user, isOwner, isAdmin) {
    const bannerUrl = user.banner
        ? `${CONTENT_BASE_URL}/${user.banner}`
        : 'assets/guitar.png';

    const avatarUrl = user.foto_perfil
        ? `${CONTENT_BASE_URL}/${user.foto_perfil}`
        : 'assets/icons/profile.svg';

    const statsHtml = `
        <div class="flex space-x-6 mt-2 text-sm">
            <div class="text-gray-300"><span class="font-bold text-white text-lg" id="stat-followers">${user.seguidores || 0}</span> seguidores</div>
            <div class="text-gray-300"><span class="font-bold text-white text-lg" id="stat-following">${user.seguidos || 0}</span> seguidos</div>
        </div>
    `;

    const canEdit = isOwner || isAdmin;

    return `
        <!-- Banner -->
        <div class="h-48 w-full bg-gray-800 relative group">
            <img src="${bannerUrl}" alt="Banner" class="w-full h-full object-cover opacity-80">
            <div class="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
            
            ${canEdit ? `
            <button id="btn-edit-banner" class="absolute top-4 right-4 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition duration-300" title="Cambiar Banner">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
            </button>
            ` : ''}
        </div>

        <!-- Profile Header (Avatar + Info) -->
        <div class="px-8 pb-8 relative">
            <div class="flex flex-col md:flex-row items-end -mt-12 mb-6">
                <!-- Avatar -->
                <div class="relative">
                    <img src="${avatarUrl}" alt="${user.nombre}" class="w-32 h-32 rounded-full border-4 border-gray-900 shadow-lg object-cover bg-gray-700">
                    ${canEdit ? `
                    <button id="btn-edit-avatar" class="absolute bottom-0 right-0 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full shadow-md transition transform hover:scale-110" title="Cambiar Avatar">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    </button>
                    ` : ''}
                </div>
                
                <div class="mt-4 md:mt-0 md:ml-6 flex-1">
                    <h2 class="text-4xl font-extrabold text-white">${user.nombre}</h2>
                    <p class="text-indigo-400 font-medium mb-1">${user.email}</p>
                    ${statsHtml}
                </div>

                <div class="mt-4 md:mt-0 flex gap-3">
                    ${!isOwner ? `
                        <button id="btn-follow" data-id="${user.id_usuario}" class="flex items-center font-bold py-2 px-6 rounded-full transition duration-150 shadow-md ${user.es_seguido ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}">
                            ${user.es_seguido ? 'Siguiendo' : 'Seguir'}
                        </button>
                    ` : ''}

                    ${isOwner ? `
                    ${user.email === 'alberto16166@alumnos.ilerna.com' ? `
                    <a href="#/components"
                       class="flex items-center bg-gray-800 hover:bg-gray-700 text-indigo-400 font-bold py-2 px-4 rounded-lg transition duration-150 shadow-md border border-indigo-500/30">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                        UI Kit
                    </a>
                    ` : ''}
                    ` : ''}

                    ${canEdit ? `
                    <button id="btn-edit-profile"
                            class="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-150 shadow-md">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                        Editar Perfil
                    </button>
                    ` : ''}
                    
                    ${isOwner ? `
                    <button id="btn-logout-profile"
                            class="flex items-center bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition duration-150 shadow-md">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                        Salir
                    </button>
                    ` : ''}
                </div>
            </div>
    `;
}
