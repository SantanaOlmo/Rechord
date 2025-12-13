import { state, actions } from './store.js';
import { formatMMSS } from './utils.js';
// handleClipMouseDown import removed to avoid cycle
import { audioService } from '../../services/audioService.js';
import { MetronomeLogic } from './MetronomeLogic.js';


// --- DRAG AND DROP HANDLERS ---
function handleDragStart(e, index) {
    if (!e.target.dataset.dragHandle) return; // Only allow drag from specific handle or if we decide whole header is draggable
    e.dataTransfer.setData('text/plain', index);
    e.dataTransfer.effectAllowed = 'move';
    e.target.closest('.track-header').classList.add('opacity-50');
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const header = e.target.closest('.track-header');
    if (header) header.classList.add('bg-gray-800');
}

function handleDragLeave(e) {
    const header = e.target.closest('.track-header');
    if (header) header.classList.remove('bg-gray-800');
}

function handleDrop(e, targetIndex) {
    e.preventDefault();
    const headers = document.querySelectorAll('.track-header');
    headers.forEach(h => {
        h.classList.remove('opacity-50');
        h.classList.remove('bg-gray-800');
    });

    const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'));
    if (sourceIndex === targetIndex || isNaN(sourceIndex)) return;

    actions.moveTrack(sourceIndex, targetIndex);
}


export function renderHeaders() {
    const container = document.getElementById('headers-container');
    if (!container) return;

    container.innerHTML = '';

    // Use state.trackOrder instead of hardcoded list
    state.trackOrder.forEach((key, index) => {
        const t = state.trackState[key];
        // Ensure state exists for key, if not, skip
        if (!t) return;

        const h = t.collapsed ? 'h-8' : 'h-24';

        const div = document.createElement('div');
        div.className = `${h} track-header border-b border-gray-700 flex items-center px-4 transition-all duration-200 select-none justify-between group hover:bg-gray-700 bg-gray-800 cursor-grab active:cursor-grabbing`;
        div.draggable = true;

        // Drag Events
        div.ondragstart = (e) => {
            e.dataTransfer.setData('text/plain', index);
            div.classList.add('opacity-50');
        };
        div.ondragover = (e) => {
            e.preventDefault();
            div.classList.add('bg-gray-700');
        };
        div.ondragleave = (e) => {
            div.classList.remove('bg-gray-700');
        };
        div.ondrop = (e) => {
            e.preventDefault();
            div.classList.remove('bg-gray-700');
            div.classList.remove('opacity-50');
            const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'));
            if (sourceIndex !== index && !isNaN(sourceIndex)) {
                actions.moveTrack(sourceIndex, index);
            }
        };

        div.innerHTML = `
            <div class="flex items-center flex-1 gap-2 pointer-events-none">
                <!-- Drag Handle Icon -->
                <svg class="w-4 h-4 text-gray-600 group-hover:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16"></path></svg>
                <span class="font-bold ${t.color} ${t.collapsed ? 'text-xs' : ''}">${t.label}</span>
            </div>
            <button class="text-gray-500 hover:text-white focus:outline-none p-1 rounded" onclick="event.stopPropagation(); window.triggerToggle('${key}')">
                <svg class="w-4 h-4 transform transition-transform ${t.collapsed ? '-rotate-90' : 'rotate-0'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </button>
        `;

        // Click on header body toggles too? Or select?
        // Let's keep toggle on button only to avoid conflict with drag
        // But double click to toggle?
        div.ondblclick = () => actions.toggleTrack(key);

        container.appendChild(div);
    });

    window.triggerToggle = (key) => actions.toggleTrack(key);
}

