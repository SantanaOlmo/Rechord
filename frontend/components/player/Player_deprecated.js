/**
 * Componente Reproductor de Audio
 */
export class Player {
    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.audio = new Audio();
        this.isPlaying = false;
        this.currentSong = null;
        this.onNext = options.onNext || (() => { });
        this.onPrev = options.onPrev || (() => { });

        this.render();
        this.attachEvents();
    }

    loadSong(song) {
        this.currentSong = song;
        // Ajustar ruta según estructura
        const path = song.archivo_mp3.startsWith('http')
            ? song.archivo_mp3
            : `../backend/uploads/music/${song.archivo_mp3}`;

        this.audio.src = path;
        this.updateInfo();
        this.play();
    }

    play() {
        this.audio.play().then(() => {
            this.isPlaying = true;
            this.updatePlayButton();
        }).catch(err => console.error('Error playing:', err));
    }

    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.updatePlayButton();
    }

    togglePlay() {
        if (this.isPlaying) this.pause();
        else this.play();
    }

    updateInfo() {
        const titleEl = document.getElementById('player-title');
        const artistEl = document.getElementById('player-artist');
        if (this.currentSong) {
            if (titleEl) titleEl.textContent = this.currentSong.titulo;
            if (artistEl) artistEl.textContent = this.currentSong.artista || 'Desconocido';
        }
    }

    updatePlayButton() {
        const btn = document.getElementById('player-play-btn');
        if (!btn) return;

        if (this.isPlaying) {
            btn.innerHTML = `<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
        } else {
            btn.innerHTML = `<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`;
        }
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="player-bar">
                <div class="player-content">
                    
                    <!-- Info Canción -->
                    <div class="player-info">
                        <h4 id="player-title" class="player-title">Sin reproducción</h4>
                        <p id="player-artist" class="player-artist">-</p>
                    </div>

                    <!-- Controles Principales -->
                    <div class="player-controls-center">
                        <div class="controls-buttons">
                            <button id="player-prev-btn" class="btn-control">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
                            </button>
                            
                            <button id="player-play-btn" class="btn-play-main">
                                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                            </button>
                            
                            <button id="player-next-btn" class="btn-control">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
                            </button>
                        </div>
                        
                        <!-- Barra de Progreso -->
                        <div class="progress-container">
                            <span id="player-current-time">0:00</span>
                            <div class="progress-bar-wrapper group" id="player-progress-bar">
                                <div id="player-progress-fill" class="progress-fill"></div>
                                <div id="player-progress-handle" class="progress-handle"></div>
                            </div>
                            <span id="player-total-time">0:00</span>
                        </div>
                    </div>

                    <!-- Volumen y Extras -->
                    <div class="player-volume">
                        <div class="volume-slider-group group">
                            <button id="player-mute-btn" class="btn-control">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
                            </button>
                            <input type="range" id="player-volume" min="0" max="1" step="0.1" value="1" class="volume-slider">
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    attachEvents() {
        // Play/Pause
        document.getElementById('player-play-btn')?.addEventListener('click', () => this.togglePlay());

        // Prev/Next
        document.getElementById('player-prev-btn')?.addEventListener('click', () => this.onPrev());
        document.getElementById('player-next-btn')?.addEventListener('click', () => this.onNext());

        // Audio Events
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('loadedmetadata', () => {
            const totalTimeEl = document.getElementById('player-total-time');
            if (totalTimeEl) totalTimeEl.textContent = this.formatTime(this.audio.duration);
        });
        this.audio.addEventListener('ended', () => {
            this.isPlaying = false;
            this.updatePlayButton();
            this.onNext(); // Auto-advance
        });

        // Progress Bar Click
        const progressBar = document.getElementById('player-progress-bar');
        if (progressBar) {
            progressBar.addEventListener('click', (e) => {
                const rect = progressBar.getBoundingClientRect();
                const pos = (e.clientX - rect.left) / rect.width;
                this.audio.currentTime = pos * this.audio.duration;
            });
        }

        // Volume
        const volumeSlider = document.getElementById('player-volume');
        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                this.audio.volume = e.target.value;
            });
        }
    }

    updateProgress() {
        const current = this.audio.currentTime;
        const duration = this.audio.duration || 1;
        const percent = (current / duration) * 100;

        const fill = document.getElementById('player-progress-fill');
        const handle = document.getElementById('player-progress-handle');
        const timeEl = document.getElementById('player-current-time');

        if (fill) fill.style.width = `${percent}%`;
        if (handle) handle.style.left = `${percent}%`;
        if (timeEl) timeEl.textContent = this.formatTime(current);
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
}
