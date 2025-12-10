export function EditSongModal() {
    return `
        <div id="edit-song-modal" class="modal-overlay hidden">
            <div class="modal-content flex flex-col h-[85vh]" id="edit-modal-content">
                <h3 class="modal-title mb-4 shrink-0">Editar Propiedades de Canción</h3>
                <form id="edit-song-form" class="space-y-4 flex flex-col flex-1 overflow-hidden">
                    <input type="hidden" name="id_cancion" id="edit-id-cancion">
                    <input type="hidden" name="action" value="update">
                    
                    <!-- Tabs Header -->
                    <div class="flex border-b border-gray-700 mb-6">
                        <button type="button" class="px-4 py-2 text-white border-b-2 border-indigo-500 font-medium transition-colors" data-tab="props">Propiedades</button>
                        <button type="button" class="px-4 py-2 text-gray-400 hover:text-white transition-colors" data-tab="lyrics">Letra</button>
                        <button type="button" class="px-4 py-2 text-gray-400 hover:text-white transition-colors" data-tab="verses">Versos</button>
                    </div>

                    <!-- Tab Content: Properties -->
                    <div id="tab-props" class="tab-content space-y-4 overflow-y-auto flex-1 px-1 scrollbar-hide">
                        <div class="form-group">
                            <label class="form-label">Título</label>
                            <input type="text" name="titulo" id="edit-titulo" required class="form-input">
                        </div>
                        
                        <div class="grid grid-cols-2 gap-4">
                            <div class="form-group">
                                <label class="form-label">Artista</label>
                                <input type="text" name="artista" id="edit-artista" required class="form-input">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Álbum</label>
                                <input type="text" name="album" id="edit-album" class="form-input">
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                            <div class="form-group">
                                <label class="form-label">Fecha Lanzamiento</label>
                                <input type="date" name="fecha_lanzamiento" id="edit-fecha" class="form-input">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Nivel</label>
                                <select name="nivel" id="edit-nivel" class="form-input">
                                    <option value="Principiante">Principiante</option>
                                    <option value="Intermedio">Intermedio</option>
                                    <option value="Avanzado">Avanzado</option>
                                </select>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                             <div class="form-group">
                                <label class="form-label">Hashtags (csv)</label>
                                <input type="text" name="hashtags" id="edit-hashtags" class="form-input" placeholder="rock, 90s">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Duración (segundos)</label>
                                <div class="flex items-center space-x-2">
                                    <input type="number" name="duracion" id="edit-duracion" class="form-input flex-1">
                                    <button type="button" id="btn-detect-duration" class="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-xs" title="Detectar desde archivo">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Portada (Opcional)</label>
                            <div class="flex items-center space-x-4">
                                <div class="relative w-16 h-16 rounded overflow-hidden bg-gray-800 border border-gray-700">
                                    <img id="edit-image-preview" src="" alt="Preview" class="w-full h-full object-cover">
                                </div>
                                <input type="file" name="image_file" id="edit-image-input" accept="image/*" 
                                       class="form-input file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 flex-1">
                            </div>
                        </div>
                    </div>

                    <!-- Tab Content: Lyrics -->
                    <div id="tab-lyrics" class="tab-content hidden flex-1 flex flex-col min-h-0">
                        <label class="form-label mb-2 block shrink-0">Letra (Estrofas separadas por línea en blanco)</label>
                        <textarea name="lyrics" id="edit-lyrics" class="form-input flex-1 w-full font-mono text-sm leading-relaxed scrollbar-hide p-4 resize-none"></textarea>
                    </div>

                    <!-- Tab Content: Verses Editor -->
                    <div id="tab-verses" class="tab-content hidden flex-1 flex flex-col min-h-0 relative">
                        <div class="flex justify-between items-center mb-2 px-1 shrink-0">
                            <label class="form-label mb-0">Editor de Versos</label>
                            <span class="text-xs text-gray-400">Enter: Dividir | Backspace al inicio: Unir</span>
                        </div>
                        <div id="verses-container" class="space-y-4 overflow-y-auto flex-1 p-2 bg-gray-900/50 rounded border border-gray-700 scrollbar-hide">
                            <!-- Helper Text if empty -->
                            <p class="text-gray-500 text-center mt-10">No hay versos. Escribe la letra en la pestaña 'Letra' o aquí.</p>
                        </div>
                    </div>

                    <div class="modal-actions mt-4 pt-4 border-t border-gray-700 shrink-0">
                        <button type="button" id="btn-cancel-edit" class="btn-cancel">Cancelar</button>
                        <button type="submit" class="btn-primary" style="width: auto;">Guardar Cambios</button>
                    </div>
                </form>
            </div>
        </div>
    `;
}
