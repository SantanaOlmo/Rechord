import { CONTENT_BASE_URL } from '../config.js';

export function SongCard(song, isLiked) {
    // Construir URL completa de la imagen si existe
    const imageUrl = song.ruta_imagen
        ? `${CONTENT_BASE_URL}/${song.ruta_imagen}`
        : null;

    return `
    <div class="song-card group">
        <div class="card-image">
            ${imageUrl
            ? `<img src="${imageUrl}" alt="${song.titulo}" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition">`
            : `<svg class="w-12 h-12 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path></svg>`
        }
            
            <!-- Like Button -->
            <button class="like-btn" onclick="event.stopPropagation(); toggleLike(${song.id_cancion}, this)" title="${isLiked ? 'Quitar like' : 'Dar like'}">
                <svg class="w-6 h-6 ${isLiked ? 'text-red-500 opacity-100' : 'text-black opacity-50 hover:opacity-80'}" fill="${isLiked ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
            </button>

            <!-- Play Overlay -->
            <div class="play-overlay" onclick="playSong(${song.id_cancion})">
                <div class="play-icon-circle">
                    <svg class="w-6 h-6 text-indigo-600 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </div>
            </div>
        </div>
        
        <div class="card-content">
            <div>
                <h3 class="song-title" title="${song.titulo}">${song.titulo}</h3>
                <p class="song-artist" title="${song.artista}">${song.artista || 'Artista desconocido'}</p>
            </div>
            
            <div class="card-footer">
                <span class="song-meta">4/4 • 120 BPM</span>
                <a href="#/songeditor/${song.id_cancion}" onclick="window.navigate('/songeditor/${song.id_cancion}'); return false;" class="btn-edit">
                    Editar <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                </a>
            </div>
        </div>
    </div>
    `;
}
