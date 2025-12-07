
import { SongCard } from '../components/SongCard.js?v=fixed';

// Expose scroll helper to window globally as it's used in inline onclicks
window.scrollContainer = (id, direction) => {
    const container = document.getElementById(id);
    if (container) {
        const scrollAmount = 600; // Scroll width of approx 3 cards
        container.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
    }
};

export function renderSection(section, likedSongIds) {
    if (!section.songs || section.songs.length === 0) return '';

    const sectionId = `section-${section.type || 'custom'}-${section.id || Math.random().toString(36).substr(2, 9)}`;
    const cardsHtml = section.songs.map(song => {
        const isLiked = likedSongIds.includes(song.id_cancion);
        return SongCard(song, isLiked);
    }).join('');

    return `
        <section class="home-section animate-fade-in-up">
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-2xl font-bold text-white tracking-tight">${section.title}</h2>
            </div>
            
            <div class="relative group/carousel">
                <!-- Left Button -->
                <button onclick="window.scrollContainer('${sectionId}', -1)" 
                        class="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-30 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-black/80 backdrop-blur-sm hidden md:block">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
                </button>

                <!-- Swimlane container -->
                <div id="${sectionId}" class="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory scrollbar-hide scroll-smooth" style="-webkit-overflow-scrolling: touch;">
                    ${cardsHtml}
                </div>

                <!-- Right Button -->
                <button onclick="window.scrollContainer('${sectionId}', 1)"
                        class="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-30 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-black/80 backdrop-blur-sm hidden md:block">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                </button>
            </div>
        </section>
    `;
}
