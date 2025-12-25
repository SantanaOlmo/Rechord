import { API_BASE_URL, CONTENT_BASE_URL } from '../../config.js';
import { API_ROUTES } from '../../api/routes.js';

export class AdminHeroTab {
    constructor(containerId) {
        this.containerId = containerId;
        this.videos = [];
        this.activeVideoId = null;
    }

    async render() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="p-6">
                <h3 class="text-xl font-bold mb-4 text-[var(--text-primary)]">Gestión de Hero Video</h3>
                <p class="text-[var(--text-muted)] mb-6">Selecciona el video activo o sube uno nuevo arrastrándolo a la tarjeta "+".</p>
                
                <div id="hero-carousel-container" class="flex overflow-x-auto gap-6 pb-6 scrollbar-hide snap-x">
                    <!-- Carousel Items injected here -->
                    <div class="animate-pulse flex space-x-4">
                         <div class="w-64 h-40 bg-gray-800 rounded-lg"></div>
                         <div class="w-64 h-40 bg-gray-800 rounded-lg"></div>
                    </div>
                </div>
            </div>
        `;

        await this.loadVideos();
    }

    async loadVideos() {
        try {
            const res = await fetch(`${API_ROUTES.HERO}?action=list`);
            this.videos = await res.json();

            // Determine active
            const active = this.videos.find(v => v.activo == 1);
            this.activeVideoId = active ? active.id_hero : null;

            this.renderCarousel();
        } catch (e) {
            console.error('Error loading videos', e);
            // Even if loading fails, render carousel so upload card appears
            this.videos = [];
            this.renderCarousel();
            // Optional: show error toast instead of breaking UI
        }
    }

    renderCarousel() {
        const carousel = document.getElementById('hero-carousel-container');
        if (!carousel) return;

        let html = this.videos.map(video => {
            const isActive = video.activo == 1;
            const videoUrl = `${CONTENT_BASE_URL}/${video.ruta_video}`;

            return `
                <div class="relative flex-shrink-0 w-80 h-48 bg-[var(--bg-tertiary)] rounded-xl overflow-hidden border-2 transition-all group snap-center ${isActive ? 'border-[var(--accent-primary)] shadow-indigo-500/20 shadow-lg' : 'border-[var(--border-primary)] hover:border-[var(--border-hover)]'}">
                    ${videoUrl.match(/\.(mp4|webm|mov)$/i)
                    ? `<video src="${videoUrl}" class="w-full h-full object-cover muted"></video>`
                    : `<img src="${videoUrl}" class="w-full h-full object-cover" />`
                }
                    
                    <!-- Overlay Info -->
                    <div class="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all flex flex-col justify-between p-3">
                        <div class="flex justify-between items-start">
                                <button class="btn-toggle text-xs px-3 py-1 rounded-full font-medium transition-colors border ${isActive ? 'bg-indigo-600 text-white border-indigo-500 hover:bg-indigo-700' : 'bg-gray-900/80 text-white border-gray-600 hover:bg-green-600'}" data-id="${video.id_hero}">
                                    ${isActive ? 'ACTIVO' : 'Activar'}
                                </button>
                             <button class="btn-delete text-red-400 hover:text-red-200 bg-gray-900/50 rounded-full p-1" data-id="${video.id_hero}">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                             </button>
                        </div>
                        <p class="text-white text-sm font-medium truncate drop-shadow-md">${video.titulo}</p>
                    </div>
                </div>
            `;
        }).join('');

        // Add Upload Card
        html += `
            <div id="drop-zone" class="relative flex-shrink-0 w-80 h-48 bg-[var(--bg-tertiary)] border-2 border-dashed border-[var(--border-primary)] rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[var(--accent-primary)] hover:bg-[var(--bg-secondary)] transition-all group snap-center group">
                <input type="file" id="video-upload-input" class="hidden" accept="video/mp4,video/webm,video/quicktime,image/gif,image/webp">
                
