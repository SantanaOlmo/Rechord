import { API_BASE_URL } from '../../config.js';
import { API_ROUTES } from '../../api/routes.js';
import { authService } from '../../services/authService.js';

export class AdminWebSocketTab {
    constructor(containerId) {
        this.containerId = containerId;
        this.wsStatusInterval = null;
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="p-8 flex flex-col items-center justify-center space-y-8 min-h-[400px]">
                <div class="bg-gray-800 p-8 rounded-2xl border border-gray-700 max-w-md w-full text-center shadow-xl">
                    <div class="mb-6">
                        <div class="inline-block relative">
                             <div id="ws-status-indicator" class="w-16 h-16 rounded-full bg-red-500 mx-auto transition-all shadow-[0_0_20px_rgba(239,68,68,0.5)] flex items-center justify-center">
                                <svg class="w-8 h-8 text-white opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                             </div>
                        </div>
                        <h3 class="text-2xl font-bold text-white mt-4">Servidor WebSocket</h3>
                        <p id="ws-status-text" class="text-gray-400 mt-2">Estado: Detenido</p>
                    </div>

                    <div class="flex flex-col gap-3">
                        <button id="btn-ws-start" class="w-full px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold transition shadow-lg shadow-green-900/20 text-lg">
                            Iniciar Servidor
                        </button>
                        <button id="btn-ws-stop" class="w-full px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold transition shadow-lg shadow-red-900/20 text-lg">
                            Detener Servidor
                        </button>
                    </div>
                    <p class="mt-6 text-xs text-gray-500 border-t border-gray-700 pt-4">
                        Puerto: 8080 <br> Requiere autenticación de administrador para operar.
                    </p>
                </div>
            </div>
        `;

        this.startStatusCheck();
        this.attachEvents();
    }

    attachEvents() {
        const btnStart = document.getElementById('btn-ws-start');
        const btnStop = document.getElementById('btn-ws-stop');

        if (btnStart) btnStart.onclick = () => this.handleProcess('start');
        if (btnStop) btnStop.onclick = () => this.handleProcess('stop');
    }

    async updateWSStatus() {
        const indicator = document.getElementById('ws-status-indicator');
        const text = document.getElementById('ws-status-text');
        if (!indicator) return;

        try {
            const res = await fetch(`${API_ROUTES.ADMIN_WS}?action=status`);
            const data = await res.json();

            if (data.isRunning) {
                indicator.className = 'w-16 h-16 rounded-full bg-green-500 mx-auto transition-all shadow-[0_0_20px_rgba(34,197,94,0.5)] flex items-center justify-center';
                text.textContent = 'En línea (Puerto 8080)';
                text.className = 'text-green-400 mt-2 font-medium';
            } else {
                indicator.className = 'w-16 h-16 rounded-full bg-red-500 mx-auto transition-all shadow-[0_0_20px_rgba(239,68,68,0.5)] flex items-center justify-center';
                text.textContent = 'Estado: Detenido';
                text.className = 'text-red-400 mt-2 font-medium';
            }
        } catch (e) { console.warn('WS Status Check Failed'); }
    }

    async handleProcess(action) {
        const pwd = prompt(`Ingrese contraseña:`);
        if (!pwd) return;
        try {
            const user = authService.getCurrentUser();
            const res = await fetch(`${API_ROUTES.ADMIN_WS}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action, password: pwd, userId: user.id_usuario })
            });
            const data = await res.json();
            alert(data.message);
            this.updateWSStatus();
            if (action === 'start' && data.status === 'success') {
                import('../../services/socketService.js').then(({ socketService }) => {
                    socketService.connect(user.id_usuario);
                });
            }
        } catch (e) { alert(e.message); }
    }

    startStatusCheck() {
        this.updateWSStatus();
        if (this.wsStatusInterval) clearInterval(this.wsStatusInterval);
        this.wsStatusInterval = setInterval(() => this.updateWSStatus(), 8000);
    }

    stopStatusCheck() {
        if (this.wsStatusInterval) clearInterval(this.wsStatusInterval);
    }
}
