/**
 * StateStore.js
 * Centralized State Management (Pub-Sub)
 */

class StateStore {
    constructor() {
        this.events = {};
        // Initial state as per requirements
        this.state = {
            user: null,
            currentSongId: null,
            isPlaying: false,
            volume: 1.0,
            // Keeping 'playback' for backward compatibility with existing components if they used it, 
            // though requirements asked for top level keys. 
            // I'll keep the top level keys as the primary truth.
            playback: {
                queue: []
            },
            ui: {
                theme: 'dark'
            },
            room: {
                id: null,
                isMaster: false,
                members: []
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
/**
 * StateStore.js
 * Centralized State Management (Pub-Sub)
 */

class StateStore {
    constructor() {
        this.events = {};
        // Initial state as per requirements
        this.state = {
            user: null,
            currentSongId: null,
            isPlaying: false,
            volume: 1.0,
            // Keeping 'playback' for backward compatibility with existing components if they used it, 
            // though requirements asked for top level keys. 
            // I'll keep the top level keys as the primary truth.
            playback: {
                queue: []
            },
            ui: {
                theme: 'dark'
            },
            room: {
                id: null,
                isMaster: false,
                members: []
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
        PAUSE: 'PLAYER:PAUSE',
        RESUME: 'PLAYER:RESUME',
        UPDATE_POSITION: 'PLAYER:UPDATE_POSITION',
        PLAY_QUEUE: 'PLAYER:PLAY_QUEUE',
        TOGGLE_PLAY: 'PLAYER:TOGGLE_PLAY',
        SONG_CHANGED: 'PLAYER:SONG_CHANGED'
    },
    USER: {
        AUTH_SUCCESS: 'USER:AUTH_SUCCESS',
        LOGOUT: 'USER:LOGOUT'
    },
    UI: {
        THEME_CHANGED: 'UI:THEME_CHANGED'
    },
    SOCKET: {
        CONNECTED: 'SOCKET:CONNECTED',
        DISCONNECTED: 'SOCKET:DISCONNECTED',
        SYNC_STATE: 'SOCKET:SYNC_STATE',
        MEMBER_UPDATE: 'SOCKET:MEMBER_UPDATE'
    },
    SOCKET: {
        CONNECTED: 'SOCKET:CONNECTED',
        DISCONNECTED: 'SOCKET:DISCONNECTED',
        SYNC_STATE: 'SOCKET:SYNC_STATE',
        MEMBER_UPDATE: 'SOCKET:MEMBER_UPDATE'
    }
};
