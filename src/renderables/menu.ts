import { createRenderable } from "../libs/render-x";
import { applyUpdates, f } from "../libs/flexbones";
import { textures } from "../engines/textures";

export function loadRenderablesMenu(): void {
    createRenderable("menu", game.state.scene.menu, ({ newState }) => {
        console.log(newState);
        // we get the all references in one go, for performance
        const menuSlots = document.querySelectorAll(".ff-gameMenu-slot");

        for (let i = 0; i < newState.length; i++) {
            const menuItem = newState[i];
            const menuItemSlot = menuSlots[i];
            const menuItemTexture = `url(${textures.get(menuItem.ico)})`;

            if (!menuItemSlot) {
                throw new Error(
                    `No menu slot found for index ${i}. Current amount of available slots is: ${menuSlots.length}`,
                );
            }

            applyUpdates(
                f(
                    null,
                    {
                        "data-id": i,
                        "data-uID": menuItem.uID,
                        "data-name": menuItem.name,
                        "data-desc": menuItem.desc,
                        "data-cost": menuItem.cost,
                        "data-price": menuItem.price,
                    },
                    f("div", { style: { backgroundImage: menuItemTexture } }),
                ),
                menuItemSlot,
            );
        }
    });
}
