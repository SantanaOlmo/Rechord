export function EditorSearchModal() {
    return `
        <div id="search-tools-modal" class="fixed inset-0 bg-black/50 z-50 hidden flex items-center justify-center backdrop-blur-sm">
            <div class="bg-gray-800 rounded-xl shadow-2xl w-96 border border-gray-700 overflow-hidden transform transition-all scale-95 opacity-0" id="search-modal-content">
                <div class="p-4 border-b border-gray-700 flex items-center">
                    <svg class="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    <input type="text" id="tool-search-input" placeholder="Buscar herramienta..." class="bg-transparent border-none text-white focus:ring-0 w-full placeholder-gray-500 outline-none">
                    <button id="btn-close-search" class="text-gray-500 hover:text-white">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                <div class="p-2 max-h-64 overflow-y-auto" id="search-results">
                    <!-- Results -->
                </div>
            </div>
        </div>
    `;
}
