
export const SyncShortcuts = () => {
    // Helper for consistent key styling
    // User wants: "lighter background" (bg-gray-700/50), "bigger arrows" (text-xs instead of text-[10px]), separated keys.
    const Key = (text, width = "auto") => `
        <div class="h-6 ${width === 'auto' ? 'px-2' : width} rounded bg-gray-700/50 flex items-center justify-center text-xs font-mono text-gray-200 border border-gray-600 shadow-sm min-w-[24px]">
            ${text}
        </div>
    `;

    const Plus = () => `<span class="text-gray-500 text-[10px] font-bold mx-1">+</span>`;

    return `
    <!-- PANEL: SHORTCUTS -->
    <div id="panel-shortcuts" class="editor-panel hidden flex-col h-full bg-[var(--bg-secondary)] overflow-y-auto scrollbar-hide">
        <div class="px-4 py-3 border-b border-[var(--border-primary)] bg-[var(--bg-secondary)] shrink-0 sticky top-0 z-10">
            <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider">Atajos de Teclado</h3>
        </div>
        <div class="p-4 space-y-5">
            
            <!-- Playback / General -->
            <div class="space-y-2">
                <h4 class="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">General</h4>
                
                <div class="flex justify-between items-center group">
                    <span class="text-xs text-gray-300">Play/Pause</span>
                    ${Key('Espacio')}
                </div>

                <div class="flex justify-between items-center group">
                    <span class="text-xs text-gray-300">Seleccionar</span>
                    ${Key('Click')}
                </div>

                <div class="flex justify-between items-center group">
                    <span class="text-xs text-gray-300">Guardar</span>
                    <div class="flex items-center">
                        ${Key('Ctrl')}
                        ${Plus()}
                        ${Key('S')}
                    </div>
                </div>

                <div class="flex justify-between items-center group">
                    <span class="text-xs text-gray-300">Deshacer</span>
                    <div class="flex items-center">
                        ${Key('Ctrl')}
                        ${Plus()}
                        ${Key('Z')}
                    </div>
                </div>
            </div>

            <div class="h-px bg-gray-800"></div>

            <!-- Navigation -->
            <div class="space-y-2">
                <h4 class="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Navegación</h4>
                
                <div class="flex justify-between items-center group">
                    <span class="text-xs text-gray-300">Mover Playhead</span>
                    <div class="flex items-center gap-1">
                        ${Key('←')}
                        ${Key('→')}
                    </div>
                </div>

                <div class="flex justify-between items-center group">
                    <span class="text-xs text-gray-300">Seleccionar</span>
                    <div class="flex items-center">
                        ${Key('Shift')}
                        ${Plus()}
                        ${Key('←')}
                        ${Key('→')}
                    </div>
                </div>
            </div>

            <div class="h-px bg-gray-800"></div>

            <!-- Editing -->
            <div class="space-y-3">
                <h3 class="text-[10px] font-bold text-green-400 tracking-wider mb-2">EDICIÓN DE CLIPS</h3>
                
                <!-- Mover -->
                <div class="flex items-center justify-between group">
                    <span class="text-xs text-gray-400 group-hover:text-green-300 transition-colors">Mover</span>
                    <div class="flex items-center">
                        ${Key('Z')}
                        ${Plus()}
                        ${Key('←')}
                        ${Key('→')}
                    </div>
                </div>

                <!-- Mover Rapido -->
                <div class="flex items-center justify-between group">
                    <span class="text-xs text-gray-400 group-hover:text-green-300 transition-colors">Mover Rápido (x3)</span>
                    <div class="flex items-center">
                        ${Key('Shift')}
                        ${Plus()}
                        ${Key('Z')}
                        ${Plus()}
                        ${Key('←')}
                        ${Key('→')}
                    </div>
                </div>

                <!-- Mover Super Rapido -->
                <div class="flex items-center justify-between group">
                    <span class="text-xs text-gray-400 group-hover:text-green-300 transition-colors">Mover Super Rápido (x6)</span>
                    <div class="flex items-center">
                        ${Key('2x Shift')}
                        ${Plus()}
                        ${Key('Z')}
                        ${Plus()}
                        ${Key('←')}
                        ${Key('→')}
                    </div>
                </div>

                <!-- Redim Inicio -->
                <div class="flex items-center justify-between group">
                    <span class="text-xs text-gray-400 group-hover:text-green-300 transition-colors">Redim. Inicio</span>
                    <div class="flex items-center">
                        ${Key('X')}
                        ${Plus()}
                        ${Key('←')}
                        ${Key('→')}
                    </div>
                </div>

                <!-- Redim Final -->
                <div class="flex items-center justify-between group">
                    <span class="text-xs text-gray-400 group-hover:text-green-300 transition-colors">Redim. Final</span>
                    <div class="flex items-center">
                        ${Key('C')}
                        ${Plus()}
                        ${Key('←')}
                        ${Key('→')}
                    </div>
                </div>

                <!-- Unir -->
                <div class="flex items-center justify-between group">
                    <span class="text-xs text-gray-400 group-hover:text-green-300 transition-colors">Unir Clips</span>
                    <div class="flex items-center">
                        ${Key('J')}
                        ${Plus()}
                        ${Key('←')}
                        ${Key('→')}
                    </div>
                </div>

                <!-- Editar Espaciado -->
                <div class="flex items-center justify-between group">
                    <span class="text-xs text-gray-400 group-hover:text-green-300 transition-colors">Editar espaciado entre clips</span>
                    <div class="flex items-center">
                        ${Key('Alt')}
                        ${Plus()}
                        ${Key('←')}
                        ${Key('→')}
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
};
