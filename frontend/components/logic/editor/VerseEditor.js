export const VerseEditor = {
    renderVerses() {
        const container = document.getElementById('verses-container');
        if (!container) return;

        const prevScroll = container.scrollTop;
        const rawLyrics = document.getElementById('edit-lyrics').value;
        const verses = rawLyrics.split(/\n\s*\n/).filter(v => v.trim() !== '');

        container.innerHTML = '';
        if (verses.length === 0) verses.push('');

        verses.forEach((verseText, index) => {
            const verseWrapper = document.createElement('div');
            verseWrapper.className = 'flex items-start space-x-2 group';

            const num = document.createElement('span');
            num.className = 'text-gray-600 text-xs mt-3 w-4 text-right shrink-0 select-none';
            num.textContent = index + 1;

            const verseEl = document.createElement('textarea');
            verseEl.className = 'flex-1 bg-gray-800 text-white p-3 rounded border border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm leading-relaxed resize-none overflow-hidden transition-colors';
            verseEl.value = verseText;
            verseEl.rows = 1;
            verseEl.dataset.index = index;

            verseEl.addEventListener('input', function () {
                this.style.height = 'auto';
                this.style.height = (this.scrollHeight + 2) + 'px';
                VerseEditor.syncLyricsFromVerses();
            });

            verseEl.addEventListener('keydown', (e) => VerseEditor.handleVerseKeydown(e, index, verseEl));
            verseEl.addEventListener('focus', () => verseWrapper.classList.add('verse-focused'));
            verseEl.addEventListener('blur', () => verseWrapper.classList.remove('verse-focused'));

            verseWrapper.appendChild(num);
            verseWrapper.appendChild(verseEl);
            container.appendChild(verseWrapper);

            // Auto-resize
            verseEl.style.height = 'auto';
            verseEl.style.height = (verseEl.scrollHeight + 2) + 'px';
        });

        container.scrollTop = prevScroll;
    },

    syncLyricsFromVerses() {
        const container = document.getElementById('verses-container');
        const textareas = container.querySelectorAll('textarea');
        const verses = Array.from(textareas).map(el => el.value.trim()).filter(v => v !== '');
        document.getElementById('edit-lyrics').value = verses.join('\n\n');
    },

    handleVerseKeydown(e, index, element) {
        // ENTER: Split
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const cursor = element.selectionStart;
            const text = element.value;
            const firstPart = text.substring(0, cursor).trim();
            const secondPart = text.substring(cursor).trim();

            element.value = firstPart;
            VerseEditor.syncLyricsFromVerses();

            // Insert new Part
            const fullText = document.getElementById('edit-lyrics').value;
            // Re-read current state from DOM is safer in our sync function
            const container = document.getElementById('verses-container');
            const textareas = Array.from(container.querySelectorAll('textarea'));
            const currentVerses = textareas.map(t => t.value);

            currentVerses.splice(index + 1, 0, secondPart);
            document.getElementById('edit-lyrics').value = currentVerses.join('\n\n');
            VerseEditor.renderVerses();

            setTimeout(() => {
                const newInputs = document.getElementById('verses-container').querySelectorAll('textarea');
                if (newInputs[index + 1]) {
                    newInputs[index + 1].focus();
                    newInputs[index + 1].setSelectionRange(0, 0);
                }
            }, 0);
        }

        // BACKSPACE: Merge
        if (e.key === 'Backspace' && element.selectionStart === 0 && element.selectionEnd === 0 && index > 0) {
            e.preventDefault();
            const currentText = element.value;
            VerseEditor.syncLyricsFromVerses();

            const container = document.getElementById('verses-container');
            const textareas = Array.from(container.querySelectorAll('textarea'));
            const allVerses = textareas.map(t => t.value);

            const prevText = allVerses[index - 1];
            const newPrevText = (prevText + ' ' + currentText).trim();

            allVerses[index - 1] = newPrevText;
            allVerses.splice(index, 1); // remove current

            document.getElementById('edit-lyrics').value = allVerses.join('\n\n');
            VerseEditor.renderVerses();

            setTimeout(() => {
                const newInputs = document.getElementById('verses-container').querySelectorAll('textarea');
                if (newInputs[index - 1]) {
                    newInputs[index - 1].focus();
                    const len = prevText.length + (prevText ? 1 : 0);
                    newInputs[index - 1].setSelectionRange(len, len);
                }
            }, 0);
        }
    }
};
