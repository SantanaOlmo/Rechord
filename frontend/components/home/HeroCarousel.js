
let carouselInterval = null;

export async function initHeroCarousel() {
    try {
        const { API_BASE_URL, CONTENT_BASE_URL } = await import('../../config.js');
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
