
import { authService } from '../../services/authService.js';
import { createCancion } from '../../services/cancionService.js';

/**
 * Encapsulates Logic for New Song Modal
 * @param {Function} onSuccessCallback - Function to call after successful creation (usually reloading home)
 */
export function initNewSongLogic(onSuccessCallback) {
    const modal = document.getElementById('new-song-modal');
    const modalContent = document.getElementById('modal-content');
    const btnNew = document.getElementById('btn-new-song');
    const btnCancel = document.getElementById('btn-cancel-modal');
    const dropZone = document.getElementById('drop-zone');
    const audioInput = document.getElementById('audio-input');

    const openModal = () => {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        setTimeout(() => {
            modalContent.classList.remove('scale-95', 'opacity-0');
            modalContent.classList.add('scale-100', 'opacity-100');
        }, 10);
    };

    const closeModal = () => {
        modalContent.classList.remove('scale-100', 'opacity-100');
        modalContent.classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }, 300);
    };

    btnNew?.addEventListener('click', openModal);
    btnCancel?.addEventListener('click', closeModal);

    // Audio Duration Logic
    if (audioInput) {
        audioInput.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (file) {
                // Update dropzone text
                if (dropZone) dropZone.querySelector('p').textContent = `Archivo: ${file.name}`;

                // Get Duration
                const audio = new Audio(URL.createObjectURL(file));
                audio.onloadedmetadata = function () {
                    const dur = Math.round(audio.duration);
                    document.getElementById('song-duration').value = dur;
                    console.log('Duration detected:', dur);
                };
            }
        });
    }

    // Drag & Drop
    if (dropZone && audioInput) {
        dropZone.addEventListener('click', () => audioInput.click());
        dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('bg-indigo-50'); });
        dropZone.addEventListener('dragleave', () => dropZone.classList.remove('bg-indigo-50'));
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('bg-indigo-50');
            if (e.dataTransfer.files.length) {
                audioInput.files = e.dataTransfer.files;
                // Trigger change manually to calc duration
                const event = new Event('change');
                audioInput.dispatchEvent(event);
            }
        });
    }

    // New Song Submit
    document.getElementById('new-song-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        try {
            btn.disabled = true;
            btn.textContent = 'Subiendo...';
            const formData = new FormData(e.target);
            const user = authService.getCurrentUser();
            if (user) formData.append('id_usuario', user.id_usuario);

            await createCancion(formData);
            closeModal();
            if (onSuccessCallback) onSuccessCallback();
            e.target.reset();
            if (dropZone) dropZone.querySelector('p').textContent = 'Arrastra audio...';
        } catch (error) {
            alert(error.message);
        } finally {
            btn.disabled = false;
            btn.textContent = originalText;
        }
    });

    console.log('New Song Logic Initialized');
}
