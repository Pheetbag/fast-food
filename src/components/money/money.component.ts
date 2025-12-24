import type { Component } from "../component";
import { loadRenderables } from "./renderables";
import { applyUpdates, f } from "../../libs/flexbones";

export const moneyComponent: Component = {
    setup() {
        applyUpdates(f(null, [f("div"), f("div")]), ".ff-gamePrint-money");
    },
    loadRenderables,
};
