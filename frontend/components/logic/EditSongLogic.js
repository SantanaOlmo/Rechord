
import { getCancion, updateCancion } from '../services/cancionService.js';
import { CONTENT_BASE_URL } from '../config.js';

/**
 * Encapsulates Logic for Edit Song Modal
 * @param {Function} onSuccessCallback - Function to call after successful update
 */
export function initEditSongLogic(onSuccessCallback) {
    const editModal = document.getElementById('edit-song-modal');
    const btnCancelEdit = document.getElementById('btn-cancel-edit');
    const editForm = document.getElementById('edit-song-form');

    const closeEditModal = () => {
        const editContent = document.getElementById('edit-modal-content');
        editContent.classList.remove('scale-100', 'opacity-100');
        editContent.classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
            editModal.classList.add('hidden');
            editModal.classList.remove('flex');
        }, 300);
    };

    btnCancelEdit?.addEventListener('click', closeEditModal);

    // Expose openEditModal to window so it can be called from HTML onclicks (if any) or other modules
    window.openEditModal = async (id) => {
        try {
            const song = await getCancion(id);
            if (!song) throw new Error('No se pudo cargar la canción');
            document.getElementById('edit-id-cancion').value = song.id_cancion;
            document.getElementById('edit-titulo').value = song.titulo;
            document.getElementById('edit-artista').value = song.artista;
            document.getElementById('edit-album').value = song.album || '';
            document.getElementById('edit-nivel').value = song.nivel;
            document.getElementById('edit-duracion').value = song.duracion || 0;
            document.getElementById('edit-fecha').value = song.fecha_lanzamiento || '';

            // Image Preview Logic
            const preview = document.getElementById('edit-image-preview');
            const input = document.getElementById('edit-image-input');
            if (preview) {
                preview.src = song.ruta_imagen ? `${CONTENT_BASE_URL}/${song.ruta_imagen}` : 'assets/images/default-album.png';
            }
            if (input) input.value = ''; // Reset input

            const btnDetect = document.getElementById('btn-detect-duration');
            if (btnDetect) {
                btnDetect.dataset.url = song.ruta_mp3 ? `${CONTENT_BASE_URL}/${song.ruta_mp3}` : '';
                btnDetect.classList.toggle('hidden', !song.ruta_mp3);
            }

            let tags = song.hashtags;
            if (typeof tags === 'string') { try { tags = JSON.parse(tags); } catch (e) { tags = []; } }
            if (!Array.isArray(tags)) tags = [];
            document.getElementById('edit-hashtags').value = tags.join(', ');

            editModal.classList.remove('hidden');
            editModal.classList.add('flex');

            // Animate content
            const editContent = document.getElementById('edit-modal-content');
            setTimeout(() => {
                editContent.classList.remove('scale-95', 'opacity-0');
                editContent.classList.add('scale-100', 'opacity-100');
            }, 10);
        } catch (error) {
            alert('Error: ' + error.message);
        }
    };

    // Detect Duration Handler
    document.getElementById('btn-detect-duration')?.addEventListener('click', (e) => {
        const btn = e.currentTarget;
        const url = btn.dataset.url;
        if (!url) return alert('No hay archivo de audio asociado');

        const originalText = btn.innerHTML;
        btn.innerHTML = '...';
        btn.disabled = true;

        const audio = new Audio(url);
        audio.onloadedmetadata = () => {
            const duration = Math.round(audio.duration);
            document.getElementById('edit-duracion').value = duration;
            btn.innerHTML = originalText;
            btn.disabled = false;
        };
        audio.onerror = () => {
            alert('Error al cargar el audio para detectar duración');
            btn.innerHTML = originalText;
            btn.disabled = false;
        };
    });

    // Preview change listener
    const imgInput = document.getElementById('edit-image-input');
    if (imgInput) {
        imgInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (evt) => document.getElementById('edit-image-preview').src = evt.target.result;
                reader.readAsDataURL(file);
            }
        };
    }

    editForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData(editForm);
            formData.append('action', 'update');
            await updateCancion(formData);
            closeEditModal();
            if (onSuccessCallback) onSuccessCallback();
        } catch (error) {
            alert(error.message);
        }
    });

    console.log('Edit Song Logic Initialized');
}
