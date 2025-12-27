import { API_BASE_URL, CONTENT_BASE_URL } from '../../config.js';
import { API_ROUTES } from '../../api/routes.js';

let carouselInterval = null;
let animationFrame = null;

export async function initHeroCarousel() {
    try {
        const res = await fetch(`${API_ROUTES.HERO}?action=active`);

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
            section.querySelectorAll('.hero-carousel, .carousel-nav, .hero-progress-container').forEach(el => el.remove());


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
                slidesHtml = data.map((vid, index) => {
                    const isVideo = vid.ruta_video.match(/\.(mp4|webm|mov)$/i);
                    const mediaUrl = vid.ruta_video.startsWith('http')
                        ? vid.ruta_video
                        : `${CONTENT_BASE_URL}/${vid.ruta_video}`;

                    const content = isVideo
                        ? `<video id="hero-vid-${index}" autoplay muted loop playsinline class="w-full h-full object-cover">
                               <source src="${mediaUrl}" type="video/mp4">
                           </video>`
                        : `<img src="${mediaUrl}" class="w-full h-full object-cover" alt="Hero Image">`;

                    return `
                        <div class="hero-slide ${index === 0 ? 'active' : ''}" data-index="${index}" style="position: absolute; inset: 0; transition: opacity 0.8s ease-in-out; opacity: ${index === 0 ? '1' : '0'}; z-index: ${index === 0 ? '1' : '0'};">
                            ${content}
                        </div>
                    `;
                }).join('');

            }

            const carouselContainer = document.createElement('div');
            carouselContainer.className = 'hero-carousel absolute inset-0 w-full h-full';
            carouselContainer.innerHTML = slidesHtml;

            // Insert as first child
            section.insertBefore(carouselContainer, section.firstChild);

            // Controls & Logic
            if (data.length > 1) {
                // HIDE ON MOBILE (md:block)
                const prevBtn = document.createElement('button');
                prevBtn.className = 'carousel-nav hidden md:block absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 text-white/80 hover:text-white hover:scale-110 transition-all drop-shadow-md';
                prevBtn.innerHTML = '<svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>';

                const nextBtn = document.createElement('button');
                nextBtn.className = 'carousel-nav hidden md:block absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 text-white/80 hover:text-white hover:scale-110 transition-all drop-shadow-md';
                nextBtn.innerHTML = '<svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>';


                section.appendChild(prevBtn);
                section.appendChild(nextBtn);

                // Progress Indicators (Lines)
                const progressContainer = document.createElement('div');
                progressContainer.className = 'hero-progress-container absolute bottom-8 md:bottom-12 left-6 right-6 z-30 flex gap-2';
                // Note: User said "just where footer ends", assuming Hero Content footer inside hero. 
                // Bottom-8 is safe.

                const progressHtml = data.map((_, idx) => `
                    <div class="progress-track flex-1 h-1 bg-gray-600/50 rounded-full overflow-hidden backdrop-blur-sm">
                        <div class="progress-fill h-full bg-white w-0" id="progress-fill-${idx}"></div>
                    </div>
                `).join('');
                progressContainer.innerHTML = progressHtml;
                section.appendChild(progressContainer);


                // Logic
                let currentIndex = 0;
                const total = data.length;
                const slides = carouselContainer.querySelectorAll('.hero-slide');
                const DURATION = 15000; // 15s per slide

                const updateProgress = (index) => {
                    // Update all bars
                    data.forEach((_, idx) => {
                        const bar = document.getElementById(`progress-fill-${idx}`);
                        if (!bar) return;

                        // Clear animation
                        bar.style.transition = 'none';

                        if (idx < index) {
                            bar.style.width = '100%';
                        } else if (idx > index) {
                            bar.style.width = '0%';
                        } else {
                            // Active
                            bar.style.width = '0%';
                            // Force reflow
                            void bar.offsetWidth;
                            // Animate
                            bar.style.transition = `width ${DURATION}ms linear`;
                            bar.style.width = '100%';
                        }
                    });
                };


                const showSlide = (index) => {
                    slides.forEach(s => {
                        s.style.opacity = '0';
                        s.style.zIndex = '0';
                    });
                    slides[index].style.opacity = '1';
                    slides[index].style.zIndex = '1';

                    // Reset video play

                    const vid = slides[index].querySelector('video');
                    if (vid) {
                        vid.currentTime = 0;
                        vid.play().catch(e => console.log('Autoplay prevented', e));
                    }

                    updateProgress(index);

                };

                const next = () => {
                    currentIndex = (currentIndex + 1) % total;
                    showSlide(currentIndex);
                };

                const prev = () => {
                    currentIndex = (currentIndex - 1 + total) % total;
                    showSlide(currentIndex);
                };

                nextBtn.onclick = () => { next(); resetTimer(); };
                prevBtn.onclick = () => { prev(); resetTimer(); };

                // Swipe Logic
                let touchStartX = 0;
                let touchEndX = 0;

                section.addEventListener('touchstart', e => {
                    touchStartX = e.changedTouches[0].screenX;
                }, { passive: true });

                section.addEventListener('touchend', e => {
                    touchEndX = e.changedTouches[0].screenX;
                    handleSwipe();
                    resetTimer();
                }, { passive: true });

                const handleSwipe = () => {
                    const threshold = 50;
                    if (touchEndX < touchStartX - threshold) next(); // Swipe Left -> Next
                    if (touchEndX > touchStartX + threshold) prev(); // Swipe Right -> Prev

                };

                // Auto rotate
                const startTimer = () => {
                    if (carouselInterval) clearInterval(carouselInterval);
                    carouselInterval = setInterval(next, DURATION);

                };

                const resetTimer = () => {
                    startTimer();
                };

                startTimer();
                // Init first progress
                updateProgress(0);

            }
        }
    } catch (e) {
        console.error('Failed to load hero carousel', e);
    }
}
