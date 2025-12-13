import { FolderSidebar } from './FolderSidebar.js';
import { CONTENT_BASE_URL } from '../../config.js';
import { authService } from '../../services/authService.js';

export function MobileMenu() {
    const user = authService.getCurrentUser();
    const isAdmin = authService.isAdmin();

    // Nav Links (Matching Header.js but vertical)
    return `
        <div id="mobile-menu-wrapper" class="fixed inset-0 z-[60] pointer-events-none">
            
            <!-- Backdrop (Fades in/out, does not slide) -->
            <div id="mobile-menu-backdrop" class="absolute inset-0 bg-black/80 opacity-0 transition-opacity duration-300 pointer-events-auto" 
                 onclick="window.toggleMobileMenu()" style="pointer-events: none;"></div>
            
            <!-- Content (Slides in/out) -->
            <div id="mobile-menu-content" class="absolute left-0 top-0 bottom-0 w-80 max-w-[80%] bg-gray-900 border-r border-gray-800 shadow-2xl flex flex-col pointer-events-auto transform -translate-x-full transition-transform duration-300">
                
                <!-- Drawer Header -->
                <div class="flex items-center justify-between p-4 border-b border-gray-800">
                    <span class="text-white font-bold text-lg tracking-wider">REChord</span>
                    <button onclick="window.toggleMobileMenu()" class="text-gray-400 hover:text-white">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                <!-- Navigation Links -->
                <div class="flex flex-col p-4 space-y-4 border-b border-gray-800">
                    <a href="#/" onclick="window.toggleMobileMenu()" class="flex items-center text-gray-300 hover:text-white space-x-3">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                        <span class="font-medium">Inicio</span>
                    </a>
                    
                    ${isAdmin ? `
                    <a href="#/admin" onclick="window.toggleMobileMenu()" class="flex items-center text-gray-300 hover:text-white space-x-3">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                        <span class="font-medium">Admin</span>
                    </a>` : ''}

                    <button onclick="window.socketService.send('CREATE_ROOM'); window.toggleMobileMenu()" class="flex items-center text-gray-300 hover:text-white space-x-3 w-full text-left">
                        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3s1.34 3 3 3m-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5S5 6.34 5 8s1.34 3 3 3m0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5m8 0c-.29 0-.62.02-.97.05c1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5"/></svg>
                        <span class="font-medium">Crear Sala</span>
                    </button>

                    <button onclick="document.getElementById('room-modal').classList.remove('hidden'); window.toggleMobileMenu()" class="flex items-center text-gray-300 hover:text-white space-x-3 w-full text-left">
                        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><circle cx="10" cy="8" r="4"/><path d="M10.35 14.01C7.62 13.91 2 15.27 2 18v2h9.54c-2.47-2.76-1.23-5.89-1.19-5.99m9.08 4.01c.36-.59.57-1.28.57-2.02c0-2.21-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4c.74 0 1.43-.22 2.02-.57L20.59 22L22 20.59zM16 18c-1.1 0-2-.9-2-2s.9-2 2-2s2 .9 2 2s-.9 2-2 2"/></svg>
                        <span class="font-medium">Unirse a Sala</span>
                    </button>

                    <a href="#/messages" onclick="window.toggleMobileMenu()" class="flex items-center text-gray-300 hover:text-white space-x-3 w-full text-left">
                         <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        <span class="font-medium">Mensajes</span>
                    </a>
                </div>

                <!-- Library Section (Reusing Sidebar) -->
                <div class="flex-1 overflow-hidden flex flex-col">
                    ${FolderSidebar(true)}
                </div>

            </div>
        </div>
    `;
}

// Global Toggle Logic
window.toggleMobileMenu = () => {
    const wrapper = document.getElementById('mobile-menu-wrapper');
    const content = document.getElementById('mobile-menu-content');
    const backdrop = document.getElementById('mobile-menu-backdrop');

    if (content) {
        if (content.classList.contains('-translate-x-full')) {
            // Open
            wrapper?.classList.remove('pointer-events-none');
            content.classList.remove('-translate-x-full');
            backdrop?.classList.remove('opacity-0');
            backdrop.style.pointerEvents = 'auto';
        } else {
            // Close
            wrapper?.classList.add('pointer-events-none');
            content.classList.add('-translate-x-full');
            backdrop?.classList.add('opacity-0');
            backdrop.style.pointerEvents = 'none';
        }
    }
};
