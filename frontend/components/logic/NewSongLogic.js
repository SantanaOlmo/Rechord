
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

    btnNew?.addEventListener('click', () => {
        if (!authService.isAuthenticated()) return window.location.hash = '#/auth/login';
        openModal();
    });
    btnCancel?.addEventListener('click', closeModal);

    // Audio Duration Logic (Handled in loop below)

    // Drag & Drop
    [
        { zone: dropZone, input: audioInput, type: 'audio' },
        { zone: document.getElementById('drop-zone-image'), input: document.getElementById('image-input'), type: 'image' }
    ].forEach(({ zone, input, type }) => {
        if (zone && input) {

            // Click to open
            zone.addEventListener('click', () => input.click());

            // Visual feedback
            zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.classList.add('bg-indigo-50', 'border-indigo-500'); });
            zone.addEventListener('dragleave', () => zone.classList.remove('bg-indigo-50', 'border-indigo-500'));

            // Drop Handler
            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                zone.classList.remove('bg-indigo-50', 'border-indigo-500');
                if (e.dataTransfer.files.length) {
                    input.files = e.dataTransfer.files;
                    // Trigger change manually
                    const event = new Event('change');
                    input.dispatchEvent(event);
                }
            });

            // Input Change Handler (display filename)
            input.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const textP = zone.querySelector('p');
                    if (textP) textP.innerHTML = `<span class="text-indigo-600 font-bold">${file.name}</span>`;

                    // Specific logic for Audio Duration
                    if (type === 'audio') {
                        const audio = new Audio(URL.createObjectURL(file));
                        audio.onloadedmetadata = function () {
                            const dur = Math.round(audio.duration);
                            document.getElementById('song-duration').value = dur;
                            console.log('Duration detected:', dur);
                        };
                    }
                }
            });
        }
    });

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
