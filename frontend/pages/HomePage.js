import { authService } from '../services/authService.js';
import { getHomeData } from '../services/cancionService.js';
import { likeService } from '../services/likeService.js';
import { SongCard } from '../components/cards/SongCard.js?v=fixed';
import { NewSongModal } from '../components/modals/NewSongModal.js';
import { EditSongModal } from '../components/modals/EditSongModal.js';
import { SidebarContainer } from '../components/layout/SidebarContainer.js';
import { Store } from '../core/StateStore.js';
import { socketService } from '../services/socketService.js';

// Logic Modules
import { initNewSongLogic } from '../components/logic/NewSongLogic.js';
import { initEditSongLogic } from '../components/logic/EditSongLogic.js';
import { renderSection } from '../components/logic/HomeRenderer.js';
import { Footer } from '../components/layout/Footer.js';

export function Home() {
    const user = authService.getCurrentUser();

    // Logic moved to loadHomeContent
    setTimeout(() => {
        loadHomeContent();
        setupEventListeners();
        setupHeroScroll();
        initHeroCarousel(); // Fetch and render dynamic carousel
    }, 0);

    return `
        <div class="dashboard-container flex h-full w-full overflow-hidden">
            <!-- Sidebar -->
            ${SidebarContainer()}

            <div class="flex-1 flex flex-col h-full relative overflow-hidden">
                <!-- Header is now Global in app.js -->
                
                <main id="main-scroll-container" class="flex-1 overflow-y-auto bg-gray-900 scrollbar-hide scroll-smooth">
                    <!-- Hero Section -->
                    <section id="hero-section">
                        <!-- Carousel injected here -->
                        
                        <div class="hero-overlay"></div>
                        <div class="hero-content">
                            <h1 class="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg">Siente la música</h1>
                            <p class="text-xl text-gray-200 mb-8 drop-shadow-md">Descubre, crea y toca tus canciones favoritas.</p>
                            <button onclick="document.getElementById('home-content').scrollIntoView({behavior: 'smooth'})" class="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold shadow-lg transition transform hover:scale-105">Explorar</button>
                        </div>
                    </section>

                    <div class="p-6">
                        <div id="loading-home" class="text-center py-10">
                            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                            <p class="mt-4 text-gray-500">Cargando música...</p>
                        </div>
                        
                        <!-- Added scroll-mt-20 for tighter spacing as requested -->
                        <div id="home-content" class="space-y-12 min-h-[500px] scroll-mt-5">
                             <!-- Sections will be injected here -->
                        </div>
                        
                        ${Footer()}
                    </div>
                </main>

                <!-- Fixed Bottom Floating Action Button -->
                <button id="btn-new-song" class="fixed bottom-8 right-8 z-50 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full h-14 transition-all duration-300 shadow-lg flex items-center justify-center overflow-hidden hover:pr-6 hover:pl-2 w-14 hover:w-auto group">
                    <svg class="w-8 h-8 flex-shrink-0 transition-transform duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                    <span class="font-bold whitespace-nowrap opacity-0 max-w-0 group-hover:opacity-100 group-hover:max-w-xs group-hover:ml-2 transition-all duration-500 ease-in-out">Nueva Canción</span>
                </button>
            </div>

            ${NewSongModal()}
            ${EditSongModal()}
        </div>
    `;
}



function setupHeroScroll() {
    const main = document.getElementById('main-scroll-container');
    const sidebar = document.getElementById('sidebar-container');
    const hero = document.getElementById('hero-section');

    if (!main || !sidebar || !hero) return;

    // Initial check
    const heroHeight = hero.offsetHeight || 500;

    // Handler
    const handleScroll = () => {
        const scrollTop = main.scrollTop;
        const content = document.getElementById('home-content');

        // Calculate threshold: When content reaches top (minus header/margin)
        // If content exists, use its offsetTop minus a buffer (e.g. 100px or the scroll-mt)
        // The user wants sidebar strictly when reaching the content.
        // Let's us the hero height as the primary marker since home-content follows it.
        const threshold = hero.offsetHeight - 80; // aprox 20px (mt-5) + header offset

        if (scrollTop >= threshold) {
            sidebar.classList.add('sidebar-visible');
        } else {
            sidebar.classList.remove('sidebar-visible');
        }
    };

    main.addEventListener('scroll', handleScroll);
    // Trigger once
    handleScroll();
}

// Global reference for carousel interval
let carouselInterval = null;

