
import { SidebarContainer } from '../components/layout/SidebarContainer.js';
import { NewSongModal } from '../components/modals/NewSongModal.js';
import { EditSongModal } from '../components/modals/EditSongModal.js';
import { Footer, setupFooterTheme } from '../components/layout/Footer.js';
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
import { initHeroCarousel } from '../components/home/HeroCarousel.js';
import { setupHeroScroll } from '../components/home/HeroScroll.js';
import { loadHomeContent, setupHomeEventListeners } from '../components/home/HomeLogic.js';

export function Home() {
    // Initialization Logic
    setTimeout(() => {
        loadHomeContent();
        setupHomeEventListeners();
        setupHeroScroll();
        initHeroCarousel();
        setupFooterTheme();
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
    }, 0);

    return `
        <div class="dashboard-container flex h-full w-full overflow-hidden">
            ${SidebarContainer()}

            <div class="flex-1 flex flex-col h-full relative overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)]">
                <main id="main-scroll-container" class="flex-1 overflow-y-auto bg-[var(--bg-primary)] scrollbar-hide scroll-smooth">
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
                    <!-- Hero Section -->
                    <section id="hero-section">
                        <div class="hero-overlay"></div>
                        <div class="hero-content">
                            <h1 class="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg">Siente la música</h1>
                            <p class="text-xl text-gray-200 mb-8 drop-shadow-md">Descubre, crea y toca tus canciones favoritas.</p>
                            <button onclick="document.getElementById('home-content').scrollIntoView({behavior: 'smooth'})" class="px-8 py-3 bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white rounded-full font-bold shadow-lg transition transform hover:scale-105">Explorar</button>
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
                        </div>
                    </section>

                    <div class="p-6">
                        <div id="loading-home" class="text-center py-10">
                            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-primary)] mx-auto"></div>
                            <p class="mt-4 text-[var(--text-muted)]">Cargando música...</p>
                        </div>
                        
                        <div id="home-content" class="space-y-12 min-h-[500px] scroll-mt-24">
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
                             <!-- Sections injected via HomeLogic -->
                        </div>
                        
                        ${Footer()}
                    </div>
                </main>

                <!-- Floating FAB -->
                <button id="btn-new-song" class="fixed bottom-8 right-8 z-50 bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white rounded-full h-14 transition-all duration-300 shadow-lg flex items-center justify-center overflow-hidden hover:pr-6 hover:pl-2 min-w-14 group">
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
                    <svg class="w-8 h-8 flex-shrink-0 transition-transform duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                    <span class="font-bold whitespace-nowrap opacity-0 max-w-0 group-hover:opacity-100 group-hover:max-w-xs group-hover:ml-2 transition-all duration-500 ease-in-out delay-75">Nueva Canción</span>
                </button>
            </div>

            ${NewSongModal()}
            ${EditSongModal()}
        </div>
    `;
}
