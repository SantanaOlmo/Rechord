import { AdminUsersTab } from '../admin/AdminUsersTab.js';
import { AdminWebSocketTab } from '../admin/AdminWebSocketTab.js';
import { AdminHeroTab } from '../admin/AdminHeroTab.js?v=toastcheck';
import { renderHomeConfigTab } from '../admin/AdminHomeTab.js';

let usersTab, wsTab, heroTab, currentTab = 'users';

export async function initDashboardLogic() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const container = document.getElementById('dashboard-content-container');

    // Init modules
    usersTab = new AdminUsersTab('dashboard-content-container');
    wsTab = new AdminWebSocketTab('dashboard-content-container');
    heroTab = new AdminHeroTab('dashboard-content-container');

    // Preload
    await usersTab.loadUsers();

    const switchTab = (tab) => {
        currentTab = tab;
        // Update Buttons UI
        tabBtns.forEach(btn => {
            if (btn.dataset.tab === tab) {
                btn.className = 'tab-btn px-4 py-2 rounded-md text-sm font-medium transition-colors bg-indigo-600 text-white shadow-lg';
            } else {
                btn.className = 'tab-btn px-4 py-2 rounded-md text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors';
            }
        });
        renderTabContent(container);
    };

    tabBtns.forEach(btn => {
        btn.onclick = () => switchTab(btn.dataset.tab);
    });

    // Default Tab
    switchTab('users');
}

function renderTabContent(container) {
    // Cleanup previous tab if needed
    if (wsTab) wsTab.stopStatusCheck();

    container.innerHTML = '';

    if (currentTab === 'users') {
        usersTab.render();
    } else if (currentTab === 'home') {
        renderHomeConfigTab(container);
    } else if (currentTab === 'websocket') {
        wsTab.render();
    } else if (currentTab === 'hero') {
        heroTab.render();
    }
}
