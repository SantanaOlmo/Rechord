import { state, actions } from '../store.js';
import { audioService } from '../../../services/audioService.js';
import { handleResize } from './resizeLogic.js';
import { handleMove } from './moveLogic.js';
import { history } from './historyLogic.js';

export function handleClipMouseDown(e, index, type = 'verse') {
    if (e.button !== 0) return; // Only Left Click

    const handleEl = e.target.closest('[data-handle]');
    const handle = handleEl ? handleEl.dataset.handle : null;

    // Set Selection Context
    state.selectionType = type;
    state.activeTrack = type === 'section' ? 'chords' : 'lyrics'; // Mapping
    const dataSource = type === 'section' ? state.settings.songSections : state.estrofas;

    // START DRAGGING (Resize or Move)
    // Push history before ANY modification
    // TODO: Generalize History. For now, we push the relevant array? 
    // Existing history logic might expect full state or just verses. 
    // Let's assume history.push handles 'snapshot' of something. 
    // Ideally we'd fix historyLogic.js too. For now, let's snapshot the source.
    history.push(dataSource);

    // Clear Beat Marker Selection (User Requirement: Verse/Section selection priority)
    state.settings.selectedRegionIndex = -1;
    state.settings.selectedMarkerType = null;
    import('../../editor/settings/SettingsUI.js').then(m => m.SettingsUI.renderSectionsList()); // Refresh UI highlights

    state.isDragging = true;
    state.dragVerseIndex = index;
    state.dragStartX = e.clientX;
    state.dragTarget = handle ? handle : 'body';

    // Snapshot constraint
    state.initialSnapshot = dataSource.map(v => ({ ...v }));

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
    // PLAYHEAD DRAG
    if (state.isDraggingPlayhead) {
        const content = document.getElementById('timeline-content');
        if (content) {
            const rect = content.getBoundingClientRect();
            let offsetX = e.clientX - rect.left;
            if (offsetX < 0) offsetX = 0;

            const newTime = offsetX / state.zoom;
            // Update audio
            const audio = audioService.getInstance();
            if (audio) {
                if (newTime >= 0 && (Number.isNaN(audio.duration) || newTime <= audio.duration)) {
                    audio.currentTime = newTime;
                }
            }
        }
        return;
    }

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
        // const scrollOffset = scrollArea ? scrollArea.scrollLeft : 0; // Unused

        // CASE 1: RESIZING
        if (state.dragTarget === 'left' || state.dragTarget === 'right') {
            handleResize(deltaSec);
        }

        // CASE 2: MOVING (Multiple)
        else if (state.dragTarget === 'body') {
            handleMove(deltaSec);
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
    if (state.isDraggingPlayhead) {
        state.isDraggingPlayhead = false;
        document.body.style.cursor = '';
        if (state.wasPlaying) {
            const audio = audioService.getInstance();
            audio.play().catch(e => console.error("Resume failed", e));
            state.isPlaying = true;
            actions.refresh();
        }
    }
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
