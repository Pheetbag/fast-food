/**
 * RenderX is intended to serve as the rendering engine to replace the existing one at render.js,
 * in a similar fashion to the updated version of the "game-loop" engine, is not designed to contain
 * the rendering logic for every case in itself, but instead will handle the lifecycle of the
 * rendering to take some of the load from the other parts of the system.
 *
 * although there is a chance for optimization using a reactivity system approach (like Svelte or Vue),
 * in the spirit of keeping it simple, I'm taking an "immediate" rendering approach making a full state check against
 * the renderer memory and then reflect that to the screen.
 *
 * Different to how the previous engine worked, which forced us to hardcode the rendering logic within the
 * renderer, each expected component should be handle as a renderable which contain the rendering logic for such
 * component but also the gameState it reacts to.
 */

// gameState can be provided as a reference or a getter function
type RenderStateGetter<T> = T | (() => T);

type RenderFn<T> = (state: { newState: T; oldState: T }) => void;

type Renderable<T> = {
    name: string;
    stateRef: RenderStateGetter<T>;
    renderedState: T | undefined;
    renderFn: RenderFn<T>;
};

function resolveStateGetter<T>(state: RenderStateGetter<T>): T {
    if (state instanceof Function) {
        return state();
    } else {
        return state;
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderables: Renderable<any>[] = [];

/**
 * @param name The name of the renderable, for debugging purposes.
 * @param state The state to listen to, can be provided as a reference or as a function that returns the state.
 * @param renderFn The function to call to render the component.
 */
function createRenderable<T>(
    name: string,
    state: RenderStateGetter<T>,
    renderFn: RenderFn<T>,
): Renderable<T> {
    const renderable = {
        name,
        stateRef: state,
        renderedState: undefined,
        renderFn,
    };

    renderables.push(renderable);

    return renderable;
}

/**
 * Check if the state has changed compared to the last rendered state.
 * If it has, call the render function and update the rendered state.
 *
 * @param renderable The renderable to check and potentially render.
 * @returns true if the state has changed and the render function was called, false otherwise.
 */
function checkAndRender(renderable: Renderable<unknown>): boolean {
    const currentState = resolveStateGetter(renderable.stateRef);

    // Simple deep comparison, can be optimized later if needed
    if (
        JSON.stringify(currentState) !==
        JSON.stringify(renderable.renderedState)
    ) {
        renderable.renderFn({
            newState: currentState,
            oldState: renderable.renderedState,
        });
        renderable.renderedState = structuredClone(currentState);
        return true;
    }

    return false;
}

/**
 * Render all registered renderables.
 * This function should be called in the draw step of the game loop.
 */
function renderAll() {
    renderables.forEach((renderable) => {
        checkAndRender(renderable);
    });
}

export {
    renderAll,
    createRenderable,
    type Renderable,
    type RenderFn,
    type RenderStateGetter,
};
