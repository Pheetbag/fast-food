/**
 * Configuration for game assets, client, and player settings.
 */
export interface MasterConfig {
    //--- DEFAULTS ---

    /** Id of the asset that will be use as default into rendering everything. */
    defaultAsset: number;

    //--- CLIENT ---
    /**
     * Time between one generation and another
     */
    clientMinTimeSpacing: number;

    /**
     * Min quantity of client that are able to be generated
     */
    clientMinQuantity: number | null;

    /**
     * Max quantity of client that are able to be generated
     */
    clientMaxQuantity: number;

    /**
     * Min quantity of patience a client can have
     */
    clientMinPatience: number;

    /**
     * Max quantity of patience a client can have
     */
    clientMaxPatience: number;

    /**
     * It true after the clientMinTimeSpacing have a random change of generating
     */
    clientRandom: boolean;

    /**
     * Random chance of generating the client
     */
    clientRandomChance: number;

    /**
     * Min quantity of wishes a client can have
     */
    clientMinWishQuantity: number | null;

    /**
     * Max quantity of wishes a client can have
     */
    clientMaxWishQuantity: number | null;

    clientBonusWish: boolean;

    //--- PLAYER ---
    /**
     * Max hearts quantity of the player
     */
    playerMaxHearts: number;

    /**
     * Max stars quantity of the player
     */
    playerMaxStars: number;
}

export const config: MasterConfig = {
    //--- DEFAULTS ---
    defaultAsset: 0,

    //--- CLIENT ---
    clientMinTimeSpacing: 3000,
    clientMinQuantity: null,
    clientMaxQuantity: 4,
    clientMinPatience: 0,
    clientMaxPatience: 100,
    clientRandom: true,
    clientRandomChance: 33,
    clientMinWishQuantity: null,
    clientMaxWishQuantity: null,
    clientBonusWish: false,

    //--- PLAYER ---
    playerMaxHearts: 6,
    playerMaxStars: 6,
};
