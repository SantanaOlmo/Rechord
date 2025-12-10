import { state, actions } from './store.js';
import { audioService } from '../../services/audioService.js';
import { updateEstrofas } from '../../services/estrofaService.js';
import { formatMMSS } from './utils.js';

export function handleClipMouseDown(e, index) {
    if (e.button !== 0) return; // Only Left Click

    const handleEl = e.target.closest('[data-handle]');
    const handle = handleEl ? handleEl.dataset.handle : null;

    // START DRAGGING (Resize or Move)
    state.isDragging = true;
    state.dragVerseIndex = index;
    state.dragStartX = e.clientX;
    state.dragTarget = handle ? handle : 'body';

    // Snapshot constraint
    state.initialSnapshot = state.estrofas.map(v => ({ ...v }));

    e.stopPropagation();

    if (!handle) {
        // MOVE Logic: Handle selection
        if (e.shiftKey) {
            if (state.selectedIndices.has(index)) state.selectedIndices.delete(index);
            else state.selectedIndices.add(index);
        } else {
            if (!state.selectedIndices.has(index)) {
                state.selectedIndices.clear();
                state.selectedIndices.add(index);
            }
        }
    }
    actions.refresh();
}

export function handleGlobalMouseMove(e) {
    // RULER DRAG
    if (state.isDraggingRuler) {
        const deltaX = e.clientX - state.dragStartX;
        const scrollArea = document.getElementById('timeline-scroll-area');
        if (scrollArea) {
            // Drag left (deltaX < 0) -> Scroll Right (increase scrollLeft)
            // Drag right (deltaX > 0) -> Scroll Left (decrease scrollLeft)
            scrollArea.scrollLeft = state.initialScrollLeft - deltaX;
        }
        return;
    }

    if (state.isDragging) {
        const deltaPx = e.clientX - state.dragStartX;
        const deltaSec = deltaPx / state.zoom;
        const scrollArea = document.getElementById('timeline-scroll-area');
        const scrollOffset = scrollArea ? scrollArea.scrollLeft : 0; // Not needed for delta calc if using clientX

        // ... existing drag logic ...
        // CASE 1: RESIZING
        if (state.dragTarget === 'left' || state.dragTarget === 'right') {
            const verse = state.estrofas[state.dragVerseIndex];
            const initial = state.initialSnapshot[state.dragVerseIndex];

            if (state.dragTarget === 'right') {
                let newEnd = initial.tiempo_fin + deltaSec;
                if (newEnd < initial.tiempo_inicio + 0.5) newEnd = initial.tiempo_inicio + 0.5;

                const nextVerse = state.estrofas[state.dragVerseIndex + 1];
                if (nextVerse && newEnd > nextVerse.tiempo_inicio) {
                    newEnd = nextVerse.tiempo_inicio;
                }
                verse.tiempo_fin = newEnd;
            }
            else if (state.dragTarget === 'left') {
                let newStart = initial.tiempo_inicio + deltaSec;
                if (newStart > initial.tiempo_fin - 0.5) newStart = initial.tiempo_fin - 0.5;
                if (newStart < 0) newStart = 0;

                const prevVerse = state.estrofas[state.dragVerseIndex - 1];
                if (prevVerse && newStart < prevVerse.tiempo_fin) {
                    newStart = prevVerse.tiempo_fin;
                }
                verse.tiempo_inicio = newStart;
            }
        }

        // CASE 2: MOVING (Multiple)
        else if (state.dragTarget === 'body') {
            const selectedIndices = Array.from(state.selectedIndices).sort((a, b) => a - b);
            if (selectedIndices.length === 0) return;

            let allowedDelta = deltaSec;

            if (deltaSec < 0) { // Left
                for (let i of selectedIndices) {
                    const initial = state.initialSnapshot[i];
                    if (!state.selectedIndices.has(i - 1)) {
                        const prevEnd = (i - 1 >= 0) ? state.initialSnapshot[i - 1].tiempo_fin : 0;
                        const maxMoveLeft = prevEnd - initial.tiempo_inicio;
                        if (allowedDelta < maxMoveLeft) allowedDelta = maxMoveLeft;
                    }
                }
            }
            else if (deltaSec > 0) { // Right
                for (let i of selectedIndices) {
                    const initial = state.initialSnapshot[i];
                    if (!state.selectedIndices.has(i + 1)) {
                        const nextStart = (i + 1 < state.estrofas.length) ? state.initialSnapshot[i + 1].tiempo_inicio : Infinity;
                        const maxMoveRight = nextStart - initial.tiempo_fin;
                        if (allowedDelta > maxMoveRight) allowedDelta = maxMoveRight;
                    }
                }
            }

            selectedIndices.forEach(i => {
                const initial = state.initialSnapshot[i];
                state.estrofas[i].tiempo_inicio = initial.tiempo_inicio + allowedDelta;
                state.estrofas[i].tiempo_fin = initial.tiempo_fin + allowedDelta;
            });
        }
        actions.refresh();
        return;
    }

    if (state.isSelecting) {
        state.selectionCurrent = { x: e.clientX, y: e.clientY };

        const track = document.getElementById('track-verses');
        if (!track) return;

        const x1 = Math.min(state.selectionStart.x, state.selectionCurrent.x);
        const x2 = Math.max(state.selectionStart.x, state.selectionCurrent.x);
        const y1 = Math.min(state.selectionStart.y, state.selectionCurrent.y);
        const y2 = Math.max(state.selectionStart.y, state.selectionCurrent.y);

        state.estrofas.forEach((_, index) => {
            const clip = track.querySelector(`div[data-index="${index}"]`);
            if (clip) {
                const clipRect = clip.getBoundingClientRect();
                const overlaps = !(clipRect.right < x1 || clipRect.left > x2 || clipRect.bottom < y1 || clipRect.top > y2);

                if (overlaps) state.selectedIndices.add(index);
                else if (!e.shiftKey) state.selectedIndices.delete(index);
            }
        });
        actions.refresh();
    }
}

