//global object "client". control all client actions.

import { config } from "../master.config";
import { textures } from "./textures";
import { ClientTexturesEnum } from "../components/client";
import { randomNumber } from "../utils/randomNumber";
import { getUniqueId } from "../utils/getUniqueId";

export class ClientController {
    quantity: number = 0;
    // the accumulated delta since the last time a client was generated
    deltaSinceLastGenerationAttempt: number = 0;
    list: Client[] = [];

    new() {
        const client = new Client();
        this.list.push(client);

        this.quantity++;
        console.log(
            "New client generated. at delta: " +
                this.deltaSinceLastGenerationAttempt,
        );
        this.deltaSinceLastGenerationAttempt = 0;

        return client;
    }

    evaluate(delta: number): boolean {
        if (this.quantity >= config.clientMaxQuantity) {
            return false;
        }

        this.deltaSinceLastGenerationAttempt += delta;

        if (
            this.deltaSinceLastGenerationAttempt < config.clientMinTimeSpacing
        ) {
            return false;
        }

        if (
            config.clientRandom == true &&
            randomNumber(1, 100) > config.clientRandomChance
        ) {
            console.log("failed random chance");
            this.deltaSinceLastGenerationAttempt = 0;
            return false;
        }

        return true;
    }
}

export class Client {
    id: string;
    level: number;
    state: string;
    face: string;
    patience: number;
    wish: ClientWish;

    constructor() {
        this.id = getUniqueId();
        this.level = game.level;
        this.state = "waiting";

        const clientTexturesKeys = Object.values(ClientTexturesEnum);
        const randomTextureIndex = randomNumber(
            0,
            clientTexturesKeys.length - 1,
        );
        const randomTextureKey = clientTexturesKeys[randomTextureIndex];
        const randomTexture = textures.get(randomTextureKey);

        if (!randomTexture) {
            throw new Error(
                `Couldn't find texture path. Invalid random texture: ${randomTextureIndex} -> ${randomTextureKey}`,
            );
        }

        this.face = randomTexture;

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
