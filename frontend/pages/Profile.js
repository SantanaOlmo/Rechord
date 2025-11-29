// frontend/pages/Profile.js

import { ICON_LOGOUT, ICON_EDIT } from '../config.js';

/**
 * Renderiza la página de perfil del usuario.
 * @param {object} user El objeto de usuario actual.
 */
export function Profile(user) {
    // Si la bio es nula o vacía, mostramos un placeholder
    const userBio = user.bio ? user.bio : 'Sin biografía. Haz clic en Editar para añadir una.';

    return `
        <div class="max-w-xl mx-auto mt-10 p-8 bg-gray-800 rounded-xl shadow-2xl text-white">
            <div class="flex items-center space-x-6 mb-8 border-b border-gray-700 pb-4">
                <img src="https://placehold.co/100x100/10B981/ffffff?text=${user.nombre.charAt(0)}" 
                     alt="Foto de Perfil" class="w-20 h-20 rounded-full object-cover border-4 border-indigo-500">
                <div>
                    <h2 class="text-4xl font-extrabold text-indigo-300">${user.nombre}</h2>
                    <p class="text-md text-gray-400">${user.email}</p>
                </div>
            </div>

            <div class="mb-8">
                <h3 class="text-xl font-bold mb-2 text-indigo-400">Acerca de mí</h3>
                <p class="text-gray-300">${userBio}</p>
            </div>

            <div class="flex justify-between border-t border-gray-700 pt-6">
                <!-- Botón de Editar Perfil -->
                <button onclick="handleProfileEdit()"
                        class="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-150 shadow-md">
                    <img src="${ICON_EDIT}" alt="Editar" class="w-5 h-5 mr-2 filter invert">
                    Editar Perfil
                </button>

                <!-- Botón de Cerrar Sesión -->
                <button onclick="handleLogout()"
                        class="flex items-center bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-150 shadow-md">
                    <img src="${ICON_LOGOUT}" alt="Salir" class="w-5 h-5 mr-2 filter invert">
                    Cerrar Sesión
                </button>
            </div>
        </div>
    `;
}

/**
 * Lógica para cerrar la sesión.
 */
export function handleLogout() {
    localStorage.removeItem('user');
    alertMessage('Sesión cerrada con éxito.');
    // Redirigir a Home
    window.location.hash = '#/';
}

// Función placeholder para el futuro editor de perfil
export function handleProfileEdit() {
    alertMessage('Funcionalidad de edición de perfil no implementada aún.');
    // Aquí iría la lógica para cargar el formulario de edición
}

// Función simple de alerta para evitar el uso de alert() nativo
function alertMessage(message) {
    const root = document.getElementById('app-root');
    
    // Crear un elemento de mensaje flotante
    const alertDiv = document.createElement('div');
    alertDiv.textContent = message;
    alertDiv.className = 'fixed top-4 right-4 bg-green-500 text-white p-3 rounded-lg shadow-lg z-50 transition-opacity duration-300';
    
    root.appendChild(alertDiv);

    // Desaparecer después de 3 segundos
    setTimeout(() => {
        alertDiv.style.opacity = '0';
        setTimeout(() => alertDiv.remove(), 300);
    }, 3000);
}