import { state } from '../../synchronizer/store.js';
import { ChordEditorLogic } from '../../../logic/chordEditor/index.js';
import { initialState } from '../../../logic/chordEditor/state.js';
import { updateChords } from '../../../services/cancionService.js';

let currentEditingIndex = null;

export const ChordManager = {
    init: () => {
        ChordEditorLogic.init();
        setupChordSaving();
        setupShortcuts();
        setupDrawerDragging();
        renderPreviewChordList();
    },

    render: () => {
        renderPreviewChordList();
    }
};

function setupDrawerDragging() {
    const handle = document.getElementById('chord-drawer-handle');
    const drawer = document.getElementById('chord-list-drawer');
    const panel = document.getElementById('panel-chords');

    if (!handle || !drawer || !panel) return;

    let isDragging = false;
    let startY;
    let startHeight;

    handle.addEventListener('mousedown', (e) => {
        isDragging = true;
        startY = e.clientY;
        startHeight = drawer.offsetHeight;
        document.body.style.cursor = 'row-resize';
        drawer.classList.add('transition-none');
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const deltaY = startY - e.clientY;
        let newHeight = startHeight + deltaY;

        const maxHeight = panel.clientHeight - 40;
        const minHeight = 40;

        if (newHeight > maxHeight) newHeight = maxHeight;
        if (newHeight < minHeight) newHeight = minHeight;

        drawer.style.height = `${newHeight}px`;
    });

    window.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            document.body.style.cursor = '';
            drawer.classList.remove('transition-none');
        }
    });
}

function setupShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key.toLowerCase() === 'n') {
            e.preventDefault();
            createNewChord();
        }
    });
}

function updateEditorState(newState) {
    ChordEditorLogic.state.chordName = newState.chordName;
    ChordEditorLogic.state.startFret = newState.startFret;
    ChordEditorLogic.state.fingers = newState.fingers || {};
    ChordEditorLogic.state.barre = newState.barre || null;
}

function createNewChord() {
    currentEditingIndex = null;
    updateEditorState(JSON.parse(JSON.stringify(initialState)));
    ChordEditorLogic.render();

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

function loadChordForEditing(index) {
    if (!state.chords[index]) return;

    currentEditingIndex = index;
    updateEditorState(JSON.parse(JSON.stringify(state.chords[index])));
    ChordEditorLogic.render();

    // Auto-collapse drawer
    const drawer = document.getElementById('chord-list-drawer');
    if (drawer) {
        drawer.style.height = '40px';
    }
}

function setupChordSaving() {
    const btnSave = document.getElementById('btn-save-chord');
    if (btnSave) {
        btnSave.addEventListener('click', async () => {
            const currentChord = JSON.parse(JSON.stringify(ChordEditorLogic.state));

            if (!state.chords) state.chords = [];

            if (currentEditingIndex !== null && state.chords[currentEditingIndex]) {
                state.chords[currentEditingIndex] = currentChord;
            } else {
                state.chords.push(currentChord);
                currentEditingIndex = state.chords.length - 1;
            }

            renderPreviewChordList();

            // Persist to Backend
            if (state.song && (state.song.id_cancion || state.song.id)) {
                try {
                    await updateChords(state.song.id_cancion || state.song.id, state.chords);

                    const originalText = btnSave.innerHTML;
                    btnSave.innerHTML = '<span class="text-green-300">¡Guardado!</span>';
                    setTimeout(() => {
                        btnSave.innerHTML = originalText;
                    }, 1000);
                } catch (error) {
                    console.error("Error saving chords:", error);
                    alert("Error al guardar en el servidor. Revisa tu conexión.");
                }
            } else {
                console.warn("No song ID found, saving locally only.");
            }
        });
    }
}

function renderPreviewChordList() {
    const mobileContainer = document.getElementById('sidebar-chord-list');
    const desktopContainer = document.getElementById('desktop-chord-list');

    // Attempt to render in both/either
    if (!mobileContainer && !desktopContainer) return;

    const mobileSearch = document.getElementById('chord-search-input');
    const desktopSearch = document.getElementById('desktop-chord-search-input');

    // Combine search query (or use active one)
    const filterText = (mobileSearch?.value || desktopSearch?.value || '').toLowerCase();

    const chords = state.chords || [];
    const countEl = document.getElementById('chord-count-val');
    if (countEl) countEl.textContent = chords.length;

    const songTitleEl = document.getElementById('drawer-song-title');
    if (songTitleEl) {
        if (state.song && (state.song.titulo || state.song.title)) {
            songTitleEl.textContent = `"${state.song.titulo || state.song.title}"`;
        }
    }

    const filteredChords = chords.map((c, i) => ({ ...c, index: i }))
        .filter(c => c.chordName.toLowerCase().includes(filterText));

    const generateContent = (items) => {
        // "New Chord" Button Card
        // Updated styling: Taller aspect ratio (3:4), full width of grid cell.
        const newChordBtn = `
            <div class="chord-list-item-new relative flex flex-col items-center justify-center p-2 rounded-2xl bg-[#5c5cd6]/20 border-2 border-dashed border-[#5c5cd6]/50 hover:border-white/50 hover:bg-[#5c5cd6]/40 cursor-pointer transition-all hover:scale-105 group select-none box-border aspect-[3/4] w-full shadow-sm" 
                 title="Crear nuevo acorde vacío">
                <svg class="w-8 h-8 text-white/70 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                <span class="text-[10px] font-bold text-white/70 mt-1 uppercase tracking-wider group-hover:text-white">Nuevo</span>
            </div>
        `;

        // ... rest of checking logic
        if (items.length === 0) {
            if (chords.length === 0) {
                // Use a wrapper div for the "New" button to ensure it respects grid layout if returned alone? 
                // Actually grid layout applies to children. Returning a string of HTML elements is fine.
                return newChordBtn + `<div class="col-span-full text-xs text-gray-500 text-center py-4 italic opacity-50 flex flex-col items-center gap-2">
                    <span>Lista vacía.</span>
                    <span class="text-[10px]">Empieza creando uno nuevo.</span>
                 </div>`;
            } else {
                return newChordBtn + `<div class="col-span-full text-xs text-gray-500 text-center py-4 italic">No encontrados.</div>`;
            }
        }
        return newChordBtn + items.map(c => generateChordListItem(c, c.index)).join('');
    };

    const contentHTML = generateContent(filteredChords);

    if (mobileContainer) mobileContainer.innerHTML = contentHTML;
    if (desktopContainer) desktopContainer.innerHTML = contentHTML;

    setupDeleteChords();
    setupChordEditing();
    setupChordDragging();
    setupNewChordCardListener(); // New listener

    // Listeners for Search (Debounce or just input)
    [mobileSearch, desktopSearch].forEach(input => {
        if (input && !input.dataset.listening) {
            input.addEventListener('input', () => {
                // Optional: Sync values?
                if (input === mobileSearch && desktopSearch) desktopSearch.value = input.value;
                if (input === desktopSearch && mobileSearch) mobileSearch.value = input.value;
                renderPreviewChordList();
            });
            input.dataset.listening = 'true';
        }
    });
}



function setupNewChordCardListener() {
    const btns = document.querySelectorAll('.chord-list-item-new');
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            createNewChord();
            // Auto-collapse drawer on mobile
            const drawer = document.getElementById('chord-list-drawer');
            if (drawer) drawer.style.height = '40px';
        });
    });
}