async function initHeroCarousel() {
    try {
        const { API_BASE_URL, CONTENT_BASE_URL } = await import('../config.js');
        const res = await fetch(`${API_BASE_URL}/hero.php?action=active`);
        if (res.ok) {
            let data = await res.json();

            // Validate data
            if (!Array.isArray(data)) {
                if (data.id_hero) data = [data];
                else data = [];
            }
            // Filter out invalid
            data = data.filter(v => v.ruta_video !== 'default');

            const section = document.getElementById('hero-section');
            if (!section) return;

            // Clear previous
            section.querySelectorAll('.hero-carousel, .carousel-nav').forEach(el => el.remove());

            // Build Carousel HTML
            let slidesHtml = '';

            if (data.length === 0) {
                // Fallback
                slidesHtml = `
                    <div class="hero-slide active" style="position: absolute; inset: 0; transition: opacity 1s ease-in-out; opacity: 1; z-index: 1;">
                         <video autoplay muted loop playsinline class="w-full h-full object-cover">
                            <source src="https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4">
                        </video>
                    </div>
                 `;
            } else {
                slidesHtml = data.map((vid, index) => `
                    <div class="hero-slide ${index === 0 ? 'active' : ''}" data-index="${index}" style="position: absolute; inset: 0; transition: opacity 0.8s ease-in-out; opacity: ${index === 0 ? '1' : '0'}; z-index: ${index === 0 ? '1' : '0'};">
                        <video id="hero-vid-${index}" autoplay muted loop playsinline class="w-full h-full object-cover">
                            <source src="${CONTENT_BASE_URL}/${vid.ruta_video}" type="video/mp4">
                        </video>
                    </div>
                `).join('');
            }

            const carouselContainer = document.createElement('div');
            carouselContainer.className = 'hero-carousel absolute inset-0 w-full h-full';
            carouselContainer.innerHTML = slidesHtml;

            // Insert as first child
            section.insertBefore(carouselContainer, section.firstChild);

            // Controls
            if (data.length > 1) {
                const prevBtn = document.createElement('button');
                prevBtn.className = 'carousel-nav absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 bg-black/30 hover:bg-black/60 text-white rounded-full transition-all';
                prevBtn.innerHTML = '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>';

                const nextBtn = document.createElement('button');
                nextBtn.className = 'carousel-nav absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 bg-black/30 hover:bg-black/60 text-white rounded-full transition-all';
                nextBtn.innerHTML = '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>';

                section.appendChild(prevBtn);
                section.appendChild(nextBtn);

                // Logic
                let currentIndex = 0;
                const total = data.length;
                const slides = carouselContainer.querySelectorAll('.hero-slide');

                const showSlide = (index) => {
                    slides.forEach(s => {
                        s.style.opacity = '0';
                        s.style.zIndex = '0';
                    });
                    slides[index].style.opacity = '1';
                    slides[index].style.zIndex = '1';

                    // Reset video play to ensure it plays
                    const vid = slides[index].querySelector('video');
                    if (vid) {
                        vid.currentTime = 0;
                        vid.play().catch(e => console.log('Autoplay prevented', e));
                    }
                };

                const next = () => {
                    currentIndex = (currentIndex + 1) % total;
                    showSlide(currentIndex);
                };

                const prev = () => {
                    currentIndex = (currentIndex - 1 + total) % total;
                    showSlide(currentIndex);
                };

                nextBtn.onclick = () => {
                    next();
                    resetTimer();
                };
                prevBtn.onclick = () => {
                    prev();
                    resetTimer();
                };

                // Auto rotate
                const startTimer = () => {
                    if (carouselInterval) clearInterval(carouselInterval);
                    carouselInterval = setInterval(next, 15000); // 15s per video
                };

                const resetTimer = () => {
                    startTimer();
                };

                startTimer();
            }
        }
    } catch (e) {
        console.error('Failed to load hero carousel', e);
    }
}
window.scrollContainer = (id, direction) => {
    const container = document.getElementById(id);
    if (container) {
        const scrollAmount = 600; // Scroll width of approx 3 cards
        container.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
    }
};

async function loadHomeContent() {
    const container = document.getElementById('home-content');
    const loading = document.getElementById('loading-home');

    try {
        const sections = await getHomeData();
        const user = authService.getCurrentUser();
        const likedSongIds = user ? await likeService.getUserLikes(user.id_usuario) : [];

        if (loading) loading.classList.add('hidden');
        if (container) {
            container.innerHTML = '';

            if (sections.length === 0) {
                container.innerHTML = '<p class="text-center text-gray-500">No hay contenido disponible.</p>';
                return;
            }

            sections.forEach(section => {
                // Determine active status: default to 1 (visible) if undefined
                const rawActive = section.activo ?? section.active;
                const isActive = (rawActive === undefined || rawActive === null) ? 1 : parseInt(rawActive);

                if (isActive === 1) {
                    const html = renderSection(section, likedSongIds);
                    container.insertAdjacentHTML('beforeend', html);
                }
            });

            // Handle Persistence Scroll (Skip Hero)
            const hasSeenHero = sessionStorage.getItem('rechord_hero_seen');
            if (hasSeenHero) {
                // Use setTimeout to ensure DOM is ready and layout is stable
                setTimeout(() => {
                    const el = document.getElementById('home-content');
                    if (el) el.scrollIntoView({ behavior: 'auto' }); // 'auto' for instant jump
                }, 100);
            } else {
                sessionStorage.setItem('rechord_hero_seen', 'true');
            }
        }
    } catch (error) {
        console.error('Error loading home:', error);
        if (loading) loading.innerHTML = `<p class="text-red-500 text-center">Error al cargar contenido. Intenta recargar.</p>`;
    }
}


function setupEventListeners() {
    // Initialize Logic Modules
    initNewSongLogic(loadHomeContent);
    initEditSongLogic(loadHomeContent);
}
