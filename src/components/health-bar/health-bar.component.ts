import type { Component } from "../component";
import { loadRenderables } from "./renderables";
import { loadTextures } from "./textures";
import { applyUpdates, f } from "../../libs/flexbones";

export const healthBarComponent: Component = {
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
            ".ff-gamePrint-hearts",
        );
    },
    loadTextures,
    loadRenderables,
};
