export function ChordsPanel(showChords) {
    return `
        <div id="chords-panel" class="w-1/4 p-6 flex flex-col items-center justify-center transition-all duration-300 ${showChords ? 'opacity-100' : 'hidden opacity-0'}">
            <!-- Placeholder for dynamic chords -->
            <div class="chord-box bg-green-800/50 p-4 rounded-xl mb-4 border-2 border-green-500">
                <h3 class="text-2xl font-bold text-green-300 text-center mb-2">Cm</h3>
                <div class="w-24 h-24 bg-gray-800 rounded flex items-center justify-center text-xs text-gray-500">
                    (Diagrama)
                </div>
            </div>
        </div>
    `;
}
