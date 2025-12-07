import { Store, EVENTS } from '../core/StateStore.js';

export class RoomIndicator {
    constructor() {
        this.element = document.createElement('div');
        this.element.className = 'hidden flex items-center bg-indigo-900/50 text-indigo-200 text-xs px-3 py-1 rounded-full border border-indigo-500/30 ml-4';
        this.unsubscribe = null;
        this.init();
    }

    init() {
        // Subscribe to store updates
        this.unsubscribe = Store.subscribe('STATE_CHANGED', (state) => {
            if (state.room && state.room.id) {
                this.render(state.room);
                this.element.classList.remove('hidden');
            } else {
                this.element.classList.add('hidden');
            }
        });
    }

    render(room) {
        this.element.innerHTML = `
            <span class="relative flex h-2 w-2 mr-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span class="font-mono tracking-widest font-bold mr-2">${room.id}</span>
            <span class="text-indigo-400 border-l border-indigo-500/30 pl-2 ml-1" title="Miembros">
                👥 ${room.members ? room.members.length : 1}
            </span>
            ${room.isMaster ? '<span class="ml-2 text-[10px] bg-indigo-600 text-white px-1 rounded">MASTER</span>' : ''}
        `;
    }

    // Call this if component is destroyed (SPA navigation)
    destroy() {
        if (this.unsubscribe) this.unsubscribe();
    }

    getElement() {
        return this.element;
    }
}
