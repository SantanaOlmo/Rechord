import { Footer } from '../components/layout/Footer.js';

export function SitemapPage() {
    return `
        <div class="flex flex-col min-h-full bg-gray-900 text-white">
            <div class="flex-1 max-w-7xl mx-auto w-full px-8 py-12">
                <h1 class="text-3xl font-bold mb-10 border-b border-gray-800 pb-4">Mapa del sitio</h1>
                
                <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
                    
                    <!-- Column 1: Descubrir -->
                    <div class="space-y-4">
                        <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider">Descubrir</h3>
                        <ul class="space-y-2">
                            <li><a href="#/" class="text-gray-300 hover:text-indigo-400 text-sm transition-colors">Inicio</a></li>
                            <li><a href="#/home" class="text-gray-300 hover:text-indigo-400 text-sm transition-colors">Explorar</a></li>
                            <!-- Placeholder for future sections -->
                            <li><span class="text-gray-600 text-sm cursor-not-allowed">Novedades (Próximamente)</span></li>
                            <li><span class="text-gray-600 text-sm cursor-not-allowed">Top Éxitos (Próximamente)</span></li>
                        </ul>
                    </div>

                    <!-- Column 2: Tienda / Cuenta -->
                    <div class="space-y-4">
                        <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider">Cuenta</h3>
                        <ul class="space-y-2">
                            <li><a href="#/auth/login" class="text-gray-300 hover:text-indigo-400 text-sm transition-colors">Iniciar Sesión</a></li>
                            <li><a href="#/auth/register" class="text-gray-300 hover:text-indigo-400 text-sm transition-colors">Crear Cuenta</a></li>
                            <li><a href="#/profile" class="text-gray-300 hover:text-indigo-400 text-sm transition-colors">Mi Perfil</a></li>
                            <li><a href="#/notifications" class="text-gray-300 hover:text-indigo-400 text-sm transition-colors">Notificaciones</a></li>
                        </ul>
                    </div>

                    <!-- Column 3: Comunidad -->
                    <div class="space-y-4">
                        <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider">Comunidad</h3>
                        <ul class="space-y-2">
                            <li><a href="#/messages" class="text-gray-300 hover:text-indigo-400 text-sm transition-colors">Mensajes</a></li>
                            <!-- Use a span for actions that require JS/Auth check if not direct links -->
                            <li><span class="text-gray-300 hover:text-indigo-400 text-sm transition-colors cursor-pointer" onclick="document.getElementById('room-modal').classList.remove('hidden')">Unirse a Sala</span></li>
                            <li><span class="text-gray-300 hover:text-indigo-400 text-sm transition-colors cursor-pointer" onclick="window.socketService?.send('CREATE_ROOM')">Crear Sala (Fiesta)</span></li>
                        </ul>
                    </div>

                    <!-- Column 4: Legal -->
                    <div class="space-y-4">
                        <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider">Legal</h3>
                        <ul class="space-y-2">
                            <li><a href="#/privacy-policy" class="text-gray-300 hover:text-indigo-400 text-sm transition-colors">Política de Privacidad</a></li>
                            <li><a href="#/data-protection" class="text-gray-300 hover:text-indigo-400 text-sm transition-colors">Protección de Datos</a></li>
                            <li><span class="text-gray-300 hover:text-indigo-400 text-sm transition-colors cursor-pointer">Condiciones de Uso</span></li>
                            <li><span class="text-gray-300 hover:text-indigo-400 text-sm transition-colors cursor-pointer">Uso de Cookies</span></li>
                            <li><span class="text-gray-300 hover:text-indigo-400 text-sm transition-colors cursor-pointer">Avisos Legales</span></li>
                        </ul>
                    </div>

                </div>
            </div>
            ${Footer()}
        </div>
    `;
}
