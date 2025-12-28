
export const SyncShortcuts = () => `
    <!-- PANEL: SHORTCUTS -->
    <div id="panel-shortcuts" class="editor-panel hidden flex-col h-full bg-[var(--bg-secondary)] overflow-y-auto scrollbar-hide">
        <div class="px-4 py-3 border-b border-[var(--border-primary)] bg-[var(--bg-secondary)] shrink-0 sticky top-0 z-10">
            <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider">Atajos de Teclado</h3>
        </div>
        <div class="p-4 space-y-4">
            
            <!-- Playback -->
            <div class="space-y-2">
                <h4 class="text-xs font-bold text-indigo-400 uppercase tracking-wider">General</h4>
                <div class="flex justify-between text-xs items-center group">
                    <span class="text-gray-300">Play/Pause</span>
                    <kbd class="bg-gray-800 px-2 py-0.5 rounded text-gray-400 font-mono border border-gray-700">Espacio</kbd>
                </div>
                 <div class="flex justify-between text-xs items-center group">
                    <span class="text-gray-300">Seleccionar</span>
                    <kbd class="bg-gray-800 px-2 py-0.5 rounded text-gray-400 font-mono border border-gray-700">Click</kbd>
                </div>
                <div class="flex justify-between text-xs items-center group">
                    <span class="text-gray-300">Guardar</span>
                    <kbd class="bg-gray-800 px-2 py-0.5 rounded text-gray-400 font-mono border border-gray-700">Ctrl + S</kbd>
                </div>
                <div class="flex justify-between text-xs items-center group">
                    <span class="text-gray-300">Deshacer</span>
                    <kbd class="bg-gray-800 px-2 py-0.5 rounded text-gray-400 font-mono border border-gray-700">Ctrl + Z</kbd>
                </div>
            </div>

            <div class="h-px bg-gray-800"></div>

            <!-- Navigation -->
            <div class="space-y-2">
                <h4 class="text-xs font-bold text-blue-400 uppercase tracking-wider">Navegación</h4>
                 <div class="flex justify-between text-xs items-center group">
                    <span class="text-gray-300">Mover Playhead</span>
                    <div class="flex space-x-1">
                        <kbd class="bg-gray-800 px-2 py-0.5 rounded text-gray-400 font-mono border border-gray-700">←</kbd>
                        <kbd class="bg-gray-800 px-2 py-0.5 rounded text-gray-400 font-mono border border-gray-700">→</kbd>
                    </div>
                </div>
                <div class="flex justify-between text-xs items-center group">
                    <span class="text-gray-300">Seleccionar</span>
                    <div class="flex space-x-1 items-center">
                        <kbd class="bg-gray-800 px-2 py-0.5 rounded text-gray-400 font-mono border border-gray-700">Shift</kbd>
                        <span class="text-gray-600">+</span>
                        <kbd class="bg-gray-800 px-2 py-0.5 rounded text-gray-400 font-mono border border-gray-700">←</kbd>
                        <kbd class="bg-gray-800 px-2 py-0.5 rounded text-gray-400 font-mono border border-gray-700">→</kbd>
                    </div>
                </div>
            </div>

            <div class="h-px bg-gray-800"></div>

            <!-- Editing -->
            <div class="space-y-3">
                <h3 class="text-[10px] font-bold text-green-400 tracking-wider mb-2">EDICIÓN DE CLIPS</h3>
                
                <div class="flex items-center justify-between group">
                    <span class="text-xs text-gray-400 group-hover:text-green-300 transition-colors">Mover</span>
                    <div class="flex items-center gap-1">
                        <span class="w-5 h-5 rounded bg-gray-700/50 flex items-center justify-center text-[10px] text-gray-300 border border-gray-600">Z</span>
                        <span class="text-gray-500 text-[10px]">+</span>
                        <span class="w-5 h-5 rounded bg-gray-700/50 flex items-center justify-center text-[10px] text-gray-300 border border-gray-600">←</span>
                        <span class="w-5 h-5 rounded bg-gray-700/50 flex items-center justify-center text-[10px] text-gray-300 border border-gray-600">→</span>
                    </div>
                </div>

                <div class="flex items-center justify-between group">
                    <span class="text-xs text-gray-400 group-hover:text-green-300 transition-colors">Rápido (x3)</span>
                    <div class="flex items-center gap-1">
                        <span class="w-8 h-5 rounded bg-gray-700/50 flex items-center justify-center text-[10px] text-gray-300 border border-gray-600">Shift</span>
                        <span class="text-gray-500 text-[10px]">+</span>
                        <span class="w-5 h-5 rounded bg-gray-700/50 flex items-center justify-center text-[10px] text-gray-300 border border-gray-600">Action</span>
                    </div>
                </div>

                <div class="flex items-center justify-between group">
                    <span class="text-xs text-gray-400 group-hover:text-green-300 transition-colors">Super Rápido (x4)</span>
                    <div class="flex items-center gap-1">
                        <span class="w-16 h-5 rounded bg-gray-700/50 flex items-center justify-center text-[10px] text-gray-300 border border-gray-600">2x Shift</span>
                        <span class="text-gray-500 text-[10px]">+</span>
                         <span class="w-5 h-5 rounded bg-gray-700/50 flex items-center justify-center text-[10px] text-gray-300 border border-gray-600">Action</span>
                    </div>
                </div>

                <div class="flex items-center justify-between group">
                    <span class="text-xs text-gray-400 group-hover:text-green-300 transition-colors">Redim. Inicio</span>
                    <div class="flex items-center gap-1">
                        <span class="w-5 h-5 rounded bg-gray-700/50 flex items-center justify-center text-[10px] text-gray-300 border border-gray-600">X</span>
                        <span class="text-gray-500 text-[10px]">+</span>
                        <span class="w-5 h-5 rounded bg-gray-700/50 flex items-center justify-center text-[10px] text-gray-300 border border-gray-600">←</span>
                        <span class="w-5 h-5 rounded bg-gray-700/50 flex items-center justify-center text-[10px] text-gray-300 border border-gray-600">→</span>
                    </div>
                </div>

                <div class="flex items-center justify-between group">
                    <span class="text-xs text-gray-400 group-hover:text-green-300 transition-colors">Redim. Final</span>
                    <div class="flex items-center gap-1">
                        <span class="w-5 h-5 rounded bg-gray-700/50 flex items-center justify-center text-[10px] text-gray-300 border border-gray-600">C</span>
                        <span class="text-gray-500 text-[10px]">+</span>
                        <span class="w-5 h-5 rounded bg-gray-700/50 flex items-center justify-center text-[10px] text-gray-300 border border-gray-600">←</span>
                        <span class="w-5 h-5 rounded bg-gray-700/50 flex items-center justify-center text-[10px] text-gray-300 border border-gray-600">→</span>
                    </div>
                </div>

                <div class="flex items-center justify-between group">
                    <span class="text-xs text-gray-400 group-hover:text-green-300 transition-colors">Unir Clips</span>
                    <div class="flex items-center gap-1">
                        <span class="w-5 h-5 rounded bg-gray-700/50 flex items-center justify-center text-[10px] text-gray-300 border border-gray-600">J</span>
                        <span class="text-gray-500 text-[10px]">+</span>
                        <span class="w-5 h-5 rounded bg-gray-700/50 flex items-center justify-center text-[10px] text-gray-300 border border-gray-600">←</span>
                        <span class="w-5 h-5 rounded bg-gray-700/50 flex items-center justify-center text-[10px] text-gray-300 border border-gray-600">→</span>
                    </div>
                </div>

                <div class="flex items-center justify-between group">
                    <span class="text-xs text-gray-400 group-hover:text-green-300 transition-colors">Comprimir</span>
                    <div class="flex items-center gap-1">
                        <span class="w-8 h-5 rounded bg-gray-700/50 flex items-center justify-center text-[10px] text-gray-300 border border-gray-600">Alt</span>
                        <span class="text-gray-500 text-[10px]">+</span>
                        <span class="w-5 h-5 rounded bg-gray-700/50 flex items-center justify-center text-[10px] text-gray-300 border border-gray-600">←</span>
                        <span class="w-5 h-5 rounded bg-gray-700/50 flex items-center justify-center text-[10px] text-gray-300 border border-gray-600">→</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
`;
