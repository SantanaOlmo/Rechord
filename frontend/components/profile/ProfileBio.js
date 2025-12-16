export function ProfileBio(user) {
    const userBio = user.bio || 'Sin biografía.';

    return `
        <!-- Bio Section -->
        <div class="bg-[var(--bg-secondary)] rounded-lg p-6 border border-[var(--border-primary)]">
            <h3 class="text-xl font-bold mb-3 text-[var(--accent-light)] flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Acerca de mí
            </h3>
            <p class="text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">${userBio}</p>
        </div>
    </div>
    `;
}
