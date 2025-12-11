export function NewSongModal() {
    return `
        <div id="new-song-modal" class="modal-overlay hidden">
            <div class="modal-content" id="modal-content">
                <h3 class="modal-title">Nueva Canción</h3>
                <form id="new-song-form" class="space-y-4">
                    <input type="hidden" name="duracion" id="song-duration" value="0">
                    
                    <div class="form-group">
                        <label class="form-label">Título</label>
                        <input type="text" name="titulo" required class="form-input" placeholder="Ej: Wonderwall">
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4">
                        <div class="form-group">
                            <label class="form-label">Artista</label>
                            <input type="text" name="artista" required class="form-input" placeholder="Ej: Oasis">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Álbum</label>
                            <input type="text" name="album" class="form-input" placeholder="Ej: (What's the Story) Morning Glory?">
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div class="form-group">
                            <label class="form-label">Fecha Lanzamiento</label>
                            <input type="date" name="fecha_lanzamiento" class="form-input">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Nivel</label>
                            <select name="nivel" class="form-input">
                                <option value="Principiante">Principiante</option>
                                <option value="Intermedio">Intermedio</option>
                                <option value="Avanzado">Avanzado</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Hashtags (separados por coma)</label>
                        <input type="text" name="hashtags" class="form-input" placeholder="Ej: rock, 90s, britpop">
                    </div>

                    <div class="form-group">
                        <label class="form-label">Archivo de Audio (MP3, WAV, OGG)</label>
                        <div id="drop-zone" class="drop-zone border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200">
                            <input type="file" name="audio_file" id="audio-input" accept=".mp3,.wav,.ogg" required class="hidden">
                            <svg class="w-10 h-10 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                            <p class="text-sm text-gray-500">Arrastra tu audio aquí o haz clic</p>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Portada (Opcional)</label>
                        <div id="drop-zone-image" class="drop-zone border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200 relative overflow-hidden">
                            <input type="file" name="image_file" id="image-input" accept="image/*" class="hidden">
                            <div id="image-upload-content" class="pointer-events-none">
                                <svg class="w-10 h-10 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                                <p class="text-sm text-gray-500">Arrastra tu portada aquí o haz clic</p>
                            </div>
                            <img id="image-preview-element" class="absolute inset-0 w-full h-full object-cover hidden" />
                        </div>
                    </div>

                    <div class="modal-actions">
                        <button type="button" id="btn-cancel-modal" class="btn-cancel">Cancelar</button>
                        <button type="submit" class="btn-primary" style="width: auto;">Crear Canción</button>
                    </div>
                </form>

            </div>
        </div>
    `;
}