export function handleGlobalMouseUp(e) {
    if (state.isDraggingRuler) {
        state.isDraggingRuler = false;
        document.body.style.cursor = '';
    }
    if (state.isDragging) {
        state.isDragging = false;
        state.dragTarget = null;
        state.dragVerseIndex = -1;
    }
    if (state.isSelecting) {
        state.isSelecting = false;
        actions.refresh();
    }
}

export function togglePlay() {
    const audio = audioService.getInstance();
    if (audio.paused) {
        if (state.selectedIndices.size > 0) {
            const indices = Array.from(state.selectedIndices);
            const minStart = Math.min(...indices.map(i => state.estrofas[i].tiempo_inicio));
            audio.currentTime = minStart;
        }
        audio.play();
    } else {
        audio.pause();
    }
    state.isPlaying = !audio.paused;
    // render logic will handle icon
    // But we need to call refresh?
    // Actually render calls updatePlayIcon?? 
    // rendering.js exports updatePlayIcon...
    // We can't import updatePlayIcon here easily circle.
    // But actions.refresh calls renderTimeline and updatePreview. 
    // We should add updatePlayIcon to refresh in rendering.js or separately.

    // Let's rely on event listener in index/main to update icon, OR calls actions.refresh()
    // But renderTimeline doesn't update icon. 
    // We might need to manually update it.
    const play = document.getElementById('icon-play');
    const pause = document.getElementById('icon-pause');
    if (play && pause) {
        if (state.isPlaying) { play.classList.add('hidden'); pause.classList.remove('hidden'); }
        else { play.classList.remove('hidden'); pause.classList.add('hidden'); }
    }
}

