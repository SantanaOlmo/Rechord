export function NewSongModal() {
    return `
        <div id="new-song-modal" class="modal-overlay hidden">
            <div class="modal-content" id="modal-content">
                <h3 class="modal-title">Nueva Canción</h3>
                <form id="new-song-form" class="space-y-4">
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
                            <label class="form-label">Nivel</label>
                            <select name="nivel" class="form-input">
                                <option value="Principiante">Principiante</option>
                                <option value="Intermedio">Intermedio</option>
                                <option value="Avanzado">Avanzado</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Archivo de Audio (MP3, WAV, OGG)</label>
                        <div id="drop-zone" class="drop-zone border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200">
                            <input type="file" name="audio_file" accept=".mp3,.wav,.ogg" required class="hidden">
                            <p class="text-gray-400">Arrastra tu archivo de audio aquí o haz clic para seleccionar</p>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Portada (Opcional)</label>
                        <input type="file" name="image_file" accept="image/*" class="form-input file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100">
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
