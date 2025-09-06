var assets = new Assets();

function Assets() {
    this.uID = 0;
    this.setuID = function () {
        return this.uID++;
    };
    /**
     * @type any
     */
    this.object = function (itemSet, textureMap = [], clientSet = []) {
        this.itemSet = itemSet;
        this.textureMap = textureMap;
        this.clientSet = clientSet;
    };

    /**
     * @type any
     */
    this.item = function (extID) {
        this.uID = assets.setuID();
        this.extID = extID;

        this.name = "unnamed";
        this.desc = "";
        this.cost = 0;
        this.price = 0;

        this.type = "food";
        this.texture = extID;
        this.ico;

        this.consumable = false;
    };
    /**
     * @type any
     */
    this.textureMap = function () {
        this.item = [];
        this.client = [];
    };

    this.set = function (asset) {
        game.assets.push(asset);
    };
}

function Objects() {
    //miscelaneous
    this.pause = document.getElementById("ff-gameComponentPause");
    this.start = document.getElementById("ff-startButton");

    //prints
    this.hearts = [
        document.getElementById("ff-gamePrint-heart1"),
        document.getElementById("ff-gamePrint-heart2"),
        document.getElementById("ff-gamePrint-heart3"),
        document.getElementById("ff-gamePrint-heart4"),
        document.getElementById("ff-gamePrint-heart5"),
        document.getElementById("ff-gamePrint-heart6"),
    ];
    this.stars = [
        document.getElementById("ff-gamePrint-star1"),
        document.getElementById("ff-gamePrint-star2"),
        document.getElementById("ff-gamePrint-star3"),
        document.getElementById("ff-gamePrint-star4"),
        document.getElementById("ff-gamePrint-star5"),
        document.getElementById("ff-gamePrint-star6"),
    ];
    this.name = document.getElementById("ff-gamePrint-Name");
    this.money = document.getElementById("ff-gamePrint-Cash");
}

function Component() {
    //food
    this.food = {
        default: [],
    };
}
