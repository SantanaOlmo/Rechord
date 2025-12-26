
export function setupFooterTheme() {
    const themeBtn = document.getElementById('theme-toggle-btn');
    const themeLink = document.getElementById('theme-style');

    if (!themeBtn || !themeLink) return;

    // Load saved preference
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const isDark = savedTheme === 'dark';

    // Apply initial state
    themeLink.href = isDark ? 'styles/theme-dark.css' : 'styles/theme-light.css';
    updateIcon(isDark);

    themeBtn.addEventListener('click', () => {
        const currentHref = themeLink.getAttribute('href');
        const isCurrentlyDark = currentHref.includes('theme-dark.css');
        const newTheme = isCurrentlyDark ? 'light' : 'dark';

        themeLink.href = isCurrentlyDark ? 'styles/theme-light.css' : 'styles/theme-dark.css';
        localStorage.setItem('theme', newTheme);
        updateIcon(!isCurrentlyDark);
    });

    function updateIcon(isDark) {
        // Simple Sun/Moon SVG swap
        themeBtn.innerHTML = isDark
            ? `<svg class="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>` // Sun (for switching TO light?) No, if it IS dark, show Sun to switch to light? Or show Moon because it IS dark? Usually show "Current State" icon or "Target State" icon.
            // Let's show the Icon representing the CURRENT state (Moon for Dark, Sun for Light) or the toggle action.
            // Let's show Moon when Dark, Sun when Light.
            // Actually, usually you show the icon of the mode you are IN.
            : `<svg class="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>`; // Moon

        // Wait, if it is Dark, I probably want to switch to Light (Sun icon). 
        // If it is Light, I want to switch to Dark (Moon icon).
        // Let's stick to: Icon represents *current* theme? Or *action*?
        // "Toggle Theme" usually shows the *other* one. 
        // If Dark -> Show Sun (Click to Light).
        // If Light -> Show Moon (Click to Dark).

        // Re-deciding:
        // isDark = true (Dark Mode active) -> Button shows Sun (Switch to Light)
        if (isDark) {
            themeBtn.innerHTML = `<svg class="w-5 h-5 text-yellow-400 hover:text-yellow-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>`;
        } else {
            themeBtn.innerHTML = `<svg class="w-5 h-5 text-indigo-600 hover:text-indigo-800 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>`;
        }
    }
}

