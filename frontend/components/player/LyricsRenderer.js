export function renderLyrics(song) {
    const container = document.getElementById('lyrics-container');
    if (!container) return;

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
            <div id="stanza-${index}" class="lyric-stanza mb-12 transition-all duration-500 ease-out opacity-30 transform scale-100 origin-center cursor-pointer hover:opacity-60"
                 onclick="const audio = audioService.getInstance(); audio.currentTime = ${estrofa.tiempo_inicio};">
                <p class="leading-relaxed whitespace-pre-line transition-all duration-200 font-bold" style="font-size: var(--lyrics-font-size, 24px);">${estrofa.contenido}</p>
            </div>
        `).join('');
        container.innerHTML = lyricsHtml;
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

    stanzas.forEach((stanza, index) => {
        if (index === activeIndex) {
            stanza.classList.remove('opacity-30', 'scale-100');
            stanza.classList.add('opacity-100', 'scale-105', 'text-white', 'font-bold');

            const targetScrollToken = stanza.offsetTop - (lyricsContainer.clientHeight / 2) + (stanza.clientHeight / 2);
            if (Math.abs(lyricsContainer.scrollTop - targetScrollToken) > 10) {
                lyricsContainer.scrollTo({
                    top: targetScrollToken,
                    behavior: 'smooth'
                });
            }
        } else {
            stanza.classList.remove('opacity-100', 'scale-105', 'text-white', 'font-bold');
            stanza.classList.add('opacity-30', 'scale-100');
        }
    });
}
