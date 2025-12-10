import { initMessages } from '../components/messages/ChatController.js';

export function Messages() {
    setTimeout(initMessages, 0);

    return `
        <div class="h-full flex flex-col md:flex-row bg-black overflow-hidden relative">
            <!-- Sidebar -->
            <div class="w-full md:w-80 lg:w-96 border-r border-gray-800 flex flex-col h-full bg-gray-950/80 backdrop-blur-xl z-20" id="msg-sidebar">
                <div class="p-4 border-b border-gray-800 flex justify-between items-center">
                    <h2 class="text-xl font-bold text-white">Mensajes</h2>
                </div>
                
                <div class="overflow-y-auto flex-1 scrollbar-hide p-2 space-y-2" id="msg-conversation-list">
                    <!-- Skeleton -->
                    <div class="animate-pulse space-y-3">
                        <div class="h-16 bg-gray-900 rounded-lg"></div>
                        <div class="h-16 bg-gray-900 rounded-lg"></div>
                        <div class="h-16 bg-gray-900 rounded-lg"></div>
                    </div>
                </div>
            </div>

            <!-- Chat Area -->
            <div class="flex-1 flex flex-col h-full bg-black relative" id="msg-chat-area">
                <div class="flex-1 flex flex-col justify-center items-center text-gray-500 space-y-4" id="msg-empty-state">
                    <div class="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center">
                        <svg class="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                    </div>
                    <p class="text-lg">Selecciona una conversación para empezar</p>
                </div>
                
                <!-- Active Chat Header -->
                <div id="msg-header" class="hidden h-16 border-b border-gray-800 flex items-center px-6 bg-gray-950 sticky top-0 z-10">
                    <button class="md:hidden mr-4 text-gray-400" id="msg-back-btn">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
                    </button>
                    <img id="msg-header-avatar" src="" class="w-10 h-10 rounded-full object-cover mr-4 bg-gray-800">
                    <div>
                        <h3 id="msg-header-name" class="text-white font-bold"></h3>
                    </div>
                </div>

                <!-- Messages Feed -->
                <div id="msg-feed" class="hidden flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide"></div>

                <!-- Input Area -->
                <form id="msg-form" class="hidden p-4 bg-gray-950 border-t border-gray-800">
                    <div class="flex items-end gap-3 max-w-4xl mx-auto rounded-xl bg-gray-900 p-2">
                        <textarea id="msg-input" 
                            class="flex-1 bg-transparent text-white p-2 max-h-32 min-h-[44px] focus:outline-none resize-none scrollbar-hide text-sm"
                            placeholder="Escribe un mensaje..." rows="1"></textarea>
                        <button type="submit" 
                            class="p-2.5 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 transition-all shadow-lg hover:shadow-indigo-500/30 flex-shrink-0">
                            <svg class="w-5 h-5 ml-0.5 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
}