function setupChordEditing() {
    const items = document.querySelectorAll('#sidebar-chord-list .chord-list-item');
    items.forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('#sidebar-chord-list .chord-list-item').forEach(el => el.classList.remove('ring-2', 'ring-white'));
            item.classList.add('ring-2', 'ring-white');
            loadChordForEditing(parseInt(item.dataset.index));
        });
    });
}

function setupChordDragging() {
    const items = document.querySelectorAll('#sidebar-chord-list .chord-list-item');
    items.forEach(item => {
        item.addEventListener('dragstart', (e) => {
            const chordName = item.dataset.chordName;
            if (chordName) {
                e.dataTransfer.effectAllowed = 'copy';
                e.dataTransfer.setData('text/plain', JSON.stringify({
                    type: 'gallery-chord',
                    chordName: chordName
                }));
                item.style.opacity = '0.5';
            }
        });
        item.addEventListener('dragend', () => {
            item.style.opacity = '1';
        });
    });
}

function setupDeleteChords() {
    const btns = document.querySelectorAll('.btn-delete-chord-list');
    btns.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const index = parseInt(btn.dataset.index);
            if (!isNaN(index) && state.chords[index]) {
                const confirmed = confirm(`¿Eliminar acorde "${state.chords[index].chordName}"?`);
                if (confirmed) {
                    state.chords.splice(index, 1);
                    if (currentEditingIndex === index) createNewChord();
                    renderPreviewChordList();

                    if (state.song && (state.song.id_cancion || state.song.id)) {
                        try {
                            await updateChords(state.song.id_cancion || state.song.id, state.chords);
                        } catch (error) {
                            console.error("Error deleting chord:", error);
                        }
                    }
                }
            }
        });
    });
}

