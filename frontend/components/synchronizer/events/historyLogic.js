export const history = {
    stack: [],
    future: [],
    maxDepth: 50,

    push(snapshot) {
        // Drop future if we fork
        this.future = [];
        this.stack.push(JSON.stringify(snapshot));
        if (this.stack.length > this.maxDepth) {
            this.stack.shift();
        }
    },

    undo(currentState) {
        if (this.stack.length === 0) return null;

        const currentSnap = JSON.stringify(currentState);
        this.future.push(currentSnap);

        const prevSnap = this.stack.pop();
        return JSON.parse(prevSnap);
    },

    redo(currentState) {
        if (this.future.length === 0) return null;

        const currentSnap = JSON.stringify(currentState);
        this.stack.push(currentSnap);

        const nextSnap = this.future.pop();
        return JSON.parse(nextSnap);
    }
};
