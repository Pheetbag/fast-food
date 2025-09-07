// TODO: a renderable without a matching component? keep that in mind if renderables will be integrated
//       to the component itself.
//       This particular case might be worth it's own component?
import { createRenderable } from "../libs/render-x";
import { applyUpdates, f, type XElement } from "../libs/flexbones";
import { textures } from "../engines/textures";

export function leadRenderablesHand(): void {
    createRenderable(
        "hand",
        () => game.state.player.hand.map((rx: { id: number }) => rx.id),
        () => {
            const newState = game.state.player.hand;

            const handItems: XElement[] = [];

            for (const item of newState) {
                const texture = scene.menu[item.context.dataset.id].ico;
                const backgroundImage = `url(${textures.get(texture)})`;

                handItems.push(f("div", { style: { backgroundImage } }));
            }

            applyUpdates(f(null, handItems), ".ff-gameMenu-hand");
        },
    );
}
