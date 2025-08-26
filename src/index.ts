// this file should start to slowly take responsibility out of the app.js and start being the
// current entrypoint for the codebase.

import { clientsEngine } from "./engines/client";
import { gameLoop } from "./engines/game-loop";

/**
 * FIXME: This is code from the early migration of the engines to the new codebase
 * so I'm keeping structure mostly in line with how it was before. At some point this could
 * should be refactored and moved.
 */
globalThis.client = clientsEngine;

// END OF ENGINES MIGRATION

//initialize default assets
assets.set(ff.defaultAsset);

//------- WE SET ITEMS IN INVENTORY
for (let i = 0; i < 20; i++) {
    scene.set("menu", game.assets[0].itemSet[i]);
}

//setup all the scene, including reactions, and objects
scene.setup();

const fpsElement: HTMLElement =
    paint.getContext("ff-gamePrint-fps")[0]?.children[0];

gameLoop.addDrawStep(() => {
    if (fpsElement) {
        fpsElement.innerHTML = `${Math.round(gameLoop.fps)} fps`;
    }
});

gameLoop.addDrawStep(() => {
    //We update the print renders.
    if (render.print.checkMemory("hearts", game.state.player.hearts) == false) {
        render.print.hearts(game.state.player.hearts);
    }
    if (render.print.checkMemory("stars", game.state.player.stars) == false) {
        render.print.stars(game.state.player.stars);
    }
    if (render.print.checkMemory("money", game.state.player.money) == false) {
        render.print.money(game.state.player.money);
    }
    if (render.print.checkMemory("name", game.state.player.name) == false) {
        render.print.name(game.state.player.name);
    }

    //We update the scene renders.
    if (render.scene.checkMemory("menu", game.state.scene.menu) == false) {
        render.scene.menu(game.state.scene.menu);
    }
    if (render.scene.checkMemory("hand", game.state.player.hand) == false) {
        render.scene.hand(game.state.player.hand);
    }
});

gameLoop.addUpdateStep((delta) => {
    if (clientsEngine.evaluate(delta)) {
        clientsEngine.new();
    }
});

gameLoop.start();
