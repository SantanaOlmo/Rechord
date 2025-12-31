import { state } from '../../synchronizer/store.js';
import { renderTimeline } from '../../synchronizer/rendering.js';
import { SongSectionManager } from '../settings/SongSectionManager.js';
import { SettingsUI } from '../settings/SettingsUI.js';
import { audioService } from '../../../services/audioService.js';

export const ViewManager = {
    init: () => {
        setupTabs();
        setupViewSwitcher();
        setupSongSectionPanel();
    },

    restoreLyricsView: () => {
        const lyricsMode = document.getElementById('lyrics-mode');
        const chordMode = document.getElementById('chord-preview-mode');
        if (lyricsMode) lyricsMode.classList.remove('hidden');
        if (chordMode) chordMode.classList.add('hidden');
    }
};

function setupTabs() {
    const navBtns = document.querySelectorAll('.sidebar-nav-btn');
    const panels = document.querySelectorAll('.editor-panel');

    const lyricsMode = document.getElementById('lyrics-mode');
    const chordMode = document.getElementById('chord-preview-mode');

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            navBtns.forEach(b => {
                b.classList.remove('bg-indigo-600', 'text-white', 'shadow-lg');
                b.classList.add('text-gray-500');
            });
            panels.forEach(p => p.classList.add('hidden'));

            btn.classList.remove('text-gray-500');
            btn.classList.add('bg-indigo-600', 'text-white', 'shadow-lg');

            const target = btn.dataset.panel;
            const panel = document.getElementById(`panel-${target}`);
            if (panel) {
                panel.classList.remove('hidden');
                panel.classList.add('flex');
            }

            if (target === 'chords') {
                const lyricsMode = document.getElementById('lyrics-mode');
                const chordMode = document.getElementById('chord-preview-mode');

                // On Desktop: Show Chords, Hide Lyrics
                // On Mobile: Lyrics must stay visible (enforced by CSS or Check?)
                // Strategy: Toggle utility classes.
                // We add 'hidden' to lyricsMode, but we ensure it has 'max-[820px]:flex' to stay visible on mobile?
                // Or we check window width? Responsive JS is tricky.

                // Let's rely on the fact that #chord-preview-mode is hidden on mobile via CSS (min-[821px]:flex).
                // So enabling it doesn't show it on mobile.
                // We just need to make sure lyricsMode is NOT hidden on mobile.

                if (lyricsMode) {
                    lyricsMode.classList.add('hidden');
                    lyricsMode.classList.remove('flex');
                    // Force visibility on mobile override
                    lyricsMode.classList.add('max-[820px]:flex');
                }

                if (chordMode) {
                    chordMode.classList.remove('hidden');
                    chordMode.classList.add('flex');
                }
            } else if (target === 'lyrics') {
                const lyricsMode = document.getElementById('lyrics-mode');
                const chordMode = document.getElementById('chord-preview-mode');

                if (lyricsMode) {
                    lyricsMode.classList.remove('hidden');
                    lyricsMode.classList.add('flex');
                }
                if (chordMode) {
                    chordMode.classList.add('hidden');
                    chordMode.classList.remove('flex');
                }
            }
        });
    });
}

function setupViewSwitcher() {
    const btns = document.querySelectorAll('.view-mode-btn');
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.dataset.view;
            if (view) {
                state.settings.activeViewMode = view;
                updateViewModeUI();
                renderTimeline();
            }
        });
    });
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
    SettingsUI.renderSongSectionsList();
}
