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
            <div id="mobile-menu-content" class="absolute left-0 top-0 bottom-0 w-80 max-w-[80%] bg-[var(--sidebar-bg)] border-r border-[var(--border-primary)] shadow-2xl flex flex-col pointer-events-auto transform -translate-x-full transition-transform duration-300">
                
                <!-- Drawer Header -->
                <div class="flex items-center justify-between p-4 border-b border-[var(--border-primary)]">
                    <span class="text-[var(--text-primary)] font-bold text-lg tracking-wider">REChord</span>
                    <button onclick="window.toggleMobileMenu()" class="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                <!-- Navigation Links -->
                <div class="flex flex-col p-4 space-y-4 border-b border-[var(--border-primary)]">
                    <a href="#/" onclick="window.toggleMobileMenu()" class="flex items-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] space-x-3">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                        <span class="font-medium">Inicio</span>
                    </a>
                    
                    ${isAdmin ? `
                    <a href="#/admin" onclick="window.toggleMobileMenu()" class="flex items-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] space-x-3">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                        <span class="font-medium">Admin</span>
                    </a>` : ''}

                    <!-- Shared Session Removed
                    <button onclick="window.socketService.send('CREATE_ROOM'); window.toggleMobileMenu()" ...>
                    <button onclick="document.getElementById('room-modal').classList.remove('hidden'); ...>
                    -->

                    <a href="#/messages" onclick="window.toggleMobileMenu()" class="flex items-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] space-x-3 w-full text-left">
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
