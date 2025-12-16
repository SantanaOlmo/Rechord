export const history = {
    stack: [],
    future: [],
    maxDepth: 50,

    push(data, type) {
        // Drop future if we fork
        this.future = [];
        this.stack.push(JSON.stringify({ type, data }));
        if (this.stack.length > this.maxDepth) {
            this.stack.shift();
        }
    },

    // We don't need currentState arg for undo if we trust the stack,
    // BUT we need to save the *current* state of the *target* into future before overwriting.
    // So we need to know what we are undoing *to*.
    // But the stack tells us what we are going back TO.
    // The *current* state (which becomes future) depends on what we are about to replace.
    // So we peek the stack, see the type, retrieve current data of that type, push to future, then pop stack.

    // Revised signature: undo(currentDataMap) where map provides accessors?
    // Or easier: generic Undo just returns the *prev* snapshot. 
    // The CALLER (keyboardEvents) is responsible for:
    // 1. Calling undo().
    // 2. Getting { type, data } back.
    // 3. Capturing *current* state of that `type`.
    // 4. Calling `history.saveFuture(currentState, type)`.
    // 5. Applying the undo data.

    // Actually, `undo(currentState)` in original code handled pushing to future.
    // Now we can't accept a single `currentState` because we don't know which one it is until we peek.
    // So `undo` should take a callback or object to fetch current state?
    // `undo(getState(type))`? 

    // Let's keep it simple:
    // `undo()` returns the item from stack.
    // It does NOT handle pushing to future (caller must do it, or we add a separate method).
    // Or `undo` takes NO args, returns the "Prev State". 
    // And we have `pushFuture(data, type)`? 

    // Wait, standard Undo/Redo logic:
    // Undo():
    // 1. Pop 'prev' from Stack.
    // 2. Get 'current' state (matching prev.type).
    // 3. Push 'current' to Future.
    // 4. Return 'prev'.

    // So `undo` needs access to global state or a getter.
    // `history.undo(getter)` where getter(type) returns current data.

    undo(getter) {
        if (this.stack.length === 0) return null;

        const prevJson = this.stack.pop();
        const prev = JSON.parse(prevJson);
        const { type } = prev;

        const currentData = getter(type);
        if (currentData) {
            this.future.push(JSON.stringify({ type, data: currentData }));
        }

        return prev;
    },

    redo(getter) {
        if (this.future.length === 0) return null;

        const nextJson = this.future.pop();
        const next = JSON.parse(nextJson);
        const { type } = next;

        const currentData = getter(type);
        if (currentData) {
            this.stack.push(JSON.stringify({ type, data: currentData }));
        }

        return next;
    }
};
