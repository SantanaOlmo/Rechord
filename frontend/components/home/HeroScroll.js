
export function setupHeroScroll() {
    const main = document.getElementById('main-scroll-container');
    const sidebar = document.getElementById('sidebar-container');
    const hero = document.getElementById('hero-section');
    const header = document.querySelector('header');


    if (!main || !sidebar || !hero) return;

    // Handler
    const handleScroll = () => {
        const scrollTop = main.scrollTop;
        const threshold = hero.offsetHeight - 80; // Start transition slightly before end of hero


        if (scrollTop >= threshold) {
            sidebar.classList.add('sidebar-visible');
        } else {
            sidebar.classList.remove('sidebar-visible');
        }

        // Header Transparency Logic
        // If we are at the top (hero area), header is transparent.
        // Once we pass the threshold (or even a bit earlier for smoother effect), it becomes solid.
        // Let's us a slightly smaller threshold for header so it turns solid just as we leave hero.

        if (header) {
            if (scrollTop < threshold - 50) {
                header.classList.add('header-transparent');
            } else {
                header.classList.remove('header-transparent');
            }
        }
    };

    main.addEventListener('scroll', handleScroll);

    // Initial check

    handleScroll();
}
