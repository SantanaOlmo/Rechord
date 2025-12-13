import { state } from '../synchronizer/store.js';
import { renderTimeline } from '../synchronizer/rendering.js';
import { audioService } from '../../services/audioService.js';
import { BeatMarkerManager } from './settings/BeatMarkerManager.js';
import { SettingsUI } from './settings/SettingsUI.js';

export const SettingsLogic = {
    init: () => {
        setupSettingsPanel();
    },
    // This is called by SyncController loop
    updateUI: (btn, val) => SettingsUI.updateBeatMarkerUI(btn, val)
};

function setupSettingsPanel() {
    // 1. Bind Elements
    const tempoInput = document.getElementById('setting-tempo');
    const numInput = document.getElementById('setting-time-num');
    const denInput = document.getElementById('setting-time-den');
    const beatVal = document.getElementById('setting-beat-marker-val');
    const beatBtn = document.getElementById('setting-beat-marker-btn');
    const snapCheck = document.getElementById('setting-snapping');
    const gridCheck = document.getElementById('setting-grid');
    const subSelect = document.getElementById('setting-subdivision');
    const velInput = document.getElementById('setting-velocity');
    const velVal = document.getElementById('velocity-val');

    // Ensure container (using UI module)
    const beatWrapper = document.getElementById('setting-beat-marker-btn')?.parentElement?.parentElement;
    SettingsUI.ensureContainer(beatWrapper);

    // 2. Initial Values
    if (state.settings) {
        if (tempoInput) tempoInput.value = state.settings.tempo;
        if (numInput) numInput.value = state.settings.timeSignature.num;
        if (denInput) denInput.value = state.settings.timeSignature.den;

        // Initial List Render
        SettingsUI.renderSectionsList();

        if (snapCheck) snapCheck.checked = state.settings.snapping;
        if (gridCheck) gridCheck.checked = state.settings.grid;
        if (subSelect) subSelect.value = state.settings.subdivision;
        if (velInput) velInput.value = state.settings.velocity;
        if (velVal) velVal.textContent = state.settings.velocity;
    }

    // 3. Event Listeners
    if (tempoInput) {
        tempoInput.addEventListener('change', (e) => {
            state.settings.tempo = parseInt(e.target.value) || 120;
            renderTimeline();
        });
    }

    if (numInput && denInput) {
        const updateSig = () => {
            state.settings.timeSignature.num = parseInt(numInput.value) || 4;
            state.settings.timeSignature.den = parseInt(denInput.value) || 4;
            renderTimeline();
        };
        numInput.addEventListener('change', updateSig);
        denInput.addEventListener('change', updateSig);
    }

    if (beatBtn) {
        beatBtn.addEventListener('click', () => {
            const audio = audioService.getInstance();
            const time = audio ? audio.currentTime : 0;

            // Use Manager to Add
            if (BeatMarkerManager.addMarkerAtTime(time)) {
                // If added, update UI
                SettingsUI.renderSectionsList();
            }
        });
    }

    if (snapCheck) {
        snapCheck.addEventListener('change', (e) => {
            state.settings.snapping = e.target.checked;
        });
    }

    if (gridCheck) {
        gridCheck.addEventListener('change', (e) => {
            state.settings.grid = e.target.checked;
            renderTimeline();
        });
    }

    if (subSelect) {
        subSelect.addEventListener('change', (e) => {
            state.settings.subdivision = e.target.value;
            renderTimeline();
        });
    }

    if (velInput) {
        velInput.addEventListener('input', (e) => {
            state.settings.velocity = parseInt(e.target.value);
            if (velVal) velVal.textContent = state.settings.velocity;
        });
    }
}