export function renderTimeline() {
    const content = document.getElementById('timeline-content');
    const tracksContainer = document.getElementById('tracks-container');
    const audio = audioService.getInstance();
    const duration = state.song?.duracion || audio.duration || 180;

    // --- DYNAMIC TRACK GENERATION ---
    // Instead of assuming elements exist, we rebuild them in order
    // But we must preserve their content (clip elements) if they exist?
    // Actually, clips are re-rendered every refresh in renderTimeline anyway.
    // So we can safely clear and rebuild container structure to match order.

    // However, recreating DOM nodes might kill drag listeners or selection states if they were attached purely to nodes?
    // Selection is in state. Dragging clips is re-attached via delegation/rendering.
    // So rebuilding structure is safe.

    if (tracksContainer) {
        // Ensure Grid Layer exists
        let gridCanvas = document.getElementById('grid-canvas');
        if (!gridCanvas) {
            gridCanvas = document.createElement('canvas');
            gridCanvas.id = 'grid-canvas';
            gridCanvas.className = 'absolute top-0 left-0 h-full w-full pointer-events-none z-10 opacity-70 mix-blend-overlay'; // Over tracks
            tracksContainer.appendChild(gridCanvas);
        }

        // Reconcile Tracks
        // We want to match state.trackOrder to the DOM children (skipping grid-canvas)
        // Simple approach: Iterate order, check if element exists, move/create it.

        let existingTracks = Array.from(tracksContainer.children).filter(el => el.id !== 'grid-canvas');
        const trackMap = new Map(existingTracks.map(el => [el.id, el]));

        state.trackOrder.forEach((key, index) => {
            const t = state.trackState[key];
            if (!t) return;

            const trackId = `track-${key}`;
            let trackDiv = trackMap.get(trackId);

            if (!trackDiv) {
                // Create new
                trackDiv = document.createElement('div');
                trackDiv.id = trackId;
                // Lighter background (gray-700 was requested "even lighter" than previous 800)
                trackDiv.className = `bg-gray-700 border-b border-gray-600 relative group transition-all duration-200`;

                // Specific Content Init
                if (key === 'lyrics') {
                    // Update lyrics track to match
                    trackDiv.className = 'bg-gray-700/90 border-b border-gray-600 relative group transition-all duration-200';
                    trackDiv.innerHTML = `<div id="track-verses" class="w-full h-full relative overflow-hidden"></div>`;
                } else if (key === 'audio') {
                    // Audio Track - Waveform Container
                    // We remove pointer-events-none to allow clicking the marker/track
                    trackDiv.innerHTML = `<div id="waveform-container" class="absolute inset-0 overflow-hidden relative"></div>`;
                } else {
                    trackDiv.innerHTML = `<div class="absolute inset-0 flex items-center justify-center text-gray-700 text-sm select-none font-medium overflow-hidden">${t.label} Track</div>`;
                }

                tracksContainer.appendChild(trackDiv);
            }

            // Update Style (Height/Order)
            // Flex order or Physical DOM order? 
            // We'll just append to container to enforce order if we are "moving" them?
            // "appendChild" moves an existing node.
            tracksContainer.appendChild(trackDiv);

            // Height Sync
            // Always keep overflow hidden to prevent internal scrollbars
            trackDiv.classList.add('overflow-hidden');

            if (t.collapsed) {
                trackDiv.style.height = '32px';
            } else {
                trackDiv.style.height = '96px';
            }
        });

        renderBeatMarker();

        // Remove tracks not in order (if any)
        existingTracks.forEach(el => {
            const key = el.id.replace('track-', '');
            if (!state.trackOrder.includes(key) && el.id !== 'grid-canvas') {
                el.remove();
            }
        });
    }

    // -------------------------

    // Contraint calculation if container exists
    const trackArea = document.getElementById('timeline-scroll-area');
    if (trackArea) {
        state.minZoom = trackArea.clientWidth / duration;
        if (state.zoom < state.minZoom) state.zoom = state.minZoom;
    }

    const totalWidth = duration * state.zoom;
    const containerWidth = trackArea ? trackArea.clientWidth : 0;

    if (content) {
        content.style.width = `${Math.max(totalWidth, containerWidth)}px`;
    }

    drawRuler(duration);

    drawRuler(duration);

    // FETCH DYNAMICALLY CREATED TRACK ELEMENT
    const track = document.getElementById('track-verses');
    if (!track) return;
    track.innerHTML = '';

    // Render Selection Box
    if (state.isSelecting) {
        const box = document.createElement('div');
        box.className = 'absolute bg-blue-500/20 border border-blue-400 z-50 pointer-events-none';

        const trackRect = track.getBoundingClientRect();

        // Proper relative calculation
        const x1 = Math.min(state.selectionStart.x, state.selectionCurrent.x) - trackRect.left;
        const y1 = Math.min(state.selectionStart.y, state.selectionCurrent.y) - trackRect.top;

        const width = Math.abs(state.selectionCurrent.x - state.selectionStart.x);
        const height = Math.abs(state.selectionCurrent.y - state.selectionCurrent.y); // This was state.selectionStart.y in the original, but the change has state.selectionCurrent.y. Assuming this is a typo and should be state.selectionStart.y for consistency with x.
        // Reverting to original logic for height calculation to avoid unintended change.
        // The provided change had: const height = Math.abs(state.selectionCurrent.y - state.selectionCurrent.y); which would always be 0.
        // The original code had: const height = Math.abs(state.selectionCurrent.y - state.selectionStart.y);
        // I will use the original correct logic for height.
        const heightCorrected = Math.abs(state.selectionCurrent.y - state.selectionStart.y);


        box.style.left = `${x1}px`;
        box.style.top = `${y1}px`;
        box.style.width = `${width}px`;
        box.style.height = `${heightCorrected}px`;
        track.appendChild(box);
    }

    state.estrofas.forEach((estrofa, index) => {
        const startPx = estrofa.tiempo_inicio * state.zoom;
        let durationSec = estrofa.tiempo_fin - estrofa.tiempo_inicio;
        if (durationSec < 0.5) durationSec = 0.5;
        const widthPx = durationSec * state.zoom;

        const isSelected = state.selectedIndices.has(index);

        const clip = document.createElement('div');
        // Selected: bg-white, text-indigo-600 (blue font), border-white
        // Unselected: bg-indigo-600, text-white
        // Adding 'z-20' to ensure they sit above grid (z-10) reliably and are opaque
        clip.className = `absolute top-2 h-20 rounded border text-xs overflow-hidden select-none cursor-pointer group transition-colors duration-75 shadow-sm flex flex-col justify-between z-20 ${isSelected
            ? 'bg-white border-white text-indigo-600 ring-2 ring-indigo-300 font-bold'
            : 'bg-indigo-600 border-indigo-400 text-white hover:bg-indigo-500' // Totally opaque
            }`;

        // If lyrics track is collapsed, maybe hide clips or make them tiny?
        // Current logic: track container cuts them off via overflow-hidden if height < 80px.
        // h-20 is 80px.
        // collapsed height is 32px.
        // So they will be cut off. Good enough for "closed". 
        // Or we can scale them. For now, overflow hidden is fine.

        clip.style.left = `${startPx}px`;
        clip.style.width = `${widthPx}px`;
        clip.dataset.index = index;

        clip.innerHTML = `
            <div class="w-full h-full p-2 flex flex-col pointer-events-none">
                <span class="font-bold mb-1 opacity-70 text-[10px] tracking-wide">Verso ${index + 1}</span>
                <span class="whitespace-nowrap overflow-hidden text-ellipsis font-medium" style="color: inherit;">${estrofa.contenido}</span>
            </div>
            ${isSelected ? `
            <div class="resize-handle left absolute top-0 bottom-0 left-0 w-3 cursor-ew-resize bg-transparent hover:bg-white/20 z-20 flex items-center justify-center group-hover:bg-white/5" data-handle="left">
                <div class="w-0.5 h-6 bg-white/30 rounded"></div>
            </div>
            <div class="resize-handle right absolute top-0 bottom-0 right-0 w-3 cursor-ew-resize bg-transparent hover:bg-white/20 z-20 flex items-center justify-center group-hover:bg-white/5" data-handle="right">
                 <div class="w-0.5 h-6 bg-white/30 rounded"></div>
            </div>` : ''}
        `;

        // listener attached via delegation in events.js
        track.appendChild(clip);
    });
}

