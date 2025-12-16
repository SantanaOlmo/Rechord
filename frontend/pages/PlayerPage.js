import { PlayerHeader } from '../components/player/PlayerHeader.js';
import { PlayerControls } from '../components/player/PlayerControls.js';
import { LyricsPanel } from '../components/editor/LyricsPanel.js';
import { ChordsPanel } from '../components/editor/ChordsPanel.js';
import { initPlayer } from '../components/player/PlayerController.js';

export function PlayerPage(id) {
    // Initialization
    setTimeout(() => {
        initPlayer(id);
        initBackgroundCarousel(id);
    }, 0);

    return `
        <div class="player-page-container h-screen flex flex-col overflow-hidden relative">
            
            <!-- Background Carousel Layer -->
            <div id="player-bg-carousel" class="absolute inset-0 z-0 pointer-events-none">
                <!-- Images injected here -->
                <div class="absolute inset-0 bg-[var(--bg-primary)] transition-opacity duration-1000" id="bg-default"></div>
            </div>
            <!-- Overlay to ensure text readability -->
            <div class="absolute inset-0 z-0 bg-[var(--bg-primary)]/60 pointer-events-none"></div>

            <div class="relative z-10 w-full flex flex-col h-full"> <!-- Content Wrapper -->
                ${PlayerHeader()}

                <!-- Main Content Area -->
                <main class="flex-1 flex flex-col relative overflow-hidden min-h-0">
                    <!-- Content Panels (Lyrics, Chords) -->
                    <div class="flex-1 flex relative overflow-hidden min-h-0">
                        ${ChordsPanel(false)} <!-- Default Hidden -->
                        ${LyricsPanel()}
                    </div>

                    <!-- Controls -->
                    <div class="shrink-0 z-20 w-full">
                        ${PlayerControls(id, false)}
                    </div>
                </main>
            </div>
        </div>
    `;
}

async function initBackgroundCarousel(songId) {
    const container = document.getElementById('player-bg-carousel');
    if (!container) return;

    try {
        const { API_BASE_URL, CONTENT_BASE_URL } = await import('../config.js');
        const res = await fetch(`${API_BASE_URL}/cancion_fondos.php?id_cancion=${songId}`);
        const backgrounds = await res.json();

        if (Array.isArray(backgrounds) && backgrounds.length > 0) {
            let currentIndex = 0;
            const intervalTime = 15000; // 15s

            container.innerHTML = '';

            backgrounds.forEach((bg, index) => {
                const img = document.createElement('img');
                img.src = `${CONTENT_BASE_URL}/${bg.ruta_fondo}`;
                img.className = `absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${index === 0 ? 'opacity-100' : 'opacity-0'}`;
                img.dataset.index = index;
                container.appendChild(img);
            });

            if (backgrounds.length > 1) {
                setInterval(() => {
                    const images = container.querySelectorAll('img');
                    images[currentIndex].classList.remove('opacity-100');
                    images[currentIndex].classList.add('opacity-0');

                    currentIndex = (currentIndex + 1) % images.length;

                    images[currentIndex].classList.remove('opacity-0');
                    images[currentIndex].classList.add('opacity-100');
                }, intervalTime);
            }
        }
    } catch (e) {
        console.error("Error loading backgrounds", e);
    }
}
