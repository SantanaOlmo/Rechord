export function StrummingPanel() {
    return `
        <div class="w-1/4 p-6 flex flex-col items-center justify-center">
            <div class="strumming-box opacity-50">
                <div class="flex space-x-2 text-green-400 text-3xl">
                    <span>↓</span><span>↓</span><span class="opacity-50">↑</span><span>↓</span>
                </div>
            </div>
        </div>
    `;
}