function generateChordListItem(chord, index) {
    const gridHTML = renderMiniChordGrid(chord);

    return `
    <div class="chord-list-item relative flex flex-col items-center justify-between p-2 rounded-2xl bg-[#5c5cd6] border-2 border-[#5c5cd6] hover:border-white/30 cursor-pointer shadow-lg transition-transform hover:scale-105 group select-none overflow-hidden box-border aspect-[3/4] w-full" 
         draggable="true" 
         data-index="${index}" 
         data-chord-name="${chord.chordName}"
         title="Click para editar">
        
        <!-- Delete Button (X top right) -->
        <button class="btn-delete-chord-list absolute top-1 right-1 p-0.5 text-white/60 hover:text-white transition-colors z-30" data-index="${index}">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <!-- Chord Name -->
        <h3 class="text-white font-bold text-xs mb-1 drop-shadow-md truncate w-full text-center mt-1">${chord.chordName}</h3>

        <!-- Card Body (Grid Container) -->
        <!-- Removed overflow-hidden to allow open string dots (top: -4px) to be visible -->
        <div class="relative bg-white rounded-md p-0.5 shadow-inner flex-1 w-full flex items-center justify-center mb-0">
             ${gridHTML}
        </div>
        
    </div>
    `;
}

function renderMiniChordGrid(chord) {
    // Robust parsing of startFret
    const startFret = parseInt(chord.startFret) || 1;

    // 1. Fret Sidebar (Left column)
    // Style update: White background, Black text
    let sidebarRows = '';
    for (let i = 0; i < 5; i++) {
        const currentFret = startFret + i;
        sidebarRows += `<div class="flex-1 flex items-center justify-center text-[7px] font-bold text-gray-900 leading-none">${currentFret}</div>`;
    }

    // 2. The Board (Strings & Frets)
    let boardContent = '';

    // Strings (Vertical Black Lines)
    for (let i = 0; i < 6; i++) {
        const left = (i / 5) * 100;
        boardContent += `<div class="absolute top-0 bottom-0 w-px bg-gray-900" style="left: ${left}%;"></div>`;
    }

    // Frets (Horizontal Black Lines)
    for (let i = 0; i <= 5; i++) {
        const top = (i / 5) * 100;
        const height = (i === 0 && startFret === 1) ? '2px' : '1px'; // Thicker nut if startFret is 1
        boardContent += `<div class="absolute left-0 right-0 bg-gray-900" style="top: ${top}%; height: ${height};"></div>`;
    }

    // Barre (Black Bar) - z-10
    if (chord.barre) {
        const { from, to } = chord.barre;
        const s1 = Math.min(from, to);
        const s2 = Math.max(from, to);
        // Corrected Orientation: String 1 is Left (0%)
        const leftPct = ((s1 - 1) / 5) * 100;
        const rightPct = ((s2 - 1) / 5) * 100;
        const width = rightPct - leftPct;

        let barreRelFret = 0;
        if (chord.barre.fret !== undefined) {
            barreRelFret = chord.barre.fret - startFret;
        }

        if (barreRelFret >= 0 && barreRelFret < 5) {
            const top = (barreRelFret * 20) + 10;
            boardContent += `<div class="absolute h-2.5 bg-gray-900 rounded-full z-10 shadow-sm" style="left: calc(${leftPct}% - 4px); width: calc(${width}% + 8px); top: calc(${top}% - 5px);"></div>`;
        }
    }

    // Dots (Fingers) - z-20 (Higher than Barre)
    const fingers = chord.fingers || {};
    Object.entries(fingers).forEach(([key, val]) => {
        if (!val) return;

        const parts = key.split('-');
        if (parts.length < 2) return;

        const string = parseInt(parts[0]);
        const fret = parseInt(parts[1]);

        if (isNaN(string) || isNaN(fret)) return;

        let relFret = fret - startFret;

        // Corrected Orientation: String 1 is Left
        const left = ((string - 1) / 5) * 100;

        // Open strings (0) -> Hollow circle at top
        if (fret === 0) {
            boardContent += `<div class="absolute w-1.5 h-1.5 rounded-full border border-gray-900 bg-white z-20" style="left: calc(${left}% - 3px); top: -6px;"></div>`;
            return;
        }

        // Fret dots (Black)
        if (relFret >= 0 && relFret < 5) {
            const top = (relFret * 20) + 10;
            boardContent += `<div class="absolute w-2.5 h-2.5 rounded-full bg-gray-900 shadow-sm z-20" style="left: calc(${left}% - 5px); top: calc(${top}% - 5px);"></div>`;
        }
    });

    return `
    <div class="flex w-full h-full select-none">
        <!-- Sidebar Numbers (White BG, Black Text) -->
        <div class="w-4 bg-white rounded-l flex flex-col border-y border-l border-gray-300">
            ${sidebarRows}
        </div>
        <!-- White Grid Board -->
        <div class="flex-1 bg-white relative border border-gray-900 rounded-r overflow-visible">
            <div class="absolute inset-0 m-0.5">
                ${boardContent}
            </div>
        </div>
    </div>
    `;
}
