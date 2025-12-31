import { state } from '../../synchronizer/store.js';
import { renderTimeline } from '../../synchronizer/rendering.js';

export const VersesManager = {
    init: () => {
        setupLyricsMode();
        setupRawTextProcessor();
    },

    syncRawFromVersesState: () => {
        syncRawFromVersesState();
    }
};

function setupLyricsMode() {
    const btns = document.querySelectorAll('.lyrics-mode-btn');
    const rawMode = document.getElementById('lyrics-mode-raw');
    const versesMode = document.getElementById('lyrics-mode-verses');

    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.mode;

            btns.forEach(b => {
                b.classList.remove('bg-gray-700', 'text-white', 'shadow');
                b.classList.add('text-gray-400');
            });
            btn.classList.remove('text-gray-400');
            btn.classList.add('bg-gray-700', 'text-white', 'shadow');

            if (mode === 'raw') {
                rawMode.classList.remove('hidden');
                versesMode.classList.add('hidden');
                syncRawFromVersesState();
            } else {
                rawMode.classList.add('hidden');
                versesMode.classList.remove('hidden');
                renderVersesList();
            }
        });
    });
}

function setupRawTextProcessor() {
    const btn = document.getElementById('btn-process-lyrics');
    if (btn) {
        btn.addEventListener('click', () => {
            const raw = document.getElementById('editor-lyrics-raw').value;
            const lines = raw.split(/\n\s*\n/).filter(line => line.trim() !== '');

            const newEstrofas = lines.map((text, i) => {
                const existing = state.estrofas[i];
                return {
                    id: i,
                    contenido: text.trim(),
                    tiempo_inicio: existing ? existing.tiempo_inicio : 0,
                    tiempo_fin: existing ? existing.tiempo_fin : 0,
                    type: 'lyrics'
                };
            });

            state.estrofas = newEstrofas;
            renderTimeline();

            // Switch to Verses View
            const versesBtn = document.querySelector('[data-mode="verses"]');
            if (versesBtn) versesBtn.click();
        });
    }
}

function renderVersesList() {
    const container = document.getElementById('editor-verses-list');
    if (!container) return;

    container.innerHTML = '';

    state.estrofas.forEach((estrofa, index) => {
        const row = document.createElement('div');
        row.className = 'flex items-start space-x-2 group p-1 hover:bg-gray-800/50 rounded transition';

        const num = document.createElement('span');
        num.className = 'text-xs text-gray-600 w-5 text-right mt-2 font-mono shrink-0';
        num.textContent = index + 1;

        const ta = document.createElement('textarea');
        ta.className = 'flex-1 bg-gray-800 border-none text-gray-300 text-xs rounded p-2 focus:ring-1 focus:ring-indigo-500 resize-none overflow-hidden';
        ta.rows = 1;
        ta.value = estrofa.contenido;

        setTimeout(() => {
            ta.style.height = 'auto';
            ta.style.height = (ta.scrollHeight) + 'px';
        }, 0);

        ta.addEventListener('input', () => {
            ta.style.height = 'auto';
            ta.style.height = (ta.scrollHeight) + 'px';
            state.estrofas[index].contenido = ta.value;
            renderTimeline();
        });

        ta.addEventListener('keydown', (e) => handleVerseKeydown(e, index, ta));

        row.appendChild(num);
        row.appendChild(ta);
        container.appendChild(row);
    });
}

function handleVerseKeydown(e, index, element) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const cursor = element.selectionStart;
        const text = element.value;
        const firstPart = text.substring(0, cursor).trim();
        const secondPart = text.substring(cursor).trim();

        state.estrofas[index].contenido = firstPart;
        element.value = firstPart;

        const prevEnd = state.estrofas[index].tiempo_fin;
        const newVerse = {
            id: Date.now(),
            contenido: secondPart,
            tiempo_inicio: prevEnd,
            tiempo_fin: prevEnd + 2,
        };

        state.estrofas.splice(index + 1, 0, newVerse);

        reindexEstrofas();
        renderVersesList();
        renderTimeline();

        setTimeout(() => {
            const textareas = document.getElementById('editor-verses-list').querySelectorAll('textarea');
            if (textareas[index + 1]) {
                textareas[index + 1].focus();
                textareas[index + 1].setSelectionRange(0, 0);
            }
        }, 0);
    }

    if (e.key === 'Backspace' && element.selectionStart === 0 && element.selectionEnd === 0) {
        if (index > 0) {
            e.preventDefault();
            const currentText = element.value;
            const prevText = state.estrofas[index - 1].contenido;

            state.estrofas[index - 1].contenido = (prevText + ' ' + currentText).trim();
            state.estrofas.splice(index, 1);

            reindexEstrofas();
            renderVersesList();
            renderTimeline();

            setTimeout(() => {
                const textareas = document.getElementById('editor-verses-list').querySelectorAll('textarea');
                if (textareas[index - 1]) {
                    textareas[index - 1].focus();
                    const pos = prevText.length + 1;
                    textareas[index - 1].setSelectionRange(pos, pos);
                }
            }, 0);
        }
    }
}

function reindexEstrofas() {
    state.estrofas.forEach((e, i) => e.order = i);
}

function syncRawFromVersesState() {
    const raw = document.getElementById('editor-lyrics-raw');
    if (raw) {
        raw.value = state.estrofas.map(e => e.contenido).join('\n\n');
    }
}
