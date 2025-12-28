
export function createExplosion(x, y, color) {
    const particleCount = 15;
    const container = document.body;

    for (let i = 0; i < particleCount; i++) {
        const p = document.createElement('div');
        p.className = 'fixed z-[100] rounded-full pointer-events-none';
        p.style.width = Math.random() * 4 + 2 + 'px';
        p.style.height = p.style.width;
        p.style.backgroundColor = color || '#237BFF';
        p.style.left = x + 'px';
        p.style.top = y + 'px';

        // Random velocity
        const velocityX = (Math.random() - 0.5) * 10;
        const velocityY = (Math.random() - 1) * 10; // More upwards

        container.appendChild(p);

        // Web Animation API for performance
        const animation = p.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${velocityX * 60}px, ${velocityY * 60 + 100}px) scale(0)`, opacity: 0 } // Gravityish
        ], {
            duration: 600 + Math.random() * 200,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            fill: 'forwards'
        });

        animation.onfinish = () => p.remove();
    }
}

export async function animateDeletionSequence(ids, isMobile) {
    const suffix = isMobile ? '-mobile' : '';
    // Find Element Wrappers
    const elements = ids.map(id => {
        const nameEl = document.getElementById(`folder-name-${id}${suffix}`);
        const wrapper = nameEl?.closest('.folder-wrapper');
        return { id, wrapper };
    }).filter(item => item.wrapper); // Filter out not found

    // Sort by position in DOM (Top to Bottom) then reverse for Bottom-Up
    elements.sort((a, b) => {
        const rectA = a.wrapper.getBoundingClientRect();
        const rectB = b.wrapper.getBoundingClientRect();
        return rectB.top - rectA.top; // Descending (Bottom first)
    });

    // Staggered Animation
    for (const item of elements) {
        const rect = item.wrapper.getBoundingClientRect();

        // Center of the folder row
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Trigger Explosion
        createExplosion(centerX, centerY, '#237BFF');

        // Trigger CSS Dissolve
        item.wrapper.style.transition = 'all 0.2s ease-out';
        item.wrapper.style.transform = 'scale(0.9) translateX(-20px)';
        item.wrapper.style.opacity = '0';
        item.wrapper.style.filter = 'blur(4px)';

        // Fast staggered delay (chain reaction)
        await new Promise(r => setTimeout(r, 80));
    }

    // Allow last animation to be slightly visible before hard re-render
    await new Promise(r => setTimeout(r, 100));
}
