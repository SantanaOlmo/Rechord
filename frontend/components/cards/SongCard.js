import { CONTENT_BASE_URL, ICON_PLAY } from '../../config.js';
import { authService } from '../../services/authService.js';

export function SongCard(song, isLiked) {
    const imageUrl = song.ruta_imagen
        ? `${CONTENT_BASE_URL}/${song.ruta_imagen}`
        : null;

    const isAdmin = authService.isAdmin();

    // DEBUG: Remove in production
    if (isAdmin) console.log('SongCard: User is admin, rendering button for song:', song.id_cancion);
    else console.log('SongCard: User is NOT admin. User:', authService.getCurrentUser());

    // Format duration
    let durationStr = '--:--';
    if (song.duracion) {
        const mins = Math.floor(song.duracion / 60);
        const secs = song.duracion % 60;
        durationStr = `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // Like count display (assuming song.total_likes exists from backend, or default 0)
    // Note: Can be extended in future to fetch real-time
    const likeCount = song.total_likes || 0;

    return `
    <div class="song-card group relative w-48 flex-shrink-0 bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-all duration-300 cursor-move"
         draggable="true"
         ondragstart="event.dataTransfer.setData('text/plain', '${song.id_cancion}')">
        <div class="card-image h-48 w-full relative overflow-hidden">
            ${imageUrl
            ? `<img src="${imageUrl}" alt="${song.titulo}" class="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500">`
            : `<div class="w-full h-full flex items-center justify-center bg-gray-700">
                 <svg class="w-16 h-16 text-gray-500 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path></svg>
               </div>`
        }
            
            <!-- Like Button & Count -->
            <div class="absolute top-2 right-2 flex flex-col items-center z-20">
                <button class="like-btn p-1.5 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 transition" 
                        onclick="event.stopPropagation(); toggleLike(${song.id_cancion}, this)" 
                        title="${isLiked ? 'Quitar like' : 'Dar like'}">
                    <svg class="w-5 h-5 ${isLiked ? 'text-red-500 opacity-100' : 'text-white opacity-70 hover:opacity-100'}" fill="${isLiked ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                </button>
                <span class="text-xs text-white font-medium mt-0.5 drop-shadow-md">${likeCount > 0 ? likeCount : ''}</span>
            </div>

            <!-- Admin Edit Button -->
            ${isAdmin ? `
            <div class="absolute top-2 left-2 flex flex-col items-center z-20">
                <button class="p-1.5 bg-black/40 backdrop-blur-sm rounded-full text-white hover:bg-indigo-500 hover:text-white transition"
                    onclick="event.stopPropagation(); window.openEditModal(${song.id_cancion})" title="Editar Propiedades">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                </button>
            </div>
            ` : ''}

            <!-- Play Overlay -->
            <div class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer backdrop-blur-[2px]" onclick="window.navigate('/player/${song.id_cancion}')">
                <div class="bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                    <img src="${ICON_PLAY}" class="w-5 h-5 ml-1" alt="Play">
                </div>
            </div>
        </div>
        
        <div class="p-4">
            <div class="mb-3">
                <h3 class="text-white font-bold text-base truncate" title="${song.titulo}">${song.titulo}</h3>
                <p class="text-gray-400 text-sm truncate" title="${song.artista}">${song.artista || 'Artista desconocido'}</p>
            </div>
            
            <div class="flex items-center justify-between mt-2 pt-2 border-t border-gray-700">
                <div class="flex flex-col">
                    <span class="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Duración</span>
                    <span class="text-xs text-gray-300 font-mono">${durationStr}</span>
                </div>
                 <a href="#/sincronizador/${song.id_cancion}" onclick="window.navigate('/sincronizador/${song.id_cancion}'); return false;" 
                   class="text-xs bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white px-2 py-1 rounded transition-colors">
                    Sync
                </a>
            </div>
        </div>
    </div>
    `;
}
