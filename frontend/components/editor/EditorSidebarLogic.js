import { state } from '../synchronizer/store.js';
import { renderTimeline, updateActiveVerse } from '../synchronizer/rendering.js';
import { ChordEditorLogic } from '../../logic/chordEditor/index.js';
import { initialState } from '../../logic/chordEditor/state.js';
import { SettingsLogic } from './SettingsLogic.js';
import { SongSectionManager } from './settings/SongSectionManager.js';
import { SettingsUI } from './settings/SettingsUI.js';
import { audioService } from '../../services/audioService.js';

/**
 * Handles the Split/Merge logic for the Sidebar Verse Editor
 */

let currentEditingIndex = null; // Track if we are editing an existing chord

export const EditorSidebarLogic = {
    init: () => {
        setupTabs();
        setupViewSwitcher(); // New View Switcher
        setupSongSectionPanel(); // New Song Section Panel
        setupLyricsMode();
        setupRawTextProcessor();
        syncRawFromVersesState();
        ChordEditorLogic.init(); // Init Chord Editor
        SettingsLogic.init();
        setupChordSaving();
        setupShortcuts(); // New Ctrl+N
        renderPreviewChordList(); // Render Initial List
    },
    restoreLyricsView: () => {
        const lyricsMode = document.getElementById('lyrics-mode');
        const chordMode = document.getElementById('chord-preview-mode');
        if (lyricsMode) lyricsMode.classList.remove('hidden');
        if (chordMode) chordMode.classList.add('hidden');
    }
};

// ... existing setupTabs, setupLyricsMode, setupRawTextProcessor functions ...

function setupShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl + N for New Chord
        if (e.ctrlKey && e.key.toLowerCase() === 'n') {
            e.preventDefault();
            createNewChord();
        }
    });
}

// Helper to update state in-place to preserve event listener references
function updateEditorState(newState) {
    ChordEditorLogic.state.chordName = newState.chordName;
    ChordEditorLogic.state.startFret = newState.startFret;
    ChordEditorLogic.state.fingers = newState.fingers || {};
    ChordEditorLogic.state.barre = newState.barre || null;
}

function createNewChord() {
    // 1. Reset State
    currentEditingIndex = null;
    updateEditorState(JSON.parse(JSON.stringify(initialState)));

    // 2. Render Empty
    ChordEditorLogic.render();

    // 3. Auto-focus Name Edit
    const nameEl = document.getElementById('chord-name');
    if (nameEl) {
        const dblClick = new MouseEvent('dblclick', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        });
        nameEl.dispatchEvent(dblClick);
    }
}

// ... existing code ...

function loadChordForEditing(index) {
    if (!state.chords[index]) return;

    currentEditingIndex = index;
    // Deep copy to break reference but update in-place
    updateEditorState(JSON.parse(JSON.stringify(state.chords[index])));
    ChordEditorLogic.render();

    // Optional: Visual feedback or scroll to editor?
    // Sidebar is small, so probably fine.
}

function setupChordSaving() {
    const btnSave = document.getElementById('btn-save-chord');
    if (btnSave) {
        btnSave.addEventListener('click', () => {
            // 1. Get current chord data
            const currentChord = JSON.parse(JSON.stringify(ChordEditorLogic.state));

            // 2. Save to global state
            if (!state.chords) state.chords = [];

            if (currentEditingIndex !== null && state.chords[currentEditingIndex]) {
                // OVERWRITE
                state.chords[currentEditingIndex] = currentChord;
            } else {
                // CREATE NEW
                state.chords.push(currentChord);
                // Switch mode to editing this new chord
                currentEditingIndex = state.chords.length - 1;
            }

            // 3. Render
            renderPreviewChordList();

            // Visual feedback
            const originalText = btnSave.innerHTML;
            btnSave.innerHTML = '<span class="text-green-300">¡Guardado!</span>';
            setTimeout(() => {
                btnSave.innerHTML = originalText;
            }, 1000);
        });
    }
}

