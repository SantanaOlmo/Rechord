export function LyricsPanel() {
    return `
        <div class="w-full h-full flex flex-col items-center justify-center relative">
            <div id="lyrics-container" class="text-center space-y-8 h-full overflow-y-auto w-full px-4 pt-[45vh] pb-[45vh] scroll-smooth mask-image-gradient scrollbar-hide">
                <!-- Placeholder Lyrics -->
                <p class="text-gray-500 text-xl">Cargando canción...</p>
            </div>
        </div>
    `;
}
