import { PlayerHeader } from '../components/player/PlayerHeader.js';
import { PlayerControls } from '../components/player/PlayerControls.js';
import { LyricsPanel } from '../components/editor/LyricsPanel.js';
import { ChordsPanel } from '../components/editor/ChordsPanel.js';
import { initPlayer } from '../components/player/PlayerController.js';

export function PlayerPage(id) {
    // Initialization
    setTimeout(() => initPlayer(id), 0);

    return `
        <div class="player-page-container h-[calc(100vh-64px)] flex flex-col overflow-hidden relative">
            ${PlayerHeader()}

            <!-- Main Content Area -->
            <main class="flex-1 flex flex-col relative overflow-hidden min-h-0">
                <!-- Content Panels (Lyrics, Chords) -->
                <div class="flex-1 flex relative overflow-hidden min-h-0">
                    ${ChordsPanel(false)} <!-- Default Hidden -->
                    ${LyricsPanel()}
                </div>

                <!-- Controls -->
                <div class="shrink-0 z-20 w-full">
                    ${PlayerControls(id, false)}
                </div>
            </main>
        </div>
    `;
}