function renderPreviewChordList() {
    const container = document.querySelector('#chord-preview-mode .chord-list-container');
    if (!container) return;

    // Preserve the "Add Button" HTML or recreate it
    const addButtonHTML = `
    <button class="btn-add-chord" title="Crear nuevo acorde (Ctrl+N)">
        <div class="flex flex-col items-center gap-2">
            <svg class="icon-add" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            <span class="text-sm font-medium opacity-70">Nuevo Acorde</span>
        </div>
    </button>
`;

    // Generate Chords HTML
    const chordsHTML = (state.chords || []).map((chord, index) => generateChordHTML(chord, index)).join('');

    container.innerHTML = addButtonHTML + chordsHTML;

    // Attach Listeners
    setupDeleteChords();
    setupNewChordButton(); // Attach to new button
    setupChordEditing(); // Attach click to edit
    setupChordDragging(); // Attach drag events
}

function setupChordEditing() {
    const cards = document.querySelectorAll('.chord-list-container .chord-card.small');
    cards.forEach((card, index) => {
        card.addEventListener('click', () => {
            // Offset index by -1 because the first item is the "Add Button"?
            // No, wait. `renderPreviewChordList` adds "Add Button" THEN `chordsHTML`.
            // `chordsHTML` is mapped from `state.chords`.
            // So `.chord-card.small` elements correspond exactly to `state.chords` indices?
            // Let's check `generateChordHTML`. Yes, it creates `.chord-card.small`.
            // But the "Add Button" is `.btn-add-chord`, not `.chord-card.small`.
            // So the NodeList `cards` should map 1:1 to `state.chords`?
            // Let's verify CSS classes. `generateChordHTML` uses `chord-card small`.
            // `btn-add-chord` is button.
            // So yes, indices match.

            // Wait, `querySelectorAll` returns in document order.
            // So `cards[i]` corresponds to `state.chords[i]`.

            loadChordForEditing(index);
        });
    });
}

function setupChordDragging() {
    const cards = document.querySelectorAll('.chord-list-container .chord-card.small');
    cards.forEach(card => {
        card.addEventListener('dragstart', (e) => {
            const chordName = card.dataset.chordName;
            if (chordName) {
                e.dataTransfer.effectAllowed = 'copy';
                e.dataTransfer.setData('text/plain', JSON.stringify({
                    type: 'gallery-chord',
                    chordName: chordName
                }));
                // Optional: Drag Image styling?
                card.style.opacity = '0.5';
            }
        });
        card.addEventListener('dragend', () => {
            card.style.opacity = '1';
        });
    });
}




function setupNewChordButton() {
    const btn = document.querySelector('.btn-add-chord');
    if (btn) {
        btn.addEventListener('click', createNewChord);
    }
}

function setupDeleteChords() {
    const btns = document.querySelectorAll('.btn-delete-chord');
    btns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent card selection logic
            const index = parseInt(btn.dataset.index);
            if (!isNaN(index) && state.chords[index]) {
                state.chords.splice(index, 1);
                // If we deleted the one being edited, reset editor?
                if (currentEditingIndex === index) {
                    createNewChord();
                } else if (currentEditingIndex > index) {
                    currentEditingIndex--;
                }

                renderPreviewChordList();
            }
        });
    });
}