// GRID DRAWING LOGIC
function drawGrid(duration) {
    const canvas = document.getElementById('grid-canvas');
    if (!canvas) return;

    if (!state.settings.grid) {
        // Clear if disabled
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
    }

    const ctx = canvas.getContext('2d');
    const content = document.getElementById('timeline-content');
    const tracksContainer = document.getElementById('tracks-container');

    // Resize
    canvas.width = content ? content.offsetWidth : 0;
    canvas.height = tracksContainer ? tracksContainer.offsetHeight : 600;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Grid settings
    const bpm = state.settings.tempo || 120;
    const subdivision = state.settings.subdivision || '1/4';

    // Parse subdivision (e.g. "1/4" -> 0.25)
    const parts = subdivision.split('/');
    const numerator = parseInt(parts[0]) || 1;
    const denominator = parseInt(parts[1]) || 4;
    const subVal = numerator / denominator; // 0.25

    // Calculate Interval in Seconds
    // Quarter note = 60 / BPM
    // Interval = (60 / BPM) * 4 * subVal
    const interval = (60 / bpm) * 4 * subVal;

    const totalSeconds = canvas.width / state.zoom;

    // Grid: Darker gray (almost black)
    ctx.strokeStyle = '#111827'; // gray-900
    ctx.lineWidth = 1;
    ctx.beginPath();

    // Loop through defined regions
    const regions = Array.isArray(state.settings.beatMarker) ? state.settings.beatMarker : [];

    // If no regions, maybe draw nothing? Or draw full if legacy?
    // User wants explicit sections. If empty, draw nothing.

    regions.forEach(region => {
        const startT = region.start;
        const endT = region.end || totalSeconds; // If no end, go to end of view? Or song duration?

        // Align to startT
        // t starts at startT, increments by interval
        for (let t = startT; t <= endT; t += interval) {
            const x = Math.round(t * state.zoom) + 0.5;
            if (x >= 0 && x <= canvas.width) {
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
            }
        }
    });

    ctx.stroke();
}

