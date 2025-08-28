var config = {
    //--- DEFAULTS ---

    //Id of the asset that will be use as default into rendering everything.
    defaultAsset: 0,

    //--- CLIENT ---
    //TODO Default values of this data have to be defined, but it changes with the game level, anyway i have to define is that change is going to be made in this config values or using those values as a constant and apply some maths into it.

    //Time between one generation and another
    clientMinTimeSpacing: 3000,

    //min quantity of client that are able to be generated
    clientMinQuantity: null,

    //max quantity of client that are able to be generated
    clientMaxQuantity: 4,

    //Min quantity of patience a client can have
    clientMinPatience: 0,

    //Max quantity of patience a client can have
    clientMaxPatience: 100,

    //It true after the clientMinTimeSpacing have a random change of generating
    clientRandom: true,

    //Random chance of generating the client
    clientRandomChance: 100,

    //Min quantity of wishes a client can have
    clientMinWishQuantity: null,

    //Max quantity of wishes a client can have
    clientMaxWishQuantity: null,

    clientBonusWish: false,

    //--- PLAYER ---
    //TODO READ THE TRELLO ABOUT THIS. client configs

    //Max hearts quantity of the player
    playerMaxHearts: 6,

    //Max stars quantity of the player
    playerMaxStars: 6,
};
