import { nukeCache } from './reset.js';
nukeCache();

import { authService } from './services/authService.js';


import { Router } from './core/Router.js';
import { Store, EVENTS } from './core/StateStore.js';
import { Header } from './components/layout/Header.js';

import { setupGlobalEvents } from './logic/globalEvents.js';
import { TooltipSystem } from './components/common/TooltipSystem.js';
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)

console.log('%c RECHORD FRONTEND - VERSION: 2025-12-08 17:40 (Refactored) ', 'background: #222; color: #bada55; font-size: 16px; padding: 10px;');

// Initialize Global Logic (Play, Like, etc.)
setupGlobalEvents();

// Initialize Custom Tooltips (Global)
TooltipSystem.init();

<<<<<<< HEAD
// Initialize Socket if User is Logged In
=======

>>>>>>> 5e4f432 (subir a render)
// Initialize Socket if User is Logged In
// Socket removed for migration to Realtime
// const currentUser = authService.getCurrentUser();
// if (currentUser) {
//    // Manual connection via Admin Panel now preferred to avoid spam
//    // socketService.connect(currentUser.id_usuario);
//    // window.socketService = socketService; // Expose for Modal
// }

// Global Playback Queue Handler
Store.subscribe(EVENTS.PLAYER.PLAY_QUEUE, (data) => {
    const { queue, startIndex } = data;
    localStorage.setItem('playbackQueue', JSON.stringify(queue));
    const songToPlay = queue[startIndex];
    if (songToPlay) {
        window.navigate('/player/' + songToPlay.id);
    }
});

// Demo: Subscribe to Auth Event
Store.subscribe(EVENTS.USER.AUTH_SUCCESS, (user) => {
    console.log('⚡ Event Received: AUTH_SUCCESS for user', user);
    Header.render();
    //     if (user && user.id_usuario) {
    //         // socketService.connect(user.id_usuario);
    //     }
});

// Inject Shared Session Modal
// document.body.insertAdjacentHTML('beforeend', RoomModal());

// Initialize Router (Starts the app)
Router.init();
