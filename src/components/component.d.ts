import type { addTexture } from "../engines/textures";
import { createRenderable } from "../libs/render-x";

/*
 * Components are a proposal for modular way to add features to the game.
 *
 * Initially a component should be a self-containing unit of logic,
 * that includes loading the required textures, all renderables attached
 * to a given state, and the setup of the initial template of the component.
 *
 * Although the component concept here is heavily inspired by frameworks like
 * React, Vue or Svelte, we have multiple differences in approach:
 *
 * - the lack of a v-dom means there are no diffing algorithms, rendering
 *   of state changes happens at will using renderables or animatables, this
 *   also means we don't have to do a full re-render on each state change,
 *   but instead do fine-grained updates to the html base on the state changes.
 *
 * - Setup step is an initial render of the full visual canvas of the component,
 *   given the fact that renderables/animatables only do fine-grained updates,
 *   this step is needed to setup the base html structure of the component, event
 *   listeners etc... This give a base structure that renderables/animatables can
 *   use to layer state changes on top of.
 *
 * - Components don't need to directly represent a visual element, instead they
 *   are a logic unit of the game, and for example can be use exclusively use
 *   to load/overwrite textures as part of a texture pack
 */

export type Component = {
    /**
     * Initial setup of the component, should take care of rendering
     * the base information for the component. Should also setup any
     * underlying logic.
     */
    setup?(): void;
    /**
     * textures can be either loaded using a js callback, or setting a
     * json object with texture keys and textures url values.
     */
    loadTextures?: (addTexture: addTexture) => void; // | Record<string, string>; support for object loading needs to be added later
    /**
     * Load all renderables related to this component. It also save them
     * for later removal if needed.
     * @param createRenderable
     */
    loadRenderables?(createRenderable: createRenderable): void;
};
