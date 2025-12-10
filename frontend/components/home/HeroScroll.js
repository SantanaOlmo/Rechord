
export function setupHeroScroll() {
    const main = document.getElementById('main-scroll-container');
    const sidebar = document.getElementById('sidebar-container');
    const hero = document.getElementById('hero-section');

    if (!main || !sidebar || !hero) return;

    // Handler
    const handleScroll = () => {
        const scrollTop = main.scrollTop;
        const threshold = hero.offsetHeight - 80;

        if (scrollTop >= threshold) {
            sidebar.classList.add('sidebar-visible');
        } else {
            sidebar.classList.remove('sidebar-visible');
        }
    };

    main.addEventListener('scroll', handleScroll);
    handleScroll();
}
