
export const AdminMessageUserForm = {
    render: (user) => {
        return `
            <div class="bg-gray-900 p-6 rounded-lg border border-gray-700 shadow-xl">
                <h4 class="text-white text-lg font-bold mb-2 flex items-center gap-2">
                    <svg class="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                    Mensaje para ${user.nombre}
                </h4>
                <p class="text-gray-400 text-sm mb-4">Este mensaje aparecerá en su bandeja de entrada como "Rechord".</p>
                
                <textarea id="msg-content-${user.id_usuario}" 
                    class="w-full bg-gray-800 text-white p-3 rounded border border-gray-600 focus:border-indigo-500 outline-none h-32 mb-4 placeholder-gray-500 text-sm"
                    placeholder="Escribe tu mensaje aquí..."></textarea>
                
                <div class="flex justify-end gap-3">
                    <button data-action="cancel-msg" data-id="${user.id_usuario}" 
                        class="px-4 py-2 rounded text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
                        Cancelar
                    </button>
                    <button data-action="send-msg" data-id="${user.id_usuario}" 
                        class="px-6 py-2 rounded text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg transition-all flex items-center gap-2">
                        <svg class="w-4 h-4 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                        Enviar Mensaje
                    </button>
                </div>
            </div>
        `;
    }
};
