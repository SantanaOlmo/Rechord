/**
 * StateStore.js
 * Centralized State Management (Pub-Sub)
 */

class StateStore {
    constructor() {
        this.events = {};
        this.state = {
            currentUser: null,
            playback: {
                currentSong: null,
                isPlaying: false,
                queue: []
            },
            ui: {
                theme: 'dark'
            }
        };
    }

    /**
     * Subscribe to an event
     * @param {string} eventName 
     * @param {Function} callback 
     * @returns {Function} unsubscribe function
     */
    subscribe(eventName, callback) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(callback);

        // Return unsubscribe
        return () => {
            this.events[eventName] = this.events[eventName].filter(cb => cb !== callback);
        };
    }

    /**
     * Publish an event with data
     * @param {string} eventName 
     * @param {any} data 
     */
    publish(eventName, data) {
        if (!this.events[eventName]) return;
        this.events[eventName].forEach(callback => callback(data));
    }

    /**
     * Set state and notify if changed (optional simple store pattern)
     * @param {string} key 
     * @param {any} value 
     */
    setState(key, value) {
        this.state[key] = value;
        this.publish(`STATE_CHANGED:${key}`, value);
        this.publish('STATE_CHANGED', this.state);
    }

    getState() {
        return this.state;
    }
}

export const Store = new StateStore();

// Event Constants
export const EVENTS = {
    PLAYER: {
        PLAY_SONG: 'PLAYER:PLAY_SONG',
        PLAY_QUEUE: 'PLAYER:PLAY_QUEUE',
        TOGGLE_PLAY: 'PLAYER:TOGGLE_PLAY',
        SONG_CHANGED: 'PLAYER:SONG_CHANGED'
    },
    AUTH: {
        LOGIN: 'AUTH:LOGIN',
        LOGOUT: 'AUTH:LOGOUT'
    },
    UI: {
        THEME_CHANGED: 'UI:THEME_CHANGED'
    }
};
