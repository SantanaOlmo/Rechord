import { state } from '../synchronizer/store.js';
import { renderTimeline, updateActiveVerse } from '../synchronizer/rendering.js';
import { ChordEditorLogic } from '../../logic/chordEditor/index.js';
import { SettingsLogic } from './SettingsLogic.js';

/**
 * Handles the Split/Merge logic for the Sidebar Verse Editor
 */
export const EditorSidebarLogic = {
    init: () => {
        setupTabs();
        setupLyricsMode();
        setupRawTextProcessor();
        syncRawFromVersesState();
        ChordEditorLogic.init(); // Init Chord Editor
        SettingsLogic.init();
    }
};

// setupSettingsPanel removed - moved to SettingsLogic.js


function setupTabs() {
    const navBtns = document.querySelectorAll('.sidebar-nav-btn');
    const panels = document.querySelectorAll('.editor-panel');

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Deactivate all
            navBtns.forEach(b => {
                b.classList.remove('bg-indigo-600', 'text-white', 'shadow-lg');
                b.classList.add('text-gray-500');
            });
            panels.forEach(p => p.classList.add('hidden'));

            // Activate Clicked
            btn.classList.remove('text-gray-500');
            btn.classList.add('bg-indigo-600', 'text-white', 'shadow-lg');

            const target = btn.dataset.panel;
            const panel = document.getElementById(`panel-${target}`);
            if (panel) {
                panel.classList.remove('hidden');
                panel.classList.add('flex');
            }
        });
    });
}

function setupLyricsMode() {
    const btns = document.querySelectorAll('.lyrics-mode-btn');
    const rawMode = document.getElementById('lyrics-mode-raw');
    const versesMode = document.getElementById('lyrics-mode-verses');

    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.mode;

            // Toggle Buttons
            btns.forEach(b => {
                b.classList.remove('bg-gray-700', 'text-white', 'shadow');
                b.classList.add('text-gray-400');
            });
            btn.classList.remove('text-gray-400');
            btn.classList.add('bg-gray-700', 'text-white', 'shadow');

            // Toggle Content
            if (mode === 'raw') {
                rawMode.classList.remove('hidden');
                versesMode.classList.add('hidden');
                // Sync back from verses if switching to raw?
                // For now, raw is master source on load, but if verses changed:
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

            // Update State
            // We preserve timing if possible, but splitting usually resets timing unless sophisticated match.
            // Requirement: "lo unico que habría que hacer es unir o subdividir... debe verse reflejado inmediamente"
            // If completely replacing text, we might lose timings. 
            // BUT: The user asked for "same duplicate functionality".
            // In EditSongLogic, it just splits text.

            // Map strings to estrofa objects
            const newEstrofas = lines.map((text, i) => {
                // Try to keep existing timing if index matches?
                const existing = state.estrofas[i];
                return {
                    id: i, // Temp ID
                    contenido: text.trim(),
                    tiempo_inicio: existing ? existing.tiempo_inicio : 0,
                    tiempo_fin: existing ? existing.tiempo_fin : 0,
                    type: 'lyrics' // Helper
                };
            });

            state.estrofas = newEstrofas;
            renderTimeline();

            // Switch to Verses View
            document.querySelector('[data-mode="verses"]').click();
        });
    }
}

// -- Verse List Logic (The Core Request) --

function renderVersesList() {
    const container = document.getElementById('editor-verses-list');
    if (!container) return;

    container.innerHTML = '';

    state.estrofas.forEach((estrofa, index) => {
        const row = document.createElement('div');
        row.className = 'flex items-start space-x-2 group p-1 hover:bg-gray-800/50 rounded transition';

        // Index
        const num = document.createElement('span');
        num.className = 'text-xs text-gray-600 w-5 text-right mt-2 font-mono shrink-0';
        num.textContent = index + 1;

        // Textarea
        const ta = document.createElement('textarea');
        ta.className = 'flex-1 bg-gray-800 border-none text-gray-300 text-xs rounded p-2 focus:ring-1 focus:ring-indigo-500 resize-none overflow-hidden';
        ta.rows = 1;
        ta.value = estrofa.contenido;

        // Auto-resize
        setTimeout(() => {
            ta.style.height = 'auto';
            ta.style.height = (ta.scrollHeight) + 'px';
        }, 0);

        // Events
        ta.addEventListener('input', () => {
            ta.style.height = 'auto';
            ta.style.height = (ta.scrollHeight) + 'px';

            // Real-time Update Content
            state.estrofas[index].contenido = ta.value;
            // Might need to update timeline if timeline shows text preview? Yes, track-verses shows text.
            renderTimeline();
        });

        ta.addEventListener('keydown', (e) => handleVerseKeydown(e, index, ta));

        row.appendChild(num);
        row.appendChild(ta);
        container.appendChild(row);
    });
}

function handleVerseKeydown(e, index, element) {
    // ENTER: Split
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const cursor = element.selectionStart;
        const text = element.value;
        const firstPart = text.substring(0, cursor).trim();
        const secondPart = text.substring(cursor).trim();

        // 1. Update Current
        state.estrofas[index].contenido = firstPart;
        element.value = firstPart;

        // 2. Insert New
        // Inherit timing? Or split timing? For now just insert (0 duration or same as prev end)
        const prevEnd = state.estrofas[index].tiempo_fin;
        const newVerse = {
            id: Date.now(), // Temp unique
            contenido: secondPart,
            tiempo_inicio: prevEnd,
            tiempo_fin: prevEnd + 2, // Arbitrary default buffer
        };

        state.estrofas.splice(index + 1, 0, newVerse);

        // 3. Render
        // Update IDs/Indices
        reindexEstrofas();
        renderVersesList();
        renderTimeline();

        // Focus next
        setTimeout(() => {
            const textareas = document.getElementById('editor-verses-list').querySelectorAll('textarea');
            if (textareas[index + 1]) {
                textareas[index + 1].focus();
                textareas[index + 1].setSelectionRange(0, 0);
            }
        }, 0);
    }

    // BACKSPACE: Merge
    if (e.key === 'Backspace' && element.selectionStart === 0 && element.selectionEnd === 0) {
        if (index > 0) {
            e.preventDefault();
            const currentText = element.value;
            const prevText = state.estrofas[index - 1].contenido;

            // Merge
            state.estrofas[index - 1].contenido = (prevText + ' ' + currentText).trim();
            // Extend time of prev to cover current?
            // state.estrofas[index - 1].tiempo_fin = state.estrofas[index].tiempo_fin;

            // Remove current
            state.estrofas.splice(index, 1);

            reindexEstrofas();
            renderVersesList();
            renderTimeline();

            // Focus prev
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
    state.estrofas.forEach((e, i) => e.order = i); // Keep order property clean if exists
}

function syncRawFromVersesState() {
    const raw = document.getElementById('editor-lyrics-raw');
    if (raw) {
        raw.value = state.estrofas.map(e => e.contenido).join('\n\n');
    }
}