export function drawRuler(duration) {
    drawGrid(duration); // Render grid when ruler updates (zoom/scroll/init)

    const rulerContent = document.getElementById('ruler-content');
    if (!rulerContent) return;

    // Clear previous
    rulerContent.innerHTML = '';

    // Resize is handled by container layout usually, but content width needs to match timeline
    const content = document.getElementById('timeline-content');
    if (content) {
        rulerContent.style.width = `${content.offsetWidth}px`;
    }

    const fragment = document.createDocumentFragment();

    // Step size logic
    let step = 1; // 1 second
    if (state.zoom < 20) step = 5;
    if (state.zoom < 5) step = 10;
    if (state.zoom < 1) step = 30;

    const totalWidth = rulerContent.offsetWidth || (duration * state.zoom);
    const totalSeconds = totalWidth / state.zoom;

    for (let t = 0; t < totalSeconds; t += step) {
        const x = t * state.zoom;

        // Major Tick
        const majorTick = document.createElement('div');
        majorTick.className = 'absolute bottom-0 border-l border-gray-500 h-4 pointer-events-none';
        majorTick.style.left = `${x}px`;
        fragment.appendChild(majorTick);

        // Time Label
        const label = document.createElement('div');
        label.className = 'absolute bottom-0 text-[10px] text-gray-400 font-mono pointer-events-none select-none';
        label.style.left = `${x + 4}px`;
        label.textContent = formatMMSS(t);
        fragment.appendChild(label);

        // Minor Ticks
        if (state.zoom > 50) {
            const subStep = step / 4;
            for (let st = t + subStep; st < t + step; st += subStep) {
                const sx = st * state.zoom;
                if (sx < totalWidth) {
                    const minorTick = document.createElement('div');
                    minorTick.className = 'absolute bottom-0 border-l border-gray-600 h-2 pointer-events-none';
                    minorTick.style.left = `${sx}px`;
                    fragment.appendChild(minorTick);
                }
            }
        }
    }

    rulerContent.appendChild(fragment);
}

export function updatePreview() {
    const previewText = document.getElementById('preview-text');
    const previewTime = document.getElementById('preview-time');

    if (!previewText) return;

    if (state.selectedIndices.size > 0) {
        if (state.selectedIndices.size === 1) {
            const index = state.selectedIndices.values().next().value;
            const v = state.estrofas[index];
            previewText.textContent = v.contenido;
            document.getElementById('preview-start').textContent = formatMMSS(v.tiempo_inicio);
            document.getElementById('preview-end').textContent = formatMMSS(v.tiempo_fin);
            previewTime.classList.remove('opacity-0');
        } else {
            previewText.textContent = `${state.selectedIndices.size} versos seleccionados`;
            previewTime.classList.add('opacity-0');
        }
        previewText.className = 'text-3xl md:text-4xl font-bold text-white mb-4 transition-all duration-200';
    } else {
        previewText.textContent = "Selecciona un verso...";
        previewText.className = 'text-3xl md:text-4xl font-bold text-gray-500 mb-4 transition-all duration-200';
        previewTime.classList.add('opacity-0');
    }
}

