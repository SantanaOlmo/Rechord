import { FolderSidebar } from './FolderSidebar.js';
import { SessionSidebar } from './SessionSidebar.js';
import { Store, EVENTS } from '../../core/StateStore.js';

export function SidebarContainer() {
    setTimeout(initLogic, 0);


    return `
        <div id="sidebar-container" class="flex flex-col h-full overflow-hidden border-r border-gray-800 bg-gray-950 transition-all duration-300 relative pt-20 w-64 min-w-[16rem]">
            
            <!-- Library Section (Top) -->
            <div id="sidebar-library-section" class="flex-1 flex flex-col overflow-hidden transition-all duration-300 relative">
                ${FolderSidebar(true)} 
            </div>

            <!-- Resize Handle (Middle) - Only visible when session active -->
            <div id="session-split-handle" class="hidden h-2 bg-gray-800 hover:bg-indigo-600 cursor-row-resize w-full z-20 flex-shrink-0"></div>

            <!-- Session Section (Bottom) -->
            <div id="sidebar-session-section" class="hidden flex-col bg-gray-900 border-t border-gray-700 overflow-hidden transition-all duration-300 h-1/2">
                ${SessionSidebar()}
            </div>
        </div>
    `;
}

function initLogic() {
    const container = document.getElementById('sidebar-container');
    const libSection = document.getElementById('sidebar-library-section');
    const sessionSection = document.getElementById('sidebar-session-section');
    const splitHandle = document.getElementById('session-split-handle');

    if (!container || !sessionSection) return;

    // 1. Session Split Logic
    const checkForSession = () => {
        const state = Store.getState();
        if (state.room && state.room.id) {
            sessionSection.classList.remove('hidden');
            sessionSection.classList.add('flex');
            splitHandle.classList.remove('hidden');
            libSection.classList.remove('h-full');
            libSection.style.height = '50%';
        } else {
            sessionSection.classList.add('hidden');
            sessionSection.classList.remove('flex');
            splitHandle.classList.add('hidden');
            libSection.style.height = '100%';
        }
    };
    Store.subscribe(EVENTS.SOCKET.MEMBER_UPDATE, checkForSession);
    checkForSession();

    // 2. Vertical Resizing (Split)
    let isResizingSplit = false;
    splitHandle.addEventListener('mousedown', (e) => {
        isResizingSplit = true;
        document.body.style.cursor = 'row-resize';
        e.preventDefault();
    });

    // Global Mouse Move
    let rAF = null;

    document.addEventListener('mousemove', (e) => {
        if (!isResizingSplit) return;

        if (rAF) return; // Skip if frame pending

        rAF = requestAnimationFrame(() => {
            if (isResizingSplit) {
                const containerRect = container.getBoundingClientRect();
                const relativeY = e.clientY - containerRect.top;
                const percentage = (relativeY / containerRect.height) * 100;
                if (percentage > 20 && percentage < 80) {
                    libSection.style.height = `${percentage}%`;
                    sessionSection.style.height = `${100 - percentage}%`;
                }
            }
            rAF = null;
        });
    });

    // Global Mouse Up
    document.addEventListener('mouseup', () => {
        if (rAF) {
            cancelAnimationFrame(rAF);
            rAF = null;
        }

        if (isResizingSplit) {
            isResizingSplit = false;
            document.body.style.cursor = 'default';
        }
    });
}
