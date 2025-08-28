// this file should start to slowly take responsibility out of the app.js and start being the
// current entrypoint for the codebase.

import { clientsEngine } from "./engines/client";
import { gameLoop } from "./engines/game-loop";
import { renderAll, createRenderable } from "./engines/render-x";
import { applyUpdates } from "./libs/flexbones";

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

createRenderable(
    "player_name",
    () => game.state.player.name as string,
    (newState) => {
        // FIXME: we should move the contexts out of here, to save on performance
        const context = paint.getContext("ff-gamePrint-name");
        for (let i = 0; i < context.length; i++) {
            context[i].innerHTML = newState;
        }
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
                { style: { visibility: "visible" } },
                `#ff-tableClient-${i + 1}`,
            );
            applyUpdates(
                { style: { backgroundImage: client.face } },
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
    if (render.print.checkMemory("hearts", game.state.player.hearts) == false) {
        render.print.hearts(game.state.player.hearts);
    }
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

const gameState = {
    name: "hello",
    lastname: "world",
    child: {
        name: "lorem",
        lastname: "ipsum",
    },

    friends: [
        { name: "friend1", age: 10 },
        { name: "friend2", age: 20 },
        { name: "friend3", age: 30 },
    ],
};

const handler: ProxyHandler<typeof gameState> = {
    set(...args): boolean {
        console.log(args);
        return Reflect.set(...args);
    },
};

globalThis.gameState = new Proxy(gameState, handler);