export function updateActiveVerse(currentTime) {
    // Only if playing, we override.
    // Actually, the user asked for "when playing".
    // If we are NOT selecting, we can show active verse too?
    // Let's strictly follow: If playing, show active. If not playing, show selection.

    // Calculate grid settings for Metronome
    const bpm = state.settings.tempo || 120;
    const subdivision = state.settings.subdivision || '1/4';
    const parts = subdivision.split('/');
    const subVal = (parseInt(parts[0]) || 1) / (parseInt(parts[1]) || 4);
    const interval = (60 / bpm) * 4 * subVal;

    // Check if in valid region
    const regions = Array.isArray(state.settings.beatMarker) ? state.settings.beatMarker : [];
    const activeRegion = regions.find(r => currentTime >= r.start && currentTime <= (r.end || Infinity));

    if (activeRegion) {
        // Pass start of THIS region as offset
        // This ensures the click aligns with the grid generated from this start point
        MetronomeLogic.checkMetronome(currentTime, interval, activeRegion.start);
    }

    const previewText = document.getElementById('preview-text');
    const previewTime = document.getElementById('preview-time');
    if (!previewText) return;

    const activeVerse = state.estrofas.find(v => currentTime >= v.tiempo_inicio && currentTime <= v.tiempo_fin);

    if (state.isPlaying) {
        if (activeVerse) {
            previewText.textContent = activeVerse.contenido;
            document.getElementById('preview-start').textContent = formatMMSS(activeVerse.tiempo_inicio);
            document.getElementById('preview-end').textContent = formatMMSS(activeVerse.tiempo_fin);
            previewTime.classList.remove('opacity-0');
            previewText.className = 'text-3xl md:text-4xl font-bold text-green-400 mb-4 transition-all duration-200';
        } else {
            // Playing but silence/gap -> Show nothing or placeholder
            previewText.textContent = "...";
            previewText.className = 'text-3xl md:text-4xl font-bold text-gray-700 mb-4 transition-all duration-200';
            previewTime.classList.add('opacity-0');
        }
    } else {
        // Not playing -> Show selection
        // If we have an active verse (e.g. paused on verse), maybe optimal to show it?
        // User said "Start/End pos display allows expanding clip". This implies selection context.
        // Current logic: updatePreview() uses selection.
        updatePreview();
    }
}

export function updatePlayIcon() {
    const play = document.getElementById('icon-play');
    const pause = document.getElementById('icon-pause');
    if (!play || !pause) return;

    if (state.isPlaying) {
        play.classList.add('hidden');
        pause.classList.remove('hidden');
    } else {
        play.classList.remove('hidden');
        pause.classList.add('hidden');
    }
}

// Register global action
actions.refresh = () => {
    try {
        renderTimeline();
        renderHeaders();
        updatePreview();
        updatePlayIcon();
    } catch (e) { console.error('Render error', e); }
};

actions.toggleTrack = (trackName) => {
    const track = state.trackState[trackName];
    if (track) {
        track.collapsed = !track.collapsed;
        actions.refresh();
    }
};

export function ensurePlayheadVisible(currentTime) {
    const scrollArea = document.getElementById('timeline-scroll-area');
    if (!scrollArea) return;

    const px = currentTime * state.zoom;
    const containerWidth = scrollArea.clientWidth;
    const scrollLeft = scrollArea.scrollLeft;

    // Right Edge Check
    if (px > scrollLeft + containerWidth) {
        scrollArea.scrollLeft = px - 20;
    }
    // Left Edge Check
    else if (px < scrollLeft) {
        // Scroll so it appears on the right or left? user said "move vision so red line appears to restart from left" for right overflow.
        // For left overflow (user navigates backwards), let's just make it visible.
        scrollArea.scrollLeft = Math.max(0, px - 20);
    }
}

export function renderBeatMarker() {
    const container = document.getElementById('waveform-container');
    if (!container) return;

    // Clear existing markers
    container.querySelectorAll('.beat-marker').forEach(el => el.remove());

    const markers = Array.isArray(state.settings.beatMarker) ? state.settings.beatMarker : [];

    // predefined colors for regions (cycling)
    const colors = [
        'bg-cyan-400', 'bg-green-400', 'bg-pink-400', 'bg-yellow-400', 'bg-purple-400', 'bg-red-400'
    ];

    markers.forEach((region, index) => {
        const colorClass = colors[index % colors.length];
        const isSelected = index === state.settings.selectedRegionIndex;

        // Helper to create marker
        const createMarker = (time, type) => {
            const px = time * state.zoom;
            const marker = document.createElement('div');
            marker.className = `beat-marker absolute w-3 h-3 border border-white shadow-sm transform -translate-x-1/2 rotate-45 z-20 cursor-pointer hover:scale-125 transition-transform ${colorClass}`;
            marker.style.top = '40%';
            marker.style.left = `${px}px`;
            marker.dataset.type = 'region-marker';
            marker.dataset.regionIndex = index;
            marker.dataset.markerType = type; // 'start' or 'end'

            // Selection State (Yellow Border)
            // Check if THIS specific marker is selected
            const isMarkerSelected = isSelected && state.settings.selectedMarkerType === type;

            if (isMarkerSelected) {
                marker.classList.add('ring-2', 'ring-yellow-400', 'ring-offset-1', 'ring-offset-gray-800'); // Valid yellow ring
                marker.style.zIndex = '30'; // Bring selected to front
            }

            container.appendChild(marker);
        };

        createMarker(region.start, 'start');
        if (region.end && region.end < (state.song.duracion || 180)) {
            createMarker(region.end, 'end');
        }
    });
}
