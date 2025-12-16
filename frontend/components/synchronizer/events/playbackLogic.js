import { state } from '../store.js';
import { audioService } from '../../../services/audioService.js';
import { EditorSidebarLogic } from '../../editor/EditorSidebarLogic.js';

export function togglePlay() {
    const audio = audioService.getInstance();
    if (audio.paused) {
        // Priority 1: Selected Beat Marker
        if (state.settings.selectedRegionIndex !== -1 && state.settings.selectedMarkerType) {
            const idx = state.settings.selectedRegionIndex;
            const region = state.settings.beatMarker[idx];
            if (region) {
                const type = state.settings.selectedMarkerType;
                const time = type === 'start' ? region.start : (region.end || 180);
                audio.currentTime = time;
            }
        }
        // Priority 2: Selected Lyric (only if no marker selected)
        else if (state.selectedIndices.size > 0) {
            const indices = Array.from(state.selectedIndices);
            const minStart = Math.min(...indices.map(i => state.estrofas[i].tiempo_inicio));
            audio.currentTime = minStart;
        }
        audio.play();
    } else {
        audio.pause();
    }
    state.isPlaying = !audio.paused;
    if (state.isPlaying) {
        EditorSidebarLogic.restoreLyricsView();
    }



    // UI updates are handled by actions.refresh/renderTimeline or listeners in the main loop
    const play = document.getElementById('icon-play');
    const pause = document.getElementById('icon-pause');
    if (play && pause) {
        if (state.isPlaying) { play.classList.add('hidden'); pause.classList.remove('hidden'); }
        else { play.classList.remove('hidden'); pause.classList.add('hidden'); }
    }
}
