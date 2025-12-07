/**
 * Servicio Singleton para manejar la reproducción de audio globalmente.
 * Evita que suenen múltiples audios al navegar entre páginas.
 */

class AudioService {
    constructor() {
        if (AudioService.instance) {
            return AudioService.instance;
        }
        this.audio = new Audio();
        this.currentUrl = null;
        AudioService.instance = this;
    }

    /**
     * Carga y reproduce una canción.
     * Si ya está cargada, solo la reproduce.
     * @param {string} url - URL del archivo de audio
     */
    play(url) {
        if (this.currentUrl !== url) {
            this.audio.src = url;
            this.currentUrl = url;
        }
        return this.audio.play();
    }

    pause() {
        this.audio.pause();
    }

    stop() {
        this.audio.pause();
        this.audio.currentTime = 0;
    }

    /**
     * Retorna la instancia del objeto Audio nativo
     * para poder añadir event listeners (timeupdate, ended, etc.)
     */
    getInstance() {
        return this.audio;
    }

    /**
     * Verifica si el audio está reproduciéndose
     */
    isPlaying() {
        return !this.audio.paused;
    }
}

export const audioService = new AudioService();
