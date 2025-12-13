import { state } from './store.js';
import { audioService } from '../../services/audioService.js';

let audioCtx = null;

export const MetronomeLogic = {
    toggle: () => {
        state.metronome.active = !state.metronome.active;
        // Reset last index when enabling to avoid immediate double click if aligned
        if (state.metronome.active) {
            state.metronome.lastGridIndex = -1;
        }
        return state.metronome.active;
    },

    playClick: (isMeasure = false) => {
        if (!state.metronome.active || !state.isPlaying) return;

        // Init Audio Context if needed (browser requires user gesture, usually handled by audioService or play click)
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        // Consistent High "Tac"
        osc.frequency.value = 1000;

        // Short beep
        gain.gain.setValueAtTime(0.5, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
    },

    checkMetronome: (currentTime, interval, startOffset) => {
        if (!state.metronome.active || !state.isPlaying) return;

        // Calculate current grid index based on time and interval
        // T = k * interval + startOffset
        // k = (T - startOffset) / interval

        // We add a small lookahead or tolerance? 
        // Rendering loop might be 60fps (16ms).
        // If we just check "current index", we might miss it or trigger multiple times.
        // Better: trigger if we crossed a boundary since last check.
        // HOWEVER, `rendering.js` is just "render". It doesn't know "last time".
        // BUT `state.metronome.lastGridIndex` can store the index of the *last clicked beat*.

        const adjustedTime = currentTime - startOffset;
        if (adjustedTime < 0) return; // Before grid start

        const currentIndex = Math.floor(adjustedTime / interval);

        if (currentIndex > state.metronome.lastGridIndex) {
            // New grid line reached
            MetronomeLogic.playClick(); // Always same sound 
            // Actually, emphasis depends on time signature.
            // But we don't have "measure" index easily without complex logic.
            // Just click for now. Simpler.

            state.metronome.lastGridIndex = currentIndex;
        } else if (currentIndex < state.metronome.lastGridIndex) {
            // Loop/Seek happend
            state.metronome.lastGridIndex = currentIndex;
        }
    }
};
