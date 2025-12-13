import { state } from '../store.js';

/**
 * Calculates all visible/relevant grid lines based on current settings.
 * Returns an array of time values (seconds).
 */
export function calculateGridLines(duration = 180) {
    const bpm = state.settings.tempo || 120;
    const subdivision = state.settings.subdivision || '1/4';

    // Parse subdivision (e.g. "1/4" -> 0.25)
    const parts = subdivision.split('/');
    const numerator = parseInt(parts[0]) || 1;
    const denominator = parseInt(parts[1]) || 4;
    const subVal = numerator / denominator;

    // Calculate Interval in Seconds
    // Quarter note = 60 / BPM
    // Interval = (60 / BPM) * 4 * subVal
    const interval = (60 / bpm) * 4 * subVal;

    const lines = [];
    const regions = Array.isArray(state.settings.beatMarker) ? state.settings.beatMarker : [];

    // If no regions, define one implicit region covering the whole song
    if (regions.length === 0) {
        for (let t = 0; t <= duration; t += interval) {
            lines.push(t);
        }
    } else {
        regions.forEach(region => {
            const startT = region.start;
            const endT = region.end || duration;

            for (let t = startT; t <= endT; t += interval) {
                lines.push(t);
            }
        });
    }

    return lines;
}

/**
 * Finds the closest grid line to the target time within a pixel threshold.
 * @param {number} targetTime - The time we want to snap
 * @param {number} thresholdPx - The magnetic threshold in pixels (default 15)
 * @returns {number|null} - The snapped time, or null if no snap
 */
export function getSnapTime(targetTime, thresholdPx = 15) {
    if (!state.settings.snapping) return null;

    // Convert pixel threshold to time threshold based on current zoom
    const thresholdTime = thresholdPx / state.zoom;

    // We can optimization this by not calculating ALL lines if the song is huge,
    // but for < 5 mins it's negligible.
    // Ideally we pass lines in, or cache them if they don't change often.
    // For now, recalc is safe.
    const duration = state.song?.duracion || 180;
    const lines = calculateGridLines(duration);

    let closest = null;
    let minDiff = Infinity;

    for (const line of lines) {
        const diff = Math.abs(line - targetTime);
        if (diff <= thresholdTime && diff < minDiff) {
            minDiff = diff;
            closest = line;
        }
    }

    return closest;
}