                <div class="pointer-events-none flex flex-col items-center transition-transform group-hover:scale-110">
                    <div class="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center mb-3 group-hover:bg-indigo-600 transition-colors">
                        <svg class="w-6 h-6 text-gray-300 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                    </div>
                    <span class="text-gray-400 text-sm font-medium group-hover:text-white">Subir Video</span>
                    <span class="text-gray-600 text-xs mt-1">Arrastra o haz clic</span>
                </div>
                
                <!-- Loading Overlay -->
                 <div id="upload-loading" class="absolute inset-0 bg-gray-900/90 hidden items-center justify-center flex-col">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mb-2"></div>
                    <span class="text-xs text-indigo-400 animate-pulse">Subiendo...</span>
                </div>
            </div>
        `;

        carousel.innerHTML = html;
        this.attachEvents();
    }

    attachEvents() {
        const dropZone = document.getElementById('drop-zone');
        const fileInput = document.getElementById('video-upload-input');
        const carousel = document.getElementById('hero-carousel-container');

        // Toggles
        carousel.querySelectorAll('.btn-toggle').forEach(btn => {
            btn.addEventListener('click', () => this.toggleVideo(btn.dataset.id));
        });

        // Deleters
        carousel.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent card clicks if any
                this.deleteVideo(btn.dataset.id);
            });
        });

        // Upload Logic
        dropZone.addEventListener('click', () => fileInput.click());

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleUpload(e.target.files[0]);
            }
        });

        // Drag & Drop
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('border-indigo-500', 'bg-gray-800');
        });
        dropZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            dropZone.classList.remove('border-indigo-500', 'bg-gray-800');
        });
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('border-indigo-500', 'bg-gray-800');
            if (e.dataTransfer.files.length > 0) {
                this.handleUpload(e.dataTransfer.files[0]);
            }
        });
    }

    async handleUpload(file) {
        if (!file.type.startsWith('video/') && !['image/gif', 'image/webp'].includes(file.type)) {
            this.showToast('Por favor sube un archivo válido (MP4, WEBM, GIF, WEBP).', 'error');
            return;
        }

        // Show loading
        const loader = document.getElementById('upload-loading');
        if (loader) loader.classList.remove('hidden');
        if (loader) loader.classList.add('flex');

        const formData = new FormData();
        formData.append('video', file);
        // Default title from filename
        formData.append('titulo', file.name.replace(/\.[^/.]+$/, ""));

        try {
            const res = await fetch(`${API_ROUTES.HERO}?action=upload`, {
                method: 'POST',
                body: formData
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Error subiendo');

            // Success
            await this.loadVideos(); // Reload list
        } catch (e) {
            this.showToast(e.message, 'error');
            if (loader) loader.classList.add('hidden');
            if (loader) loader.classList.remove('flex');
        }
    }

    async toggleVideo(id) {
        try {
            const res = await fetch(`${API_ROUTES.HERO}?action=toggle_active`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            if (!res.ok) throw new Error('Failed to toggle active');
            await this.loadVideos();
        } catch (e) {
            console.error(e);
            this.showToast('Error al cambiar estado del video', 'error');
        }
    }

    async deleteVideo(id) {
        if (!confirm("¿Seguro que quieres borrar este video?")) return;
        try {
            const res = await fetch(`${API_ROUTES.HERO}?action=delete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            if (!res.ok) throw new Error('Failed to delete');
            await this.loadVideos();
            this.showToast('Video eliminado', 'success');
        } catch (e) {
            console.error(e);
            this.showToast('Error al eliminar video', 'error');
        }
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-xl text-white font-medium transform transition-all duration-300 translate-y-full opacity-0 z-50 ${type === 'error' ? 'bg-red-600' : 'bg-green-600'}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        // Animate in
        requestAnimationFrame(() => {
            toast.classList.remove('translate-y-full', 'opacity-0');
        });

        // Remove after 3s
        setTimeout(() => {
            toast.classList.add('translate-y-full', 'opacity-0');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}