function generateChordHTML(chord, index) {
    // Replicates the visual structure of .chord-card but with .small class

    // Grid Lines (Strings & Frets) logic
    let gridContent = '';

    // Strings (6 vertical lines)
    const stringWidths = [4, 3, 3, 2, 2, 1];
    for (let s = 1; s <= 6; s++) {
        const leftPos = (s - 1) * 20;
        // BLACK LINES (bg-gray-800)
        gridContent += `<div class="absolute top-0 bottom-0 bg-gray-800 z-0 pointer-events-none" style="left: ${leftPos}%; width: ${stringWidths[s - 1]}px; transform: translateX(-50%);"></div>`;
    }

    // Frets (5 horizontal lines + top/bottom)
    for (let f = 0; f <= 5; f++) {
        const topPos = f * 20;
        // BLACK LINES (bg-gray-800)
        gridContent += `<div class="absolute left-0 right-0 h-px bg-gray-800 z-0 pointer-events-none" style="top: ${topPos}%;"></div>`;
    }

    // Barre
    if (chord.barre) {
        const { from, to } = chord.barre;
        const leftPerc = (from - 1) * 20;
        const widthPerc = (to - from) * 20;
        // BLACK BARRE (bg-gray-900)
        gridContent += `<div class="absolute h-4 bg-gray-900 rounded-full z-10 pointer-events-none" style="left: calc(${leftPerc}% - 12px); width: calc(${widthPerc}% + 24px); top: 10%; height: 14px; transform: translateY(-50%);"></div>`;
    }

    // Dots (Fingers)
    Object.keys(chord.fingers).forEach(key => {
        if (!chord.fingers[key]) return;
        const part = key.split('-');
        const str = parseInt(part[0]);
        const frt = parseInt(part[1]);

        const leftPos = (str - 1) * 20;
        const topPos = (frt - 1) * 20;

        // Dot: BLACK (bg-gray-900)
        gridContent += `<div class="absolute z-20 flex items-center justify-center" style="left: ${leftPos}%; top: ${topPos + 10}%; margin-left: -10px; margin-top: -10px; width: 20px; height: 20px;">
        <div class="w-5 h-5 rounded-full bg-gray-900 border border-transparent shadow-sm"></div>
    </div>`;
    });

    // Fret Numbers (Left Side)
    let fretNums = '';
    const opacities = [1, 0.6, 0.35, 0.15, 0.05];
    for (let i = 0; i < 5; i++) {
        fretNums += `<div class="flex-1 flex items-center justify-center font-bold text-lg text-white" style="opacity: ${opacities[i]};">${chord.startFret + i}</div>`;
    }


    return `
    <div class="chord-card small shrink-0 select-none relative group" draggable="true" data-chord-name="${chord.chordName}">
        <!-- Delete Button -->
        <button class="btn-delete-chord" data-index="${index}" title="Eliminar Acorde">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <div class="chord-title text-center text-white font-bold mb-1 truncate w-full px-2" style="font-size: 0.7rem;">${chord.chordName}</div>
        <div class="editor-container">
            <!-- Fret Selector: Uses CSS .fret-selector -->
            <div class="fret-selector flex flex-col mr-0.5">
                ${fretNums}
            </div>
            <!-- Grid: Uses CSS .guitar-grid-container -->
            <div class="guitar-grid-container rounded relative shadow-inner p-0 m-0">
                <div class="guitar-grid-inner w-full h-full relative">
                    ${gridContent}
                </div>
            </div>
        </div>
    </div>
`;
}

// ... existing setupRawTextProcessor, syncRawFromVersesState etc. ...

// setupSettingsPanel removed - moved to SettingsLogic.js


function setupTabs() {
    const navBtns = document.querySelectorAll('.sidebar-nav-btn');
    const panels = document.querySelectorAll('.editor-panel');

    // Display Areas
    const lyricsMode = document.getElementById('lyrics-mode');
    const chordMode = document.getElementById('chord-preview-mode');

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

            // --- Toggle Main Display Mode ---
            if (target === 'chords' || target === 'song-sections') {
                if (lyricsMode) lyricsMode.classList.add('hidden');
                if (chordMode) chordMode.classList.remove('hidden');
            } else {
                if (lyricsMode) lyricsMode.classList.remove('hidden');
                if (chordMode) chordMode.classList.add('hidden');
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

function setupViewSwitcher() {
    const btns = document.querySelectorAll('.view-mode-btn');
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.dataset.view;
            if (view) {
                state.settings.activeViewMode = view;
                updateViewModeUI();
                renderTimeline(); // Re-render timeline to show appropriate markers
            }
        });
    });
    // Initial UI Update
    updateViewModeUI();
}

function updateViewModeUI() {
    const mode = state.settings.activeViewMode || 'beat';
    const btns = document.querySelectorAll('.view-mode-btn');
    btns.forEach(btn => {
        if (btn.dataset.view === mode) {
            btn.classList.add('text-cyan-400', 'bg-gray-800');
            btn.classList.remove('text-gray-600');
        } else {
            btn.classList.add('text-gray-600');
            btn.classList.remove('text-cyan-400', 'bg-gray-800');
        }
    });
}

function setupSongSectionPanel() {
    const btn = document.getElementById('song-section-add-btn');
    if (btn) {
        btn.addEventListener('click', () => {
            const audio = audioService.getInstance();
            const time = audio ? audio.currentTime : 0;
            if (SongSectionManager.addSectionAtTime(time)) {
                SettingsUI.renderSongSectionsList();
            }
        });
    }
    // Initial Render
    SettingsUI.renderSongSectionsList();
}
