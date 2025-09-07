// this file should start to slowly take responsibility out of the app.js and start being the
// current entrypoint for the codebase.

import { clientsEngine } from "./engines/client";
import { gameLoop } from "./engines/game-loop";
import { renderAll, createRenderable } from "./libs/render-x";
import { applyUpdates, f } from "./libs/flexbones";
import { config } from "./master.config";
import { addTexture } from "./engines/textures";
import { clientComponent } from "./components/client";
import { healthBarComponent } from "./components/health-bar";
import { loadRenderablesHealthBar } from "./renderables/health-bar";
import { starsBarComponent } from "./components/stars-bar";
import { loadRenderablesStarsBar } from "./renderables/stars-bar";
import { menuComponent } from "./components/menu";
import { loadRenderablesMenu } from "./renderables/menu";
import { loadRenderablesMoney } from "./renderables/money";
import { leadRenderablesHand } from "./renderables/hand";

/**
 * FIXME: This is code from the early migration of the engines to the new codebase
 * so I'm keeping structure mostly in line with how it was before. At some point this could
 * should be refactored and moved.
 */
globalThis.client = clientsEngine;
globalThis.config = config;

// END OF ENGINES MIGRATION

//initialize default assets
assets.set(ff.defaultAsset);

// initialize components textures
// FIXME: create a proper components loader and move this there.
clientComponent.loadTextures(addTexture);
healthBarComponent.loadTextures(addTexture);
starsBarComponent.loadTextures(addTexture);
menuComponent.loadTextures(addTexture);

//------- WE SET ITEMS IN INVENTORY
for (let i = 0; i < 20; i++) {
    scene.set("menu", game.assets[0].itemSet[i]);
}

//setup all the scene, including reactions, and objects
scene.setup();

// FIXME: MOVE ME TO A BETTER PLACE
loadRenderablesHealthBar();
loadRenderablesStarsBar();
loadRenderablesMenu();
loadRenderablesMoney();
leadRenderablesHand();

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

gameLoop.addDrawStep(() => {
    applyUpdates(
        f(null, `${Math.round(gameLoop.fps)} fps`),
        ".ff-gamePrint-fps > :nth-child(1)",
    );
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
