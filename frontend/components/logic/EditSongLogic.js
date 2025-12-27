import { getCancion, updateCancion } from '../../services/cancionService.js';
import { getEstrofas } from '../../services/estrofaService.js';
import { CONTENT_BASE_URL } from '../../config.js';
import { VerseEditor } from './editor/VerseEditor.js';
import { loadBackgrounds, setBackgroundSongId } from './editor/BackgroundManager.js';

export function initEditSongLogic(onSuccessCallback) {
    console.log('initEditSongLogic: Initializing...');

    // Define Global Function Immediately
    window.openEditModal = async (id) => {
        console.log('openEditModal called with ID:', id);

        const editModal = document.getElementById('edit-song-modal');
        if (!editModal) {
            console.error('Edit Modal not found in DOM');
            alert('Error: Modal de edición no encontrado.');
            return;
        }

        setBackgroundSongId(id);

        try {
            // Lazy DOM lookups
            const tabs = editModal.querySelectorAll('[data-tab]');
            if (tabs.length > 0) tabs[0].click();

            const [song, estrofas] = await Promise.all([getCancion(id), getEstrofas(id)]);
            if (!song) throw new Error('No se pudo cargar la canción la id ' + id);

            // Helpers
            const setVal = (eid, val) => {
                const el = document.getElementById(eid);
                if (el) el.value = val;
            };

            // Populate Fields
            setVal('edit-id-cancion', song.id_cancion);
            setVal('edit-titulo', song.titulo);
            setVal('edit-artista', song.artista);
            setVal('edit-album', song.album || '');
            setVal('edit-nivel', song.nivel);
            setVal('edit-duracion', song.duracion || 0);
            setVal('edit-fecha', song.fecha_lanzamiento || '');

            setVal('edit-lyrics', estrofas ? estrofas.map(e => e.contenido).join('\n\n') : '');

            // Image
            const imgPreview = document.getElementById('edit-image-preview');
            // SVG Placeholder (Dark gray with note)
            const DEFAULT_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='2' y='2' width='20' height='20' rx='2' ry='2' fill='%231f2937' stroke='none'/%3E%3Cpath d='M9 18V5l12-2v13'/%3E%3Ccircle cx='6' cy='18' r='3'/%3E%3Ccircle cx='18' cy='16' r='3'/%3E%3C/svg%3E";

            if (imgPreview) {
                imgPreview.src = song.ruta_imagen ? `${CONTENT_BASE_URL}/${song.ruta_imagen}` : DEFAULT_IMG;
                imgPreview.onerror = () => imgPreview.src = DEFAULT_IMG;
            }
            const imgInput = document.getElementById('edit-image-input');
            if (imgInput) imgInput.value = '';

            // Hashtags
            let tags = song.hashtags;
            try { tags = typeof tags === 'string' ? JSON.parse(tags) : []; } catch (e) { tags = []; }
            setVal('edit-hashtags', Array.isArray(tags) ? tags.join(', ') : '');

            // Audio Button

            const btnDetect = document.getElementById('btn-detect-duration');
            if (btnDetect) {
                btnDetect.dataset.url = song.ruta_mp3 ? `${CONTENT_BASE_URL}/${song.ruta_mp3}` : '';
                btnDetect.classList.toggle('hidden', !song.ruta_mp3);
            }

            // Show Modal
            editModal.classList.remove('hidden');
            editModal.classList.add('flex');
            // Animation
            setTimeout(() => {
                const content = document.getElementById('edit-modal-content');
                if (content) {
                    content.classList.remove('scale-95', 'opacity-0');
                    content.classList.add('scale-100', 'opacity-100');
                }
            }, 10);

        } catch (error) {
            console.error(error);
            alert('Error al abrir editor: ' + error.message);
        }
    };

    // Setup Listeners (Lazy)
    const setupListeners = () => {
        const editModal = document.getElementById('edit-song-modal');
        if (!editModal) {
            // If checking immediately fails, wait a bit and try again (DOM race)
            setTimeout(setupListeners, 500);
            return;
        }

        // Close Button
        const btnCancel = document.getElementById('btn-cancel-edit');
        if (btnCancel) {
            btnCancel.onclick = () => {
                const content = document.getElementById('edit-modal-content');
                if (content) {
                    content.classList.remove('scale-100', 'opacity-100');
                    content.classList.add('scale-95', 'opacity-0');
                }
                setTimeout(() => {
                    editModal.classList.add('hidden');
                    editModal.classList.remove('flex');
                }, 300);
            };
        }

        // Tabs
        editModal.querySelectorAll('[data-tab]').forEach(tab => {
            tab.onclick = () => {
                // UI Toggle
                editModal.querySelectorAll('[data-tab]').forEach(t => {
                    t.classList.replace('text-white', 'text-gray-400');
                    t.classList.remove('border-b-2', 'border-indigo-500');
                });
                tab.classList.replace('text-gray-400', 'text-white');
                tab.classList.add('border-b-2', 'border-indigo-500');

                // Content Toggle
                const target = tab.dataset.tab;
                document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
                const targetContent = document.getElementById(`tab-${target}`);
                if (targetContent) targetContent.classList.remove('hidden');

                // Module Call
                if (target === 'verses') VerseEditor.renderVerses();
                else if (target === 'backgrounds') loadBackgrounds();
            };
        });

        // Submit Form
        const form = document.getElementById('edit-song-form');
        if (form) {
            form.onsubmit = async (e) => {
                e.preventDefault();
                try {
                    const fd = new FormData(form);
                    fd.append('action', 'update');
                    await updateCancion(fd);
                    if (btnCancel) btnCancel.click(); // Close
                    if (onSuccessCallback) onSuccessCallback();
                } catch (e) {
                    alert('Error guardando: ' + e.message);
                }
            };
        }

        // Image Input
        const imgIn = document.getElementById('edit-image-input');
        if (imgIn) {
            imgIn.onchange = (e) => {
                if (e.target.files[0]) {
                    const r = new FileReader();
                    r.onload = (ev) => document.getElementById('edit-image-preview').src = ev.target.result;
                    r.readAsDataURL(e.target.files[0]);
                }
            };
        }

        // Detect Duration
        const btnDet = document.getElementById('btn-detect-duration');
        if (btnDet) {
            btnDet.onclick = () => {
                if (!btnDet.dataset.url) return;
                const oldTxt = btnDet.innerHTML;
                btnDet.innerHTML = '...';
                const a = new Audio(btnDet.dataset.url);
                a.onloadedmetadata = () => {
                    document.getElementById('edit-duracion').value = Math.round(a.duration);
                    btnDet.innerHTML = oldTxt;
                };
                a.onerror = () => {
                    btnDet.innerHTML = oldTxt;
                    alert('Error cargando audio');
                };
            };
        }
    };

    // Attempt setup
    setupListeners();

}
