import { initDashboardLogic } from '../components/logic/AdminDashboardLogic.js';

export function AdminDashboard() {
    setTimeout(initDashboardLogic, 0);

    return `
        <div class="container mx-auto px-4 pt-24 pb-8 max-w-5xl">
            <header class="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 class="text-3xl font-bold text-[var(--text-primary)] mb-2">Panel de Administración</h1>
                    <p class="text-[var(--text-muted)] text-sm">Gestiona usuarios, contenido y configuración</p>
                </div>
                <!-- Tabs Navigation -->
                <div class="flex space-x-1 bg-[var(--bg-tertiary)] p-1 rounded-lg">
                    <button class="tab-btn px-4 py-2 rounded-md text-sm font-medium transition-colors bg-[var(--accent-primary)] text-white shadow-lg" data-tab="users">Usuarios</button>
                    <button class="tab-btn px-4 py-2 rounded-md text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors" data-tab="home">Configuración Home</button>
                    <button class="tab-btn px-4 py-2 rounded-md text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors" data-tab="hero">Hero Video</button>
                    <button class="tab-btn px-4 py-2 rounded-md text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors" data-tab="websocket">Websocket</button>
                </div>
            </header>

            <!-- Content Area -->
            <div id="dashboard-content-container" class="bg-[var(--bg-secondary)] rounded-2xl shadow-xl overflow-hidden border border-[var(--border-primary)] relative min-h-[500px]">
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
