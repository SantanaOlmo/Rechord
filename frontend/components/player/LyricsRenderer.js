// State to track if user has manually scrolled away
let isUserScrolling = false;
let scrollTimeout = null;
let lastActiveIndex = -1;

export function renderLyrics(song) {
    const container = document.getElementById('lyrics-container');
    if (!container) return;

    // Reset state on new render
    isUserScrolling = false;
    lastActiveIndex = -1;

    // Setup scroll listener to detect manual interaction
    container.onscroll = () => {
        if (!scrollTimeout) {
            isUserScrolling = true;
        } else {
            clearTimeout(scrollTimeout);
        }
        // Debounce keeping the flag true, but we actually want it to remain true until sync
        // actually, we just set it true. The re-sync button logic will handle when to "detach".
        // simple logic: scroll event = user interaction.
        // We will check visibility in highlightLyrics to decide if we show button.
        checkSyncStatus();
    };

    if (!song.estrofas || song.estrofas.length === 0) {
        container.innerHTML = `
            <div class="text-gray-400 text-lg flex flex-col items-center">
                <p class="mb-4 text-xl font-semibold text-gray-500">No hay letras disponibles</p>
                <a href="#/songeditor/${song.id_cancion}" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500 transition">
                    Edita esta canción para añadir las lyrics
                </a>
            </div>
        `;
    } else {
        const lyricsHtml = song.estrofas.map((estrofa, index) => `
            <div id="stanza-${index}" class="lyric-stanza mb-6 transition-all duration-500 ease-out opacity-30 transform scale-100 origin-center cursor-pointer hover:opacity-60"
                 onclick="const audio = audioService.getInstance(); audio.currentTime = ${estrofa.tiempo_inicio};">
                <p class="leading-tight whitespace-pre-line transition-all duration-200 font-bold" style="font-size: var(--lyrics-font-size, 48px);">${estrofa.contenido}</p>
            </div>
        `).join('');
        container.innerHTML = lyricsHtml;
    }
}

function checkSyncStatus() {
    // Check if active stanza is out of view
    const container = document.getElementById('lyrics-container');
    const activeStanza = document.querySelector('.lyric-stanza.text-white'); // Active class identifier
    const btnSync = document.getElementById('btn-sync-lyrics');

    if (container && activeStanza && btnSync) {
        const containerRect = container.getBoundingClientRect();
        const stanzaRect = activeStanza.getBoundingClientRect();

        // Calculate overlap
        const isVisible = (
            stanzaRect.top >= containerRect.top + 50 &&
            stanzaRect.bottom <= containerRect.bottom - 50
        );

        console.log('Sync Check:', { isUserScrolling, isVisible, stanzaTop: stanzaRect.top, containerTop: containerRect.top }); // Debug

        if (!isVisible && isUserScrolling) {
            console.log('SHOWING SYNC BUTTON');
            btnSync.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
        } else if (isVisible) {
            console.log('HIDING SYNC BUTTON');
            btnSync.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none');
            if (isVisible) isUserScrolling = false; // Re-attach if user scrolls back to it
        }
    } else {
        // console.log('Elements missing for sync check', { container: !!container, activeStanza: !!activeStanza, btnSync: !!btnSync });
    }
}

export function highlightLyrics(currentTime, song) {
    if (!song || !song.estrofas) return;

    const lyricsContainer = document.getElementById('lyrics-container');
    if (!lyricsContainer) return;

    const stanzas = lyricsContainer.querySelectorAll('.lyric-stanza');
    let activeIndex = -1;

    song.estrofas.forEach((estrofa, index) => {
        const start = parseFloat(estrofa.tiempo_inicio);
        const end = parseFloat(estrofa.tiempo_fin);
        if (currentTime >= start && currentTime < end) {
            activeIndex = index;
        }
    });

    if (activeIndex !== -1 && activeIndex !== lastActiveIndex) {
        lastActiveIndex = activeIndex;

        stanzas.forEach((stanza, index) => {
            if (index === activeIndex) {
                stanza.classList.remove('opacity-30', 'scale-100');
                stanza.classList.add('opacity-100', 'scale-105', 'text-white', 'font-bold');

                // Only auto-scroll if user is NOT scrolling manually / detached
                if (!isUserScrolling) {
                    scrollToStanza(stanza, lyricsContainer);
                }
            } else {
                stanza.classList.remove('opacity-100', 'scale-105', 'text-white', 'font-bold');
                stanza.classList.add('opacity-30', 'scale-100');
            }
        });
    }

    // Continuously check status to update button if playing moves active element out of view
    // (Though normally checks run on scroll, if user stays still while song advances, eventually active element changes)
    checkSyncStatus();
}

function scrollToStanza(stanza, container) {
    // Create a timeout to ignore scroll events triggered by this auto-scroll
    scrollTimeout = setTimeout(() => {
        scrollTimeout = null;
    }, 600); // slightly longer than smooth scroll duration

    const targetScrollToken = stanza.offsetTop - (container.clientHeight / 2) + (stanza.clientHeight / 2);
    container.scrollTo({
        top: targetScrollToken,
        behavior: 'smooth'
    });
}

// Global function exposed for the button
window.resyncLyrics = function () {
    isUserScrolling = false; // Reset flag
    const container = document.getElementById('lyrics-container');
    const activeStanza = document.querySelector('.lyric-stanza.text-white');

    if (container && activeStanza) {
        scrollToStanza(activeStanza, container);
        const btnSync = document.getElementById('btn-sync-lyrics');
        if (btnSync) btnSync.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none');
    }
};
