export async function nukeCache() {
    console.log('☢️ STARTING NUCLEAR CACHE RESET ☢️');

    // 1. Unregister Service Workers
    if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
            console.log('Unregistering SW:', registration);
            await registration.unregister();
        }
        if (registrations.length > 0) {
            console.log('✅ Service Workers Unregistered');
            window.location.reload(); // Reload to take effect
            return;
        }
    }

    // 2. Clear Cache Storage
    if ('caches' in window) {
        const keys = await caches.keys();
        for (const key of keys) {
            console.log('Deleting Cache:', key);
            await caches.delete(key);
        }
    }

    console.log('✅ Cache Cleared');
}
