import { createRenderable } from "../libs/render-x";
import { applyUpdates, f } from "../libs/flexbones";

// TODO: a renderable without a matching component? keep that in mind if renderables will be integrated
//       to the component itself.
export function loadRenderablesMoney(): void {
    createRenderable(
        "money",
        () => game.state.player.money,
        ({ newState }) => {
            const color = newState < 0 ? "#D83930" : "#fff";
            applyUpdates(
                f(null, { style: { color } }, `${newState}`),
                ".ff-gamePrint-money > :first-child",
            );
        },
    );
}