<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
export function Footer() {
    const handleNav = (path) => {
        window.location.hash = path;
    };
    window.handleFooterNav = handleNav;

    // We use arbitrary tailwind values referring to CSS vars for theming
    // bg-[var(--bg-primary)] etc.
    // Or we rely on the fact that we will replace base styles.

    return `
        <footer class="bg-[var(--bg-primary)] border-t border-[var(--border-primary)] pt-12 pb-2 px-8 mt-auto w-full transition-colors duration-300">
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
            <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                
                <!-- Col 1: Logo Section (Left) -->
                <div class="flex flex-col items-center md:items-start text-center md:text-left">
<<<<<<< HEAD
                    <h1 class="text-4xl font-extrabold tracking-tighter text-[var(--text-primary)]">
                        ReChord<span class="text-[var(--accent-primary)]">.</span>
                    </h1>
                    <p class="text-[var(--text-secondary)] text-sm mt-2">Tu música, tus reglas.</p>
=======
                    <a href="#/" class="flex items-center gap-2 group mb-2">
                        <img src="assets/icons/rechord.png" alt="ReChord Logo" class="h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-300">
                        <h1 class="text-3xl font-extrabold tracking-tighter text-[var(--text-primary)]">
                            ReChord<span class="text-[var(--accent-primary)]">.</span>
                        </h1>
                    </a>
                    <p class="text-[var(--text-secondary)] text-sm mt-1">Tu música, tus reglas.</p>
>>>>>>> 5e4f432 (subir a render)
                </div>

                <!-- Col 2: Useful Links (Center) -->
                <div class="flex flex-col items-center md:items-start space-y-3 text-sm text-[var(--text-muted)]">
                    <h3 class="text-[var(--text-primary)] font-semibold mb-1">Información</h3>
                    <a href="#/privacy-policy" class="hover:text-[var(--accent-light)] transition-colors">Política de Privacidad</a>
                    <a href="#/data-protection" class="hover:text-[var(--accent-light)] transition-colors">Protección de Datos</a>
                    <a href="#/faqs" class="hover:text-[var(--accent-light)] transition-colors">FAQs</a>
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
                </div>

                <!-- Col 3: Social Media Links (Right) -->
                <div class="flex flex-col items-center md:items-center">
                    <h3 class="text-[var(--text-primary)] font-semibold mb-4 md:hidden">Síguenos</h3>
                    <div class="flex space-x-4 md:space-x-0 md:flex-col md:space-y-4">
                        <!-- GitHub -->
                        <a href="https://github.com/SantanaOlmo/Rechord" target="_blank" class="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors duration-300">
                            <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"/></svg>
                        </a>

                        <!-- Gmail -->
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
                        <a href="mailto:alberto16166@gmail.com" class="hover:opacity-80 transition-opacity">
                            <img src="assets/icons/social_media/LogosGoogleGmail.svg" alt="Gmail" class="w-6 h-6 filter grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                        </a>

                        <!-- Instagram -->
                        <a href="https://instagram.com" target="_blank" class="text-[var(--text-muted)] hover:text-[#E1306C] transition-colors duration-300">
                            <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3"/></svg>
                        </a>

                        <!-- X -->
                        <a href="https://twitter.com" target="_blank" class="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors duration-300">
                            <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M17.751 3h3.067l-6.7 7.625L22 21h-6.172l-4.833-6.293L5.464 21h-3.07l7.167-8.155L2 3h6.328l4.37 5.752zm-1.076 16.172h1.7L7.404 4.732H5.58z"/></svg>
                        </a>

                        <!-- Facebook -->
                        <a href="https://facebook.com" target="_blank" class="text-[var(--text-muted)] hover:text-[#1877F2] transition-colors duration-300">
                            <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12 2.04c-5.5 0-10 4.49-10 10.02c0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89c1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02"/></svg>
                        </a>

                        <!-- YouTube -->
                        <a href="https://youtube.com" target="_blank" class="text-[var(--text-muted)] hover:text-[#FF0000] transition-colors duration-300">
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
                            <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="m10 15l5.19-3L10 9zm11.56-7.83c.13.47.22 1.1.28 1.9c.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83c-.25.9-.83 1.48-1.73 1.73c-.47.13-1.33.22-2.65.28c-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44c-.9-.25-1.48-.83-1.73-1.73c-.13-.47-.22-1.1-.28-1.9c-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83c.25-.9.83-1.48 1.73-1.73c.47-.13 1.33-.22 2.65-.28c1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44c.9.25 1.48.83 1.73 1.73"/></svg>
                        </a>
                    </div>
                </div>
            </div>

            <!-- Navigation & Copyright & Toggle -->
            <div class="max-w-7xl mx-auto mt-4 pt-4 border-t border-[var(--border-primary)] flex flex-col md:flex-row justify-between items-center text-xs text-[var(--text-muted)]">
                <div class="flex flex-wrap justify-center md:justify-start gap-x-2 gap-y-1 mb-2 md:mb-0">
                    <a href="#/privacy-policy" class="hover:text-[var(--text-primary)] transition-colors">Política de privacidad</a>
                    <span class="text-[var(--border-primary)]">|</span>
                    <a href="#" class="hover:text-[var(--text-primary)] transition-colors">Uso de cookies</a>
                    <span class="text-[var(--border-primary)]">|</span>
                    <a href="#" class="hover:text-[var(--text-primary)] transition-colors">Condiciones de uso</a>
                    <span class="text-[var(--border-primary)]">|</span>
                    <a href="#" class="hover:text-[var(--text-primary)] transition-colors">Ventas y reembolsos</a>
                    <span class="text-[var(--border-primary)]">|</span>
                    <a href="#" class="hover:text-[var(--text-primary)] transition-colors">Avisos legales</a>
                    <span class="text-[var(--border-primary)]">|</span>
                    <a href="#/sitemap" class="hover:text-[var(--text-primary)] transition-colors">Mapa del sitio</a>
                </div>
                
                <div class="flex items-center gap-4">
                    <span>&copy; 2025 ReChord. Todos los derechos reservados.</span>
                    
                    <!-- Theme Toggle Btn -->
                    <button id="theme-toggle-btn" class="p-1 rounded-full hover:bg-[var(--bg-tertiary)] transition-colors focus:outline-none" title="Cambiar tema">
                        <!-- Icon injected by JS -->
                    </button>
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
                </div>
            </div>
        </footer>
    `;
}
