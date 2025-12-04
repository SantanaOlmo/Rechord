export function DashboardHeader(user) {
    return `
        <div class="dashboard-header">
            <div class="header-content">
                <div class="header-title">
                    <h1>Mis Proyectos</h1>
                    <p>Hola, ${user?.nombre || 'Usuario'}</p>
                </div>
                <div class="header-actions">
                    <button id="btn-new-song" class="btn-new-song">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                        Nueva Canción
                    </button>
                </div>
            </div>
        </div>
    `;
}
