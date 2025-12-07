import { socketService } from '../services/socketService.js';

export function RoomModal() {
    // We attach the logic to window for simplicity in this vanilla JS structure
    // similar to how openNewSongModal/closeNewSongModal might be handled globally 
    // or we can attach event listeners after rendering if we had a proper lifecycle manager.
    // For this architecture, we will assume this function returns HTML 
    // and the Controller/App will inject it and attach listeners or we use inline onclicks carefully.

    // Better pattern: return HTML string, and expose a setup function or usage of global helper.

    return `
        <div id="room-modal" class="modal-overlay hidden">
            <div class="modal-content text-center">
                <h3 class="text-2xl font-bold text-white mb-6">Modo Fiesta (Sincronización)</h3>
                
                <div class="space-y-6">
                    <!-- Create Room -->
                    <div class="bg-gray-800 p-4 rounded-lg border border-gray-700">
                        <p class="text-gray-400 mb-4 text-sm">Crea una nueva sala y comparte el código con tus amigos para escuchar música juntos.</p>
                        <button id="btn-create-room" class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded transition-colors"
                        onclick="window.socketService.send('CREATE_ROOM'); document.getElementById('room-modal').classList.add('hidden');">
                            Crear Nueva Sala
                        </button>
                    </div>

                    <div class="relative flex py-2 items-center">
                        <div class="flex-grow border-t border-gray-700"></div>
                        <span class="flex-shrink-0 mx-4 text-gray-500 text-sm">O unirse a una existente</span>
                        <div class="flex-grow border-t border-gray-700"></div>
                    </div>

                    <!-- Join Room -->
                    <div class="bg-gray-800 p-4 rounded-lg border border-gray-700">
                        <div class="flex space-x-2">
                            <input type="text" id="join-room-code" placeholder="Código de Sala" 
                                class="flex-1 bg-gray-900 border border-gray-600 text-white text-center text-lg rounded px-4 py-2 focus:outline-none focus:border-indigo-500 uppercase tracking-widest">
                            <button id="btn-join-room" class="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded transition-colors"
                            onclick="
                                const code = document.getElementById('join-room-code').value; 
                                if(code) { 
                                    window.socketService.send('JOIN_ROOM', { roomId: code }); 
                                    document.getElementById('room-modal').classList.add('hidden'); 
                                }">
                                Unirse
                            </button>
                        </div>
                    </div>
                </div>

                <div class="mt-6 text-right">
                    <button class="text-gray-400 hover:text-white text-sm underline" onclick="document.getElementById('room-modal').classList.add('hidden')">Cerrar</button>
                </div>
            </div>
        </div>
    `;
}

// Expose socketService globally for the inline handlers if not already
if (!window.socketService) window.socketService = socketService;
