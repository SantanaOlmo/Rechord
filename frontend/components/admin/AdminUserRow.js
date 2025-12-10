import { CONTENT_BASE_URL } from '../../config.js';
import { AdminEditUserForm } from './AdminEditUserForm.js';
import { AdminMessageUserForm } from './AdminMessageUserForm.js';

export const AdminUserRow = {
    render: (user, { isExpanded, isEditing, isMessaging }) => {
        const avatarUrl = user.foto_perfil ? `${CONTENT_BASE_URL}/${user.foto_perfil}` : 'assets/icons/profile.svg';

        return `
            <div class="bg-gray-900 hover:bg-gray-800/80 transition-all duration-200 group border-l-4 ${isExpanded ? 'border-indigo-500' : 'border-transparent'}">
                <!-- Summary Row -->
                <div class="flex items-center p-4 cursor-pointer" data-action="toggle-expand" data-id="${user.id_usuario}">
                    <div class="relative">
                        <img src="${avatarUrl}" class="w-10 h-10 rounded-full object-cover mr-4 bg-gray-800 pointer-events-none ring-2 ring-gray-800 group-hover:ring-indigo-500/50 transition-all">
                        ${user.rol === 'admin' ? '<div class="absolute -top-1 -right-2 bg-purple-600 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold border border-gray-900">ADMIN</div>' : ''}
                    </div>
                    
                    <div class="flex-1 min-w-0 pointer-events-none">
                        <h3 class="text-white font-medium truncate flex items-center text-base">
                            ${user.nombre}
                        </h3>
                        <p class="text-gray-500 text-sm truncate flex items-center">
                            <span class="truncate">${user.email}</span>
                        </p>
                    </div>

                    <div class="flex items-center space-x-6 pointer-events-none mr-4">
                         <div class="hidden md:flex flex-col items-end text-right">
                            <span class="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Registrado</span>
                            <span class="text-gray-400 text-xs">${new Date(user.fecha_registro).toLocaleDateString()}</span>
                         </div>
                    </div>

                    <button class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 text-gray-500 group-hover:bg-gray-700 group-hover:text-white transition-all transform ${isExpanded ? 'rotate-180 bg-indigo-900/50 text-indigo-400' : ''}">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                </div>

                <!-- Expanded Details -->
                <div class="${isExpanded ? 'block' : 'hidden'} bg-gray-950/30 border-t border-gray-800/50 p-6 animate-fade-in-down">
                    ${isEditing
                ? AdminEditUserForm.render(user)
                : (isMessaging ? AdminMessageUserForm.render(user) : renderDetails(user))
            }
                </div>
            </div>
        `;
    }
};

function renderDetails(user) {
    return `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-2">
                 <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider">Biografía</label>
                 <div class="text-gray-300 text-sm leading-relaxed bg-gray-900/50 p-4 rounded-lg border border-gray-800/50 min-h-[80px]">
                    ${user.bio ? user.bio : '<span class="text-gray-600 italic">Este usuario no ha añadido una biografía.</span>'}
                 </div>
            </div>
            <div class="flex flex-col justify-between">
                <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Detalles Técnicos</label>
                    <div class="flex items-center justify-between bg-gray-900/50 p-3 rounded border border-gray-800/50 mb-4">
                        <span class="text-gray-400 text-sm">ID de Usuario</span>
                        <span class="font-mono text-indigo-400 font-bold">#${user.id_usuario}</span>
                    </div>
                </div>
                
                <div class="grid grid-cols-3 gap-3">
                    <button data-action="msg" data-id="${user.id_usuario}" 
                        class="flex flex-col items-center justify-center p-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-all border border-gray-700 hover:border-gray-600 group">
                        <svg class="w-5 h-5 mb-1 text-gray-400 group-hover:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                        <span class="text-xs font-medium">Mensaje</span>
                    </button>
                    <button data-action="edit" data-id="${user.id_usuario}" 
                        class="flex flex-col items-center justify-center p-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-all border border-gray-700 hover:border-gray-600 group">
                        <svg class="w-5 h-5 mb-1 text-gray-400 group-hover:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                        <span class="text-xs font-medium">Editar</span>
                    </button>
                     <button data-action="delete" data-id="${user.id_usuario}" 
                        class="flex flex-col items-center justify-center p-3 rounded-lg bg-gray-800 hover:bg-red-900/20 text-gray-300 hover:text-red-400 transition-all border border-gray-700 hover:border-red-900/30 group">
                        <svg class="w-5 h-5 mb-1 text-gray-400 group-hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        <span class="text-xs font-medium">Eliminar</span>
                    </button>
                </div>
            </div>
        </div>
    `;
}
