import { setupAdminLogic } from '../logic/adminHomeLogic.js';
import { AdminUsersTab } from '../components/admin/AdminUsersTab.js';
import { AdminWebSocketTab } from '../components/admin/AdminWebSocketTab.js';
import { AdminHeroTab } from '../components/admin/AdminHeroTab.js?v=toastcheck';

export function AdminDashboard() {
    setTimeout(initDashboard, 0);

    return `
        <div class="container mx-auto px-4 py-8 max-w-5xl">
            <header class="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 class="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Panel de Administración</h1>
                    <p class="text-gray-400 text-sm">Gestiona usuarios, contenido y configuración</p>
                </div>
                <!-- Tabs Navigation -->
                <div class="flex space-x-1 bg-gray-900/50 p-1 rounded-lg">
                    <button class="tab-btn px-4 py-2 rounded-md text-sm font-medium transition-colors bg-indigo-600 text-white shadow-lg" data-tab="users">Usuarios</button>
                    <button class="tab-btn px-4 py-2 rounded-md text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors" data-tab="home">Configuración Home</button>
                    <button class="tab-btn px-4 py-2 rounded-md text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors" data-tab="hero">Hero Video</button>
                    <button class="tab-btn px-4 py-2 rounded-md text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors" data-tab="websocket">Websocket</button>
                </div>
            </header>

            <!-- Content Area -->
            <div id="dashboard-content-container" class="bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-800 relative min-h-[500px]">
                <!-- Dynamic Content -->
                <div class="flex items-center justify-center h-64 text-gray-500">
                    <div class="text-center">
                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto mb-3"></div>
                        <span class="text-sm">Iniciando panel...</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Global instances to manage cleanup/state
let usersTab = new AdminUsersTab('dashboard-content-container');
let wsTab = new AdminWebSocketTab('dashboard-content-container');
let heroTab = new AdminHeroTab('dashboard-content-container');
let currentTab = 'users';

async function initDashboard() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const container = document.getElementById('dashboard-content-container');

    // Reset specific instances if creating new ones per render is safer
    usersTab = new AdminUsersTab('dashboard-content-container');
    wsTab = new AdminWebSocketTab('dashboard-content-container');
    heroTab = new AdminHeroTab('dashboard-content-container');

    // We can preload users if we want
    await usersTab.loadUsers();

    const switchTab = (tab) => {
        currentTab = tab;
        // Update Buttons UI
        tabBtns.forEach(btn => {
            if (btn.dataset.tab === tab) {
                btn.className = 'tab-btn px-4 py-2 rounded-md text-sm font-medium transition-colors bg-indigo-600 text-white shadow-lg';
            } else {
                btn.className = 'tab-btn px-4 py-2 rounded-md text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors';
            }
        });
        renderTabContent(container);
    };

    tabBtns.forEach(btn => {
        btn.onclick = () => switchTab(btn.dataset.tab);
    });

    // Default Tab
    switchTab('users');
}

function renderTabContent(container) {
    // Cleanup previous tab if needed
    wsTab.stopStatusCheck(); // Stop WS interval if leaving WS tab

    container.innerHTML = '';

    if (currentTab === 'users') {
        usersTab.render();
    } else if (currentTab === 'home') {
        renderHomeConfigTab(container);
    } else if (currentTab === 'websocket') {
        wsTab.render();
    } else if (currentTab === 'hero') {
        heroTab.render();
    }
}

// Home Config Tab (Still kept here or could move to its own Component/Wrapper)
function renderHomeConfigTab(container) {
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
