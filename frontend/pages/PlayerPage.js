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
            </div>
            <!-- Overlay to ensure text readability -->
            <div class="absolute inset-0 z-0 bg-black/60 pointer-events-none"></div>

            <div class="relative z-10 w-full flex flex-col h-full"> <!-- Content Wrapper -->
                
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
        const res = await fetch(`${API_BASE_URL}/cancion_fondos?id_cancion=${songId}`);
        const backgrounds = await res.json();

        if (Array.isArray(backgrounds) && backgrounds.length > 0) {
            container.innerHTML = '';

            if (window.bgCarouselInterval) clearInterval(window.bgCarouselInterval);

            backgrounds.forEach((bg, index) => {
                const img = document.createElement('img');
                img.src = `${CONTENT_BASE_URL}/${bg.ruta_fondo}`;
                img.className = "absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out";
                img.style.opacity = '0';

                if (index === 0) {
                    img.style.opacity = '1';
                }

                img.onerror = () => {
                    const wasVisible = img.style.opacity === '1';
                    img.remove();
                    if (wasVisible) {
                        const next = container.querySelector('img');
                        if (next) {
                            next.style.opacity = '1';
                        }
                    }
                };
                container.appendChild(img);
            });

            window.bgCarouselInterval = setInterval(() => {
                const images = container.querySelectorAll('img');
                if (images.length <= 1) return;

                let visibleIndex = -1;
                for (let i = 0; i < images.length; i++) {
                    if (images[i].style.opacity === '1') {
                        visibleIndex = i;
                        break;
                    }
                }

                if (visibleIndex !== -1) {
                    images[visibleIndex].style.opacity = '0';
                } else {
                    visibleIndex = -1; // Force reset logic if needed, but standard loop handles next
                }

                // If nothing was visible, nextIndex is 0
                const nextIndex = (visibleIndex + 1) % images.length;
                if (images[nextIndex]) images[nextIndex].style.opacity = '1';

            }, 10000);
        }
    } catch (e) {
        console.error("Error loading backgrounds", e);
    }
}
