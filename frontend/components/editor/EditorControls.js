export function EditorControls(isPlaying, currentTime, duration, zoomLevel) {
    return `
        <div class="h-24 bg-gray-900/95 backdrop-blur border-t border-gray-700 flex flex-col justify-center px-6 z-20">
            
            <!-- Progress Bar (Longer) -->
            <div class="flex items-center space-x-3 mb-2 w-full max-w-5xl mx-auto">
                <span id="current-time" class="text-xs text-gray-400 font-mono w-10 text-right">${formatTime(currentTime)}</span>
                <div class="flex-1 h-1.5 bg-gray-700 rounded-full cursor-pointer group relative" id="progress-bar-control">
                    <div id="progress-fill" class="absolute top-0 left-0 h-full bg-green-500 rounded-full w-0 transition-all duration-100" style="width: ${(currentTime / duration) * 100}%"></div>
                    <div class="absolute top-1/2 -mt-1.5 h-3 w-3 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity" id="progress-handle" style="left: ${(currentTime / duration) * 100}%"></div>
                </div>
                <span id="total-time" class="text-xs text-gray-400 font-mono w-10">${formatTime(duration)}</span>
            </div>

            <!-- Main Buttons -->
            <div class="flex items-center justify-between w-full max-w-5xl mx-auto">
                <!-- Left: Zoom -->
                <div class="flex items-center space-x-2 w-1/3">
                    <span class="text-xs text-gray-500">Zoom</span>
                    <input type="range" id="zoom-slider" min="10" max="300" value="${zoomLevel}" class="w-24 accent-green-500 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer">
                </div>

                <!-- Center: Play Controls -->
                <div class="flex items-center justify-center space-x-6 w-1/3">
                    <button class="text-gray-400 hover:text-white transition">
                        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
                    </button>
                    
                    <button id="btn-play-pause" class="w-14 h-14 bg-green-600 rounded-full flex items-center justify-center text-white hover:bg-green-500 shadow-lg hover:scale-105 transition transform">
                        <svg id="icon-play" class="w-7 h-7 ml-1 ${isPlaying ? 'hidden' : ''}" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        <svg id="icon-pause" class="w-7 h-7 ${isPlaying ? '' : 'hidden'}" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                    </button>

                    <button class="text-gray-400 hover:text-white transition">
                        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
                    </button>
                </div>

                <!-- Right: Extra -->
                <div class="flex items-center justify-end w-1/3 space-x-4">
                    <!-- Placeholder for other controls -->
                </div>
            </div>
        </div>
    `;
}

function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
}
