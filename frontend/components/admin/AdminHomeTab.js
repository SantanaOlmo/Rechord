import { setupAdminLogic } from '../logic/adminHomeLogic.js';

export function renderHomeConfigTab(container) {
    container.innerHTML = `
        <div class="p-6">
            <h3 class="text-xl font-bold mb-4 text-white">Gestión de Home Page</h3>
            
            <div id="admin-home-config" class="space-y-4 min-h-[100px]">
                <p class="text-gray-400">Cargando configuración...</p>
            </div>
            
            <button id="btn-toggle-add-cat" class="mt-6 text-indigo-400 hover:text-indigo-300 flex items-center gap-2 font-medium">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                Nueva Categoría
            </button>

            <form id="add-category-form" class="mt-4 bg-gray-800 p-6 rounded-lg hidden border border-gray-700 shadow-xl">
                <h4 class="font-bold mb-4 text-white">Añadir Nueva Categoría</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" name="titulo" placeholder="Título (ej: Rock 90s)" class="bg-gray-700 text-white rounded p-3 text-sm border border-gray-600 focus:border-indigo-500 outline-none w-full" required>
                    <input type="text" name="valor" placeholder="Hashtag (ej: rock)" class="bg-gray-700 text-white rounded p-3 text-sm border border-gray-600 focus:border-indigo-500 outline-none w-full" required>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <select name="tipo" class="bg-gray-700 text-white rounded p-3 text-sm border border-gray-600 outline-none w-full">
                        <option value="hashtag">Hashtag</option>
                        <option value="static">Estático (top_likes, recent)</option>
                    </select>
                    <input type="number" name="orden" placeholder="Orden" class="bg-gray-700 text-white rounded p-3 text-sm border border-gray-600 outline-none w-full" value="99">
                </div>
                <div class="mt-6 flex gap-3">
                    <button type="submit" class="bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-6 rounded-lg font-medium shadow-lg transition-all">Añadir</button>
                </div>
            </form>
        </div>
    `;

    setupAdminLogic();
}
