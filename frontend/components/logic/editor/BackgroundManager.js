import { CONTENT_BASE_URL, API_BASE_URL } from '../../../config.js';

let currentSongId = null;
let bgGridCheck = null;

export function setBackgroundSongId(id) {
    currentSongId = id;
}

export async function loadBackgrounds() {
    const bgGrid = document.getElementById('backgrounds-grid');
    if (!bgGrid || !currentSongId) return;

    bgGridCheck = bgGrid;
    bgGrid.innerHTML = '<p class="col-span-full text-center text-gray-500 mt-10">Cargando...</p>';

    try {
        const res = await fetch(`${API_BASE_URL}/cancion_fondos.php?id_cancion=${currentSongId}`);
        const data = await res.json();
        // Check for error response object
        if (data.error) throw new Error(data.error);
        renderBackgrounds(Array.isArray(data) ? data : []);
    } catch (e) {
        console.error(e);
        renderBackgrounds([]);
        const p = document.createElement('p');
        p.className = 'col-span-full text-center text-red-500 text-xs mt-2';
        p.textContent = 'Error cargando fondos: ' + e.message;
        bgGrid.appendChild(p);
    }
}

function renderBackgrounds(list) {
    const bgGrid = document.getElementById('backgrounds-grid');
    if (!bgGrid) return;

    const uploadBoxHtml = `
        <div id="bg-drop-zone" class="relative group aspect-video bg-gray-800/50 rounded overflow-hidden border-2 border-dashed border-gray-600 hover:border-indigo-500 hover:bg-gray-800 transition-all cursor-pointer flex flex-col items-center justify-center text-gray-400 hover:text-indigo-400">
            <input type="file" id="bg-hidden-input" accept="image/png, image/jpeg, image/gif, image/webp" class="hidden">
            <svg class="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            <span class="text-xs font-semibold">Añadir Fondo</span>
        </div>
    `;

    const itemsHtml = list.map(bg => `
        <div class="relative group aspect-video bg-gray-800 rounded overflow-hidden border border-gray-700">
            <img src="${CONTENT_BASE_URL}/${bg.ruta_fondo}" class="w-full h-full object-cover">
            <button data-delete-bg="${bg.id_fondo}" class="absolute top-1 right-1 p-1 bg-red-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 shadow-sm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        </div>
    `).join('');

    bgGrid.innerHTML = uploadBoxHtml + itemsHtml;

    setupUploadEvents();
    setupDeleteEvents();
}

function setupUploadEvents() {
    const dropZone = document.getElementById('bg-drop-zone');
    const hiddenInput = document.getElementById('bg-hidden-input');

    if (!dropZone || !hiddenInput) return;

    dropZone.addEventListener('click', (e) => { e.stopPropagation(); hiddenInput.click(); });
    hiddenInput.addEventListener('click', (e) => e.stopPropagation());

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault(); e.stopPropagation();
        dropZone.classList.add('bg-gray-700', 'border-indigo-500');
    });
    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault(); e.stopPropagation();
        dropZone.classList.remove('bg-gray-700', 'border-indigo-500');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault(); e.stopPropagation();
        dropZone.classList.remove('bg-gray-700', 'border-indigo-500');
        if (e.dataTransfer.files.length) {
            hiddenInput.files = e.dataTransfer.files;
            hiddenInput.dispatchEvent(new Event('change'));
        }
    });

    hiddenInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) handleBgUpload(file);
    });
}

function setupDeleteEvents() {
    document.querySelectorAll('[data-delete-bg]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // crucial
            deleteBackground(btn.dataset.deleteBg);
        });
    });
}

async function handleBgUpload(file) {
    if (!currentSongId) return;
    const dropZone = document.getElementById('bg-drop-zone');
    const originalContent = dropZone.innerHTML;

    // Spinner
    dropZone.innerHTML = `<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>`;
    dropZone.style.pointerEvents = 'none';

    const formData = new FormData();
    formData.append('id_cancion', currentSongId);
    formData.append('file', file);

    try {
        const res = await fetch(`${API_BASE_URL}/cancion_fondos.php?action=upload`, { method: 'POST', body: formData });

        let data;
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            data = await res.json();
        } else {
            // If not JSON, probably generic HTML error
            const text = await res.text();
            throw new Error("Server returned format error: " + text.substring(0, 50));
        }

        if (res.ok && data.success) {
            loadBackgrounds();
        } else {
            throw new Error(data.error || 'Subida fallida');
        }
    } catch (e) {
        alert('Error: ' + e.message);
        dropZone.innerHTML = originalContent;
        dropZone.style.pointerEvents = 'auto';
        loadBackgrounds(); // Reset state
    }
}

async function deleteBackground(idFondo) {
    if (!confirm('¿Eliminar este fondo?')) return;
    try {
        const res = await fetch(`${API_BASE_URL}/cancion_fondos.php?id_fondo=${idFondo}`, { method: 'DELETE' });
        if (res.ok) {
            loadBackgrounds();
            showToast('Fondo eliminado', 'red');
        }
        else showToast('Error al eliminar', 'red');
    } catch (e) {
        showToast('Error de red al eliminar', 'red');
    }
}

function showToast(message, color = 'green') {
    const toast = document.createElement('div');
    const colorClass = color === 'red' ? 'bg-red-600' : 'bg-green-600';
    toast.className = `fixed bottom-4 right-4 z-[9999] px-6 py-3 rounded shadow-lg text-white font-medium transform transition-all duration-300 translate-y-10 opacity-0 ${colorClass}`;
    toast.textContent = message;

    document.body.appendChild(toast);

    // Animate In (force reflow)
    requestAnimationFrame(() => {
        toast.classList.remove('translate-y-10', 'opacity-0');
        toast.classList.add('translate-y-0', 'opacity-100');
    });

    // Remove
    setTimeout(() => {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('translate-y-10', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
