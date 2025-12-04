export function LyricsPanel() {
    return `
        <div class="w-2/4 flex flex-col items-center justify-center p-4">
            <div id="lyrics-container" class="text-center space-y-6 max-h-[60vh] overflow-y-auto no-scrollbar mask-image-gradient">
                <!-- Placeholder Lyrics -->
                <p class="text-gray-500 text-xl">Cargando canción...</p>
            </div>
        </div>
    `;
}
