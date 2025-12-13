import { state, actions } from '../store.js';
import { audioService } from '../../../services/audioService.js';

export function attachTimelineListeners() {
    const scrollArea = document.getElementById('timeline-scroll-area');
    const rulerContainer = document.getElementById('ruler-container');
    if (scrollArea && rulerContainer) {
        scrollArea.addEventListener('scroll', () => {
            rulerContainer.scrollLeft = scrollArea.scrollLeft;
        });

        // Ruler Drag Logic
        const rulerContent = document.getElementById('ruler-content');
        if (rulerContent) {
            rulerContent.style.cursor = 'grab';
            rulerContent.addEventListener('mousedown', (e) => {
                if (e.button !== 0) return;
                state.isDraggingRuler = true;
                state.dragStartX = e.clientX;
                state.initialScrollLeft = scrollArea.scrollLeft;
                document.body.style.cursor = 'grabbing';
                e.preventDefault(); // Prevent text selection
            });

            rulerContent.addEventListener('dblclick', (e) => {
                // e.offsetX is relative to the target (ruler-content) if clicked directly
                // If we click the container, it might differ, but pointer-events:none on children ensures target is content
                const px = e.offsetX;
                const time = px / state.zoom;

                const audio = audioService.getInstance();
                if (audio) {
                    audio.currentTime = time;
                    actions.refresh();
                }
            });
        }


    }

    // Playhead Drag
    const playhead = document.getElementById('playhead');
    if (playhead) {
        playhead.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            e.stopPropagation(); // Don't trigger background selections
            e.preventDefault();  // Don't select text

            state.isDraggingPlayhead = true;
            state.wasPlaying = state.isPlaying; // Remember if we were playing

            const audio = audioService.getInstance();
            if (audio && !audio.paused) {
                audio.pause();
                state.isPlaying = false;
                actions.refresh();
            }

            document.body.style.cursor = 'grabbing';
        });
    }

    // Time Drag Logic (Start/End labels)
    const timeStartEl = document.getElementById('preview-start');
    const timeEndEl = document.getElementById('preview-end');

    if (timeStartEl) timeStartEl.style.cursor = 'ew-resize';
    if (timeEndEl) timeEndEl.style.cursor = 'ew-resize';

    const handleTimeDrag = (e, type) => {
        if (e.button !== 0) return;
        e.preventDefault();
        e.stopPropagation();

        const audio = audioService.getInstance();
        const currentTime = audio.currentTime;
        const activeIndex = state.estrofas.findIndex(v => currentTime >= v.tiempo_inicio && currentTime <= v.tiempo_fin);

        if (activeIndex === -1) return;

        const startX = e.clientX;
        const initialVal = type === 'start' ? state.estrofas[activeIndex].tiempo_inicio : state.estrofas[activeIndex].tiempo_fin;

        const onMove = (mv) => {
            const deltaPx = mv.clientX - startX;
            // deltaPx / zoom = deltaTime
            // Drag Right -> Increase Time
            const deltaSec = deltaPx / state.zoom;
            let newVal = initialVal + deltaSec;

            if (type === 'start') {
                // Constraint: Cannot handle < 0
                // Constraint: Cannot be > End
                // Constraint: Cannot overlap previous clip

                let minLimit = 0;
                if (activeIndex > 0 && state.estrofas[activeIndex - 1]) {
                    minLimit = state.estrofas[activeIndex - 1].tiempo_fin;
                }

                newVal = Math.max(minLimit, Math.min(newVal, state.estrofas[activeIndex].tiempo_fin - 0.1));

                // If collision, we might want to clamp it exactly
                if (newVal < minLimit) newVal = minLimit;

                state.estrofas[activeIndex].tiempo_inicio = newVal;
                // ALSO update current time to match if we are dragging start
                // audio.currentTime = newVal; // Optional quality of life?
            } else {
                // Constraint: Cannot be < Start
                // Constraint: Cannot overlap next clip

                let maxLimit = Infinity;
                if (activeIndex < state.estrofas.length - 1 && state.estrofas[activeIndex + 1]) {
                    maxLimit = state.estrofas[activeIndex + 1].tiempo_inicio;
                }

                newVal = Math.max(state.estrofas[activeIndex].tiempo_inicio + 0.1, Math.min(newVal, maxLimit));

                state.estrofas[activeIndex].tiempo_fin = newVal;
            }
            actions.refresh();
        };

        const onUp = () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
            document.body.style.cursor = '';
        };

        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
        document.body.style.cursor = 'ew-resize';
    };

    if (timeStartEl) timeStartEl.onmousedown = (e) => handleTimeDrag(e, 'start');
    if (timeEndEl) timeEndEl.onmousedown = (e) => handleTimeDrag(e, 'end');
}
