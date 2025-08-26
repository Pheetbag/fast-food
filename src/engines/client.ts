//global object "client". control all client actions.

import { randomNumber } from "../tools";

export class ClientController {
    quantity: number = 0;
    //totalQuantity: number;
    lastGeneration: number = 0;
    list: (Client | null)[] = [null, null, null, null];

    new() {
        //create a new client after making the evaluation, this is activated by the game cicle.

        this.list[this.quantity] = new Client();
        this.quantity++;
        this.lastGeneration = cicle.current;
        console.log(this.list[this.quantity - 1]);
    }

    evaluate(): boolean {
        if (this.quantity >= config.clientMaxQuantity) {
            return false;
        }

        if (cicle.current - this.lastGeneration < config.clientTimeSpacing) {
            return false;
        }
        if (
            randomNumber(0, 100) > config.clientRandomChance &&
            config.clientRandom == true
        ) {
            this.lastGeneration = cicle.current;
            return false;
        }

        return true;
    }
}

export class Client {
    id: number;
    level: number;
    state: string;
    face: unknown;
    patience: number;
    wish: ClientWish;

    constructor() {
        this.id = randomNumber(0, 26);
        this.level = game.level;
        this.state = "waiting";

        this.face = game.assets[config.defaultAsset].textureMap.client[this.id];
        this.patience = randomNumber(
            config.clientMinPatience,
            config.clientMaxPatience,
        );

        this.wish = new ClientWish();
    }

    generate() {}
}

class ClientWish {
    list = [];
    state = [];

    generate() {}
}

export const clientsEngine = new ClientController();
