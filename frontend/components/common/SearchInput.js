/**
 * Reusable Search Input Component
 * Handles input events with debounce.
 */
export class SearchInput {
    constructor({ placeholder = 'Buscar...', debounceTime = 300, onSearch, classes = '' }) {
        this.placeholder = placeholder;
        this.debounceTime = debounceTime;
        this.onSearch = onSearch;
        this.classes = classes;
        this.timer = null;
    }

    render() {
        return `
            <div class="relative w-full ${this.classes}">
                <input type="text" 
                    id="search-input-${Math.random().toString(36).substr(2, 9)}" 
                    class="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                    placeholder="${this.placeholder}"
                >
                <svg class="w-5 h-5 text-gray-500 absolute left-3 top-2.5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
            </div>
        `;
    }

    attachEvents(container) {
        const input = container.querySelector('input');
        if (!input) return;

        input.addEventListener('input', (e) => {
            const term = e.target.value;
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                if (this.onSearch) this.onSearch(term);
            }, this.debounceTime);
        });
    }
}
