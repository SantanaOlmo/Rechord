import { authService } from '../services/authService.js';
import { CONTENT_BASE_URL } from '../config.js';

export function AdminDashboard() {
    setTimeout(loadDashboardData, 0);

    return `
        <div class="container mx-auto px-4 py-8">
            <h1 class="text-3xl font-bold mb-6 text-white">Panel de Administración</h1>

            <div class="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <div class="p-6 border-b border-gray-700">
                    <h2 class="text-xl font-semibold text-white">Gestión de Usuarios</h2>
                    <p class="text-gray-400 text-sm mt-1">Administra usuarios y accede a sus cuentas.</p>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-left text-gray-400">
                        <thead class="bg-gray-700 text-gray-200 uppercase text-xs">
                            <tr>
                                <th class="px-6 py-3">Usuario</th>
                                <th class="px-6 py-3">Email</th>
                                <th class="px-6 py-3">Rol</th>
                                <th class="px-6 py-3">Registro</th>
                                <th class="px-6 py-3">Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="users-table-body" class="divide-y divide-gray-700">
                            <tr>
                                <td colspan="5" class="px-6 py-4 text-center">Cargando usuarios...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

async function loadDashboardData() {
    const tableBody = document.getElementById('users-table-body');
    if (!tableBody) return;

    try {
        const users = await authService.getAllUsers();

        console.log("Usuarios cargados en Dashboard:", users); // DEBUG

        if (users.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" class="px-6 py-4 text-center">No se encontraron usuarios.</td></tr>';
            return;
        }

        const currentUser = authService.getCurrentUser();

        tableBody.innerHTML = users.map(user => {
            const isMe = currentUser && currentUser.id_usuario == user.id_usuario;
            const avatarUrl = user.foto_perfil ? `${CONTENT_BASE_URL}/${user.foto_perfil}` : 'assets/icons/default_avatar.png';

            // Log user.rol to see if it's coming correctly from backend
            // console.log(`User ${user.nombre} role:`, user.rol);

            return `
                <tr class="hover:bg-gray-750 transition-colors">
                    <td class="px-6 py-4 flex items-center gap-3">
                        <img src="${avatarUrl}" alt="${user.nombre}" class="w-8 h-8 rounded-full object-cover">
                        <span class="font-medium text-white">${user.nombre}</span>
                        ${isMe ? '<span class="ml-2 px-2 py-0.5 text-xs bg-green-900 text-green-300 rounded-full">Tú</span>' : ''}
                    </td>
                    <td class="px-6 py-4">${user.email}</td>
                    <td class="px-6 py-4">
                        <span class="px-2 py-1 text-xs rounded-full ${user.rol === 'admin' ? 'bg-purple-900 text-purple-300' : 'bg-gray-700 text-gray-300'}">
                            ${user.rol || 'user'}
                        </span>
                    </td>
                    <td class="px-6 py-4 text-sm">${user.fecha_registro || '-'}</td>
                    <td class="px-6 py-4">
                        ${!isMe ? `
                            <button onclick="window.impersonateUser(${user.id_usuario})" 
                                class="text-indigo-400 hover:text-indigo-300 hover:underline text-sm font-medium transition-colors">
                                Simular Sesión
                            </button>
                        ` : '<span class="text-gray-600 text-sm italic">Actual</span>'}
                    </td>
                </tr>
            `;
        }).join('');

        // Expose helper to window for onclick
        window.impersonateUser = async (userId) => {
            if (!confirm('¿Estás seguro de que deseas iniciar sesión como este usuario? Tendrás que cerrar sesión para volver a ser admin.')) return;

            try {
                await authService.impersonate(userId);
                alert('Sesión iniciada como usuario. Redirigiendo...');
                window.location.hash = '#/';
                window.location.reload(); // Reload to refresh app state fully
            } catch (error) {
                alert(error.message);
            }
        };

    } catch (error) {
        console.error(error);
        tableBody.innerHTML = '<tr><td colspan="5" class="px-6 py-4 text-center text-red-500">Error al cargar usuarios. Intente recargar.</td></tr>';
    }
}
