// this file should start to slowly take responsibility out of the app.js and start being the
// current entrypoint for the codebase.

import { clientsEngine } from "./engines/client";
import { gameLoop } from "./engines/game-loop";
import { renderAll, createRenderable } from "./libs/render-x";
import { applyUpdates, f } from "./libs/flexbones";
import { config } from "./master.config";
import { addTexture, textures } from "./engines/textures";
import { clientComponent } from "./components/client";
import { healthBarComponent } from "./components/health-bar";
import { loadRenderablesHealthBar } from "./renderables/health-bar";

/**
 * FIXME: This is code from the early migration of the engines to the new codebase
 * so I'm keeping structure mostly in line with how it was before. At some point this could
 * should be refactored and moved.
 */
globalThis.client = clientsEngine;
globalThis.config = config;
globalThis.textures = textures;

// END OF ENGINES MIGRATION

//initialize default assets
assets.set(ff.defaultAsset);

// initialize components textures
// FIXME: create a proper components loader and move this there.
clientComponent.loadTextures(addTexture);
healthBarComponent.loadTextures(addTexture);

//------- WE SET ITEMS IN INVENTORY
for (let i = 0; i < 20; i++) {
    scene.set("menu", game.assets[0].itemSet[i]);
}

//setup all the scene, including reactions, and objects
scene.setup();

// FIXME: MOVE ME TO A BETTER PLACE
loadRenderablesHealthBar();

createRenderable(
    "player_name",
    () => game.state.player.name as string,
    ({ newState }) => {
        // TODO:  should use direct access to low level flexbones or render should have an API?
        applyUpdates(f(null, newState), "#ff-gamePrint-name");
    },
);

// FIXME: is it a bad practice that we are not consuming the newState and oldState params?
createRenderable(
    "clients_waiting",
    () => clientsEngine.list.map((client) => client.id),
    () => {
        // TODO: clear out the existing contexts

        for (let i = 0; i < clientsEngine.list.length; i++) {
            const client = clientsEngine.list[i];

            if (!client) {
                continue;
            }
            applyUpdates(
                f(null, { style: { visibility: "visible" } }),
                `#ff-tableClient-${i + 1}`,
            );
            applyUpdates(
                f(null, { style: { backgroundImage: `url(${client.face})` } }),
                `#ff-tableClient-${i + 1}-face`,
            );
        }
    },
);

const fpsElement: HTMLElement =
    paint.getContext("ff-gamePrint-fps")[0]?.children[0];

gameLoop.addDrawStep(() => {
    if (fpsElement) {
        fpsElement.innerHTML = `${Math.round(gameLoop.fps)} fps`;
    }
});

gameLoop.addDrawStep(() => {
    //We update the print renders.
    if (render.print.checkMemory("stars", game.state.player.stars) == false) {
        render.print.stars(game.state.player.stars);
    }
    if (render.print.checkMemory("money", game.state.player.money) == false) {
        render.print.money(game.state.player.money);
    }

    //We update the scene renders.
    if (render.scene.checkMemory("menu", game.state.scene.menu) == false) {
        render.scene.menu(game.state.scene.menu);
    }
    if (render.scene.checkMemory("hand", game.state.player.hand) == false) {
        render.scene.hand(game.state.player.hand);
    }
});

gameLoop.addDrawStep(() => {
    renderAll();
});

gameLoop.addUpdateStep((delta) => {
    if (clientsEngine.evaluate(delta)) {
        clientsEngine.new();
    }
});

gameLoop.start();
