export function EditSongModal() {
    return `
        <div id="edit-song-modal" class="modal-overlay hidden">
            <div class="modal-content" id="edit-modal-content">
                <h3 class="modal-title">Editar Propiedades de Canción</h3>
                <form id="edit-song-form" class="space-y-4">
                    <input type="hidden" name="id_cancion" id="edit-id-cancion">
                    <input type="hidden" name="action" value="update">
                    
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
                            <input type="number" name="duracion" id="edit-duracion" class="form-input">
                        </div>
                    </div>

                    <div class="modal-actions">
                        <button type="button" id="btn-cancel-edit" class="btn-cancel">Cancelar</button>
                        <button type="submit" class="btn-primary" style="width: auto;">Guardar Cambios</button>
                    </div>
                </form>
            </div>
        </div>
    `;
}