export function attachListeners() {
    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);

    const track = document.getElementById('track-verses');
    if (track) {
        track.addEventListener('mousedown', (e) => {
            // Check if clicking a resize handle (highest priority)
            if (e.target.classList.contains('resize-handle') || e.target.closest('.resize-handle')) {
                const handleEl = e.target.classList.contains('resize-handle') ? e.target : e.target.closest('.resize-handle');
                const clipEl = handleEl.closest('[data-index]');
                if (clipEl) {
                    const index = parseInt(clipEl.dataset.index);
                    handleClipMouseDown(e, index);
                    return;
                }
            }

            // Check if clicking a clip (but not handle)
            // The clip element has the data-index
            const clipEl = e.target.closest('[data-index]');
            if (clipEl) {
                // Ensure we are not clicking a child that shouldn't trigger this? 
                // The clip body is fine.
                const index = parseInt(clipEl.dataset.index);
                handleClipMouseDown(e, index);
                return;
            }

            // If we are here, we clicked on the background track
            if (e.target === track) {
                state.isSelecting = true;
                state.selectionStart = { x: e.clientX, y: e.clientY };
                state.selectionCurrent = { x: e.clientX, y: e.clientY };
                if (!e.shiftKey) {
                    state.selectedIndices.clear();
                    actions.refresh();
                }
            }
        });
    }

    const scrollArea = document.getElementById('timeline-scroll-area');
    const rulerContainer = document.getElementById('ruler-container');
    if (scrollArea && rulerContainer) {
        scrollArea.addEventListener('scroll', () => {
            rulerContainer.scrollLeft = scrollArea.scrollLeft;
        });

        // Ruler Drag Logic
        const rulerCanvas = document.getElementById('ruler-canvas');
        if (rulerCanvas) {
            rulerCanvas.style.cursor = 'grab';
            rulerCanvas.addEventListener('mousedown', (e) => {
                if (e.button !== 0) return;
                state.isDraggingRuler = true;
                state.dragStartX = e.clientX;
                state.initialScrollLeft = scrollArea.scrollLeft;
                document.body.style.cursor = 'grabbing';
                e.preventDefault(); // Prevent text selection
            });

            rulerCanvas.addEventListener('dblclick', (e) => {
                const rect = rulerCanvas.getBoundingClientRect();
                const offsetX = e.clientX - rect.left; // x relative to viewport, but we want relative to canvas start which might be simpler?
                // Actually e.offsetX gives offset relative to target.
                // rulerCanvas is the target.
                const px = e.offsetX;
                const time = px / state.zoom;

                const audio = audioService.getInstance();
                if (audio) {
                    audio.currentTime = time;
                    actions.refresh();
                }
            });
        }

        // Wheel Zoom
        scrollArea.addEventListener('wheel', (e) => {
            if (e.ctrlKey) {
                e.preventDefault();
                const delta = e.deltaY;
                if (delta < 0) {
                    state.zoom *= 1.2;
                } else {
                    state.zoom /= 1.2;
                }
                actions.refresh();
            }
        }, { passive: false });
    }

    window.addEventListener('keydown', (e) => {
        // Prevent if typing
        if (['INPUT', 'TEXTAREA'].includes(e.target.tagName) || e.target.isContentEditable) return;

        // Prevent if not on Sync Page
        if (!document.getElementById('timeline-container')) return;

        if (e.code === 'Space') {
            e.preventDefault();
            togglePlay();
        }
    });

    document.getElementById('btn-play-pause').onclick = togglePlay;

    document.getElementById('zoom-in').onclick = () => {
        state.zoom *= 1.2;
        actions.refresh();
    };

    document.getElementById('zoom-out').onclick = () => {
        actions.refresh();
    };

    document.getElementById('btn-save-sync').onclick = async () => {
        try {
            const btn = document.getElementById('btn-save-sync');
            const originalText = btn.textContent;
            btn.textContent = 'Guardando...';
            btn.disabled = true;
            await updateEstrofas(state.estrofas);
            btn.textContent = 'Guardado!';
            setTimeout(() => { btn.textContent = originalText; btn.disabled = false; }, 2000);
        } catch (e) { alert('Error al guardar: ' + e.message); }
    };
}
