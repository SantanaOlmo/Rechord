export class Toast {
    static container = null;

    static init() {
        if (!document.getElementById('toast-container')) {
            this.container = document.createElement('div');
            this.container.id = 'toast-container';
            this.container.className = 'fixed bottom-4 right-4 flex flex-col gap-2 z-50';
            document.body.appendChild(this.container);

            // Inject styles if needed (Tailwind is assumed based on project)
            // If raw CSS is needed:
            /*
            this.container.style.cssText = "position: fixed; bottom: 20px; right: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 10px;";
            */
        } else {
            this.container = document.getElementById('toast-container');
        }
    }

    static show(message, type = 'success') {
        this.init();

        const toast = document.createElement('div');

        let bgClass = 'bg-gray-800';
        let textClass = 'text-white';
        let borderClass = 'border-gray-700';

        if (type === 'success') {
            bgClass = 'bg-stone-900'; // Dark elegant
            borderClass = 'border-green-500';
            textClass = 'text-green-500';
        } else if (type === 'error') {
            bgClass = 'bg-stone-900';
            borderClass = 'border-red-600';
            textClass = 'text-red-500';
        }

        toast.className = `min-w-[300px] p-4 rounded-lg shadow-xl border-l-4 ${bgClass} ${borderClass} flex items-center justify-between transform transition-all duration-300 translate-y-10 opacity-0`;

        toast.innerHTML = `
            <div class="flex items-center">
                <span class="${textClass} font-medium text-sm">${message}</span>
            </div>
            <button class="ml-4 text-gray-500 hover:text-white focus:outline-none" onclick="this.parentElement.remove()">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        `;

        this.container.appendChild(toast);

        // Animate in
        requestAnimationFrame(() => {
            toast.classList.remove('translate-y-10', 'opacity-0');
        });

        // Auto remove
        setTimeout(() => {
            toast.classList.add('opacity-0', 'translate-x-full');
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    }
}
