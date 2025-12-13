export const TooltipSystem = {
    init: () => {
        // 1. Inject Styles
        if (document.getElementById('tooltip-styles')) return; // Prevent duplicates

        const style = document.createElement('style');
        style.id = 'tooltip-styles';
        style.textContent = `
            #rechord-tooltip {
                position: fixed;
                background-color: #111827; /* gray-900 */
                color: #f9fafb; /* gray-50 */
                padding: 6px 12px;
                border-radius: 6px; /* "Un pelín de border radius" */
                font-size: 12px;
                font-family: inherit;
                z-index: 99999;
                pointer-events: none;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                border: 1px solid #374151; /* gray-700, DARK border, not white */
                opacity: 0;
                transform: scale(0.95);
                transition: opacity 0.15s ease, transform 0.15s ease;
                white-space: nowrap;
                max-width: 300px;
                text-overflow: ellipsis;
                overflow: hidden;
            }
            #rechord-tooltip.visible {
                opacity: 1;
                transform: scale(1);
            }
        `;
        document.head.appendChild(style);

        // 2. Create Tooltip Element
        let tooltip = document.getElementById('rechord-tooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.id = 'rechord-tooltip';
            document.body.appendChild(tooltip);
        }

        // 3. Global Event Delegation
        document.addEventListener('mouseover', (e) => {
            let target = e.target;

            // Traverse up to find element with title or data-tooltip
            // Uses closest() for efficiency but specific checks to avoid bubbling too far
            const tooltipNode = target.closest('[title], [data-tooltip]');
            if (!tooltipNode) {
                tooltip.classList.remove('visible');
                return;
            }

            // Swap title -> data-tooltip to suppress native browser tooltip
            if (tooltipNode.hasAttribute('title')) {
                const titleText = tooltipNode.getAttribute('title');
                if (titleText) {
                    tooltipNode.setAttribute('data-tooltip', titleText);
                    tooltipNode.removeAttribute('title');
                    tooltipNode.setAttribute('aria-label', titleText); // Accessibility
                }
            }

            const text = tooltipNode.getAttribute('data-tooltip');
            if (!text) return;

            // Show and Position
            tooltip.textContent = text;
            tooltip.classList.add('visible');

            const rect = tooltipNode.getBoundingClientRect();
            const tipRect = tooltip.getBoundingClientRect();

            // Default: Bottom Center
            let top = rect.bottom + 8;
            let left = rect.left + (rect.width / 2) - (tipRect.width / 2);

            // Bounds check
            if (left < 10) left = 10;
            if (left + tipRect.width > window.innerWidth - 10) left = window.innerWidth - tipRect.width - 10;

            // Flip to top if too low
            if (top + tipRect.height > window.innerHeight - 10) {
                top = rect.top - tipRect.height - 8;
            }

            tooltip.style.top = `${top}px`;
            tooltip.style.left = `${left}px`;
        });

        document.addEventListener('mouseout', (e) => {
            // Simple hide on any mouseout prevents stuck tooltips, 
            // the mouseover logic handles showing it again immediately if moved to another valid target
            const tooltip = document.getElementById('rechord-tooltip');
            if (tooltip) tooltip.classList.remove('visible');
        });

        // Cleanup on scroll/click
        window.addEventListener('scroll', () => {
            const tooltip = document.getElementById('rechord-tooltip');
            if (tooltip) tooltip.classList.remove('visible');
        }, true);
    }
};
