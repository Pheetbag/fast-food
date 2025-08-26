// this file should start to slowly take responsibility out of the app.js and start being the
// current entrypoint for the codebase.

import { clientsEngine } from "./engines/client";
import { cicleEngine } from "./engines/cicle";

/**
 * FIXME: This is code from the early migration of the engines to the new codebase
 * so I'm keeping structure mostly in line with how it was before. At some point this could
 * should be refactored and moved.
 */
globalThis.cicle = cicleEngine;
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

//turn on the cicle engine after everything is defined on the code
cicleEngine.action("set");
