
import { getCancion, updateCancion } from '../../services/cancionService.js';
import { getEstrofas } from '../../services/estrofaService.js';
import { CONTENT_BASE_URL } from '../../config.js';

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


    // Tab Switching Logic
    const tabs = editModal.querySelectorAll('[data-tab]');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Reset Active State
            tabs.forEach(t => {
                t.classList.remove('text-white', 'border-b-2', 'border-indigo-500');
                t.classList.add('text-gray-400');
            });
            // Set Active
            tab.classList.remove('text-gray-400');
            tab.classList.add('text-white', 'border-b-2', 'border-indigo-500');

            // Show Content
            const target = tab.dataset.tab;
            document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));
            document.getElementById(`tab-${target}`).classList.remove('hidden');

            // Specific Logic for Verses Tab
            if (target === 'verses') {
                renderVerses();
            }
        });
    });

    // --- Verse Editor Logic ---
    function renderVerses() {
        const container = document.getElementById('verses-container');
        const prevScroll = container.scrollTop;

        const rawLyrics = document.getElementById('edit-lyrics').value;
        // Split by double newline to get stanzas
        const verses = rawLyrics.split(/\n\s*\n/).filter(v => v.trim() !== '');

        container.innerHTML = '';

        if (verses.length === 0) {
            // If empty, create one empty verse to start
            verses.push('');
        }

        verses.forEach((verseText, index) => {
            const verseWrapper = document.createElement('div');
            verseWrapper.className = 'flex items-start space-x-2 group';

            // Number
            const num = document.createElement('span');
            num.className = 'text-gray-600 text-xs mt-3 w-4 text-right shrink-0 select-none';
            num.textContent = index + 1;

            // Textarea
            const verseEl = document.createElement('textarea');
            verseEl.className = 'flex-1 bg-gray-800 text-white p-3 rounded border border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm leading-relaxed resize-none overflow-hidden transition-colors';
            verseEl.value = verseText;
            verseEl.rows = 1;
            verseEl.dataset.index = index;

            // Events
            verseEl.addEventListener('input', function () {
                this.style.height = 'auto';
                this.style.height = (this.scrollHeight + 2) + 'px';
                syncLyricsFromVerses();
            });

            verseEl.addEventListener('keydown', (e) => handleVerseKeydown(e, index, verseEl));

            // Focus style helper
            verseEl.addEventListener('focus', () => verseWrapper.classList.add('verse-focused'));
            verseEl.addEventListener('blur', () => verseWrapper.classList.remove('verse-focused'));

            verseWrapper.appendChild(num);
            verseWrapper.appendChild(verseEl);
            container.appendChild(verseWrapper);

            // Auto-resize on init (Synchronous to allow scroll restore)
            verseEl.style.height = 'auto';
            verseEl.style.height = (verseEl.scrollHeight + 2) + 'px';
        });

        // Restore Scroll Position
        container.scrollTop = prevScroll;
    }

    function syncLyricsFromVerses() {
        const container = document.getElementById('verses-container');
        const textareas = container.querySelectorAll('textarea');
        const verses = Array.from(textareas).map(el => el.value.trim()).filter(v => v !== '');
        document.getElementById('edit-lyrics').value = verses.join('\n\n');
    }

    function handleVerseKeydown(e, index, element) {
        // ENTER: Split Verse
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const cursor = element.selectionStart;
            const text = element.value;
            const firstPart = text.substring(0, cursor).trim();
            const secondPart = text.substring(cursor).trim();

            // Update current verse text
            element.value = firstPart;

            // Insert new verse in DOM + Data logic by re-rendering? 
            // Better to manipulate data array logic via sync first
            syncLyricsFromVerses();

            // Now we need to inject the new content. 
            // Let's get the master value, splice it, and re-render.
            // This is safer than DOM manipulation for index integrity.
            const fullText = document.getElementById('edit-lyrics').value;
            let allVerses = fullText.split(/\n\s*\n/).filter(v => v !== '');

            // "syncLyricsFromVerses" effectively saved the *first part* in the current index (if we assume it updated the array correctly? No, sync reads from DOM)
            // Wait, syncLyricsFromVerses read the incomplete state if we didn't inject the second part yet?
            // Actually: we modified element.value to firstPart. So sync saved firstPart at index.
            // But secondPart is lost unless we add it. 
            // So: 

            // 1. Get current list from DOM *before* render
            const container = document.getElementById('verses-container');
            const textareas = Array.from(container.querySelectorAll('textarea'));
            const currentVerses = textareas.map(t => t.value); // element.value is already firstPart

            // 2. Insert secondPart at index + 1
            currentVerses.splice(index + 1, 0, secondPart);

            // 3. Update Master
            document.getElementById('edit-lyrics').value = currentVerses.join('\n\n');

            // 4. Re-render and Focus next
            renderVerses();

            setTimeout(() => {
                const newInputs = document.getElementById('verses-container').querySelectorAll('textarea');
                if (newInputs[index + 1]) {
                    newInputs[index + 1].focus();
                    newInputs[index + 1].setSelectionRange(0, 0);
                }
            }, 0);
        }

        // BACKSPACE: Merge with Previous
        if (e.key === 'Backspace' && element.selectionStart === 0 && element.selectionEnd === 0) {
            if (index > 0) {
                e.preventDefault();
                const currentText = element.value;

                // Get all verses
                syncLyricsFromVerses(); // Sync current state
                const fullText = document.getElementById('edit-lyrics').value;
                let allVerses = fullText.split(/\n\s*\n/);

                // Content of previous
                const prevText = allVerses[index - 1];
                const newPrevText = (prevText + ' ' + currentText).trim();

                // Merge
                allVerses[index - 1] = newPrevText;
                allVerses.splice(index, 1);

                document.getElementById('edit-lyrics').value = allVerses.join('\n\n');
                renderVerses();

                // Focus previous at join point
                setTimeout(() => {
                    const newInputs = document.getElementById('verses-container').querySelectorAll('textarea');
                    if (newInputs[index - 1]) {
                        newInputs[index - 1].focus();
                        const len = prevText.length + (prevText ? 1 : 0); // +1 for space if not empty? We added space above.
                        newInputs[index - 1].setSelectionRange(len, len);
                    }
                }, 0);
            }
        }

        // DELETE: Merge with Next (at end of line) -> Optional but good UX
        // Left out for now to keep strictly to user request unless intuitive?
        // User asked "o delete (el borrar) deshacer un verso". "delete" usually means Del key, "borrar" means Backspace usually.
        // But "deshacer un verso" implies deleting the break. Backspace at start does that.
    }

    // Expose openEditModal
    window.openEditModal = async (id) => {
        try {
            // Reset Tabs to Props
            tabs[0].click();

            const [song, estrofas] = await Promise.all([
                getCancion(id),
                getEstrofas(id)
            ]);

            if (!song) throw new Error('No se pudo cargar la canción');

            // Populate Props
            document.getElementById('edit-id-cancion').value = song.id_cancion;
            document.getElementById('edit-titulo').value = song.titulo;
            document.getElementById('edit-artista').value = song.artista;
            document.getElementById('edit-album').value = song.album || '';
            document.getElementById('edit-nivel').value = song.nivel;
            document.getElementById('edit-duracion').value = song.duracion || 0;
            document.getElementById('edit-fecha').value = song.fecha_lanzamiento || '';

            // Populate Lyrics
            const lyricsText = estrofas ? estrofas.map(e => e.contenido).join('\n\n') : '';
            document.getElementById('edit-lyrics').value = lyricsText;

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
