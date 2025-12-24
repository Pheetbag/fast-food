import type { Component } from "../component";
import { applyUpdates, f } from "../../libs/flexbones";
import { loadTextures } from "./textures";
import { loadRenderables } from "./renderables";

export const starsBarComponent: Component = {
    setup() {
        applyUpdates(
            f(null, [
                f("div"),
                f("div"),
                f("div"),
                f("div"),
                f("div"),
                f("div"),
            ]),
            ".ff-gamePrint-stars",
        );
    },
    loadRenderables,
    loadTextures,
};
