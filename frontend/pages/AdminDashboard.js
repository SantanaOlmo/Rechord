import { initDashboardLogic } from '../components/logic/AdminDashboardLogic.js';

export function AdminDashboard() {
    setTimeout(initDashboardLogic, 0);

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
