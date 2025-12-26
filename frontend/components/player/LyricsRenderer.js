// State to track if user has manually scrolled away
let isUserScrolling = false;
let isAutoScrolling = false;
let autoScrollTimeout = null;
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
let lastActiveIndex = -1;

export function renderLyrics(song) {
    const container = document.getElementById('lyrics-container');
    if (!container) return;

    // Reset state on new render
    isUserScrolling = false;
    isAutoScrolling = false;
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
    lastActiveIndex = -1;

    // Setup scroll listener to detect manual interaction
    container.onscroll = () => {
        // If we are currently auto-scrolling, ignore this event
        if (isAutoScrolling) return;

        // Otherwise, it's a user event
        isUserScrolling = true;
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
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
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
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

        if (!isVisible && isUserScrolling) {
            btnSync.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
        } else if (isVisible) {
            // If user scrolled back to view, we can potentially re-attach, but usually we wait for explicit button press?
            // Actually, if they scroll it back into view manually, we might as well hide the button, but keep 'detached' until they click or next auto-event?
            // Let's keep logic simple: button shows if detached and invisible.
            if (!isUserScrolling) {
                btnSync.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none');
            }
        }
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
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

    // We don't continuously check sync status here to avoid excessive DOM reads,
    // relying on scroll events to check visibility.
}

function scrollToStanza(stanza, container) {
    isAutoScrolling = true;

    // Use clear timeout if existing
    if (autoScrollTimeout) clearTimeout(autoScrollTimeout);

    stanza.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });

    // Reset lock after scroll animation (approx 800ms)
    autoScrollTimeout = setTimeout(() => {
        isAutoScrolling = false;
        autoScrollTimeout = null;
    }, 800);
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
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
