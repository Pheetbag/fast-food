import type { addTexture } from "../engines/textures";

export type Component = {
    loadTextures: (addTexture: addTexture) => void;
};
