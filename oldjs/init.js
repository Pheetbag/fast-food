//this define the gameLevel you have
var gameLevel = 0;
var currentGameCicle = 0;
var gameCicle_controller;

//it control the state of the printObjects in anytime,like, how many heart we have, or stars, andthe rest ofthesystem takes cares of rendering this numbers into the game

var printState_heart = 6;
var printState_star = 0;
var printState_name = "unknown";
var printState_cash = 0;

//this is the start game btn
var startButton = document.getElementById("ff-startButton");

//this is a general use function for random number generation with selected number range.
function ramdomNumber(a, b) {
    return Math.round(Math.random() * (b - a) + parseInt(a));
}
//it makes the preload of all game objects, before giving access to the game. At the end of the verification it enable the Start button, activating the click listener.

function preloader(gameElements) {
    var percentage;
    var elementQuantity = gameElements.length;
    var percentagePerImage = 100 / elementQuantity;
    var preloaderBox = document.getElementById("preloaderEngine");
    var elementTrack = 0;

    function imagePreloaded() {
        if ((elementTrack + 1) * percentagePerImage <= 100) {
            startButton.innerHTML =
                Math.trunc((elementTrack + 1) * percentagePerImage) + "%";
        } else {
            startButton.innerHTML = "100%";
        }

        if (elementTrack < elementQuantity - 1) {
            elementTrack++;
            preloadNextImage();
        } else {
            activeButton();
        }
    }

    function preloadNextImage() {
        preloaderBox.setAttribute(
            "src",
            "assets/" + preloadElement[elementTrack] + ".png",
        );

        preloaderBox.addEventListener("load", imagePreloaded);
    }

    preloadNextImage();
}

function activeButton() {
    //set the eventListener
    startButton.addEventListener("click", startGame);

    //get the button in Start mode
    startButton.classList.remove("btn-gray");
    startButton.classList.add("btn-green");

    //change the text to 'jugar'

    startButton.innerHTML = "Jugar";
}

var preloadElement = [
    "client_ico/client1",
    "client_ico/client2",
    "client_ico/client3",
    "client_ico/client4",
    "client_ico/client5",
    "client_ico/client6",
    "client_ico/client7",
    "client_ico/client8",
    "client_ico/client9",
    "client_ico/client10",
    "client_ico/client11",
    "client_ico/client12",
    "client_ico/client13",
    "client_ico/client14",
    "client_ico/client15",
    "client_ico/client16",
    "client_ico/client17",
    "client_ico/client18",
    "client_ico/client19",
    "client_ico/client20",
    "client_ico/client21",
    "client_ico/client22",
    "client_ico/client23",
    "client_ico/client24",
    "client_ico/client25",
    "client_ico/client26",
    "client_ico/client27",
    "food_ico/food1",
    "food_ico/food2",
    "food_ico/food3",
    "food_ico/food4",
    "food_ico/food5",
    "food_ico/food6",
    "food_ico/food7",
    "food_ico/food8",
    "food_ico/food9",
    "food_ico/food10",
    "food_ico/food11",
    "food_ico/food12",
    "food_ico/food13",
    "food_ico/food14",
    "food_ico/food15",
    "food_ico/food16",
    "food_ico/sauce1",
    "food_ico/sauce2",
    "food_ico/sauce3",
    "food_ico/sauce4",
    "food_ico/sauce-min1",
    "food_ico/sauce-min2",
    "food_ico/sauce-min3",
    "food_ico/sauce-min4",
    "gameGeneral_ico/coin",
    "gameGeneral_ico/heart_active",
    "gameGeneral_ico/heart_active_On",
    "gameGeneral_ico/heart_dead",
    "gameGeneral_ico/heart_dead_On",
    "gameGeneral_ico/heart_extra",
    "gameGeneral_ico/heart_extra_On",
    "gameGeneral_ico/heart_On",
    "gameGeneral_ico/starWhite",
    "gameGeneral_ico/starWhite_Rainbow0",
    "gameGeneral_ico/starWhite_Rainbow1",
    "gameGeneral_ico/starWhite_Rainbow2",
    "gameGeneral_ico/starWhite_Rainbow3",
    "gameGeneral_ico/starWhite_Rainbow4",
    "gameGeneral_ico/starWhite_Rainbow5",
    "gameGeneral_ico/starWhite_Rainbow6",
    "gameGeneral_ico/starWhite_Rainbow7",
    "gameGeneral_ico/starWhite_Rainbow8",
    "gameGeneral_ico/starWhite_Rainbow9",
    "gameGeneral_ico/starWhite_Rainbow10",
    "gameGeneral_ico/starWhite_Rainbow11",
    "gameGeneral_ico/star0",
    "gameGeneral_ico/star0_border",
    "gameGeneral_ico/star1",
    "gameGeneral_ico/star1_border",
    "gameGeneral_ico/star1_Rainbow4",
    "gameGeneral_ico/star1_Rainbow3",
    "gameGeneral_ico/star1_Rainbow2",
    "gameGeneral_ico/star1_Rainbow1",
    "gameGeneral_ico/star1_Rainbow0",
    "gameGeneral_ico/star2",
    "gameGeneral_ico/star2_border",
    "gameGeneral_ico/star2_Rainbow4",
    "gameGeneral_ico/star2_Rainbow3",
    "gameGeneral_ico/star2_Rainbow2",
    "gameGeneral_ico/star2_Rainbow1",
    "gameGeneral_ico/star2_Rainbow0",
    "gameGeneral_ico/star3",
    "gameGeneral_ico/star3_border",
    "gameGeneral_ico/star3_Rainbow4",
    "gameGeneral_ico/star3_Rainbow3",
    "gameGeneral_ico/star3_Rainbow2",
    "gameGeneral_ico/star3_Rainbow1",
    "gameGeneral_ico/star3_Rainbow0",
    "gameGeneral_ico/star4",
    "gameGeneral_ico/star4_border",
    "gameGeneral_ico/star4_Rainbow4",
    "gameGeneral_ico/star4_Rainbow3",
    "gameGeneral_ico/star4_Rainbow2",
    "gameGeneral_ico/star4_Rainbow1",
    "gameGeneral_ico/star4_Rainbow0",
    "gameGeneral_ico/star5",
    "gameGeneral_ico/star5_border",
    "gameGeneral_ico/star5_Rainbow0",
    "gameGeneral_ico/star5_Rainbow1",
    "gameGeneral_ico/star5_Rainbow2",
    "gameGeneral_ico/star5_Rainbow3",
    "gameGeneral_ico/star5_Rainbow4",
    "gameGeneral_ico/trashCan",
    "gameGeneral_ico/trashCan-active",
];

//set game components variables into gameComponents arrays.

var gameComponentsFood = [
    document.getElementById("ff-componentFood-1"),
    document.getElementById("ff-componentFood-2"),
    document.getElementById("ff-componentFood-3"),
    document.getElementById("ff-componentFood-4"),
    document.getElementById("ff-componentFood-5"),
    document.getElementById("ff-componentFood-6"),
    document.getElementById("ff-componentFood-7"),
    document.getElementById("ff-componentFood-8"),
    document.getElementById("ff-componentFood-9"),
    document.getElementById("ff-componentFood-10"),
    document.getElementById("ff-componentFood-11"),
    document.getElementById("ff-componentFood-12"),
    document.getElementById("ff-componentFood-13"),
    document.getElementById("ff-componentFood-14"),
    document.getElementById("ff-componentFood-15"),
    document.getElementById("ff-componentFood-16"),
];

var gameComponentsSauce = [
    document.getElementById("ff-componentSauce-1"),
    document.getElementById("ff-componentSauce-2"),
    document.getElementById("ff-componentSauce-3"),
    document.getElementById("ff-componentSauce-4"),
];

var gameComponentsUtility = [
    document.getElementById("ff-gameUtility-Trash"),
    document.getElementById("ff-gameUtility-SafeA"),
    document.getElementById("ff-gameUtility-SafeB"),
];

var gameComponentsClient = [
    document.getElementById("ff-gameClient-A"),
    document.getElementById("ff-gameClient-B"),
    document.getElementById("ff-gameClient-C"),
    document.getElementById("ff-gameClient-D"),
];

var gameComponentsClientNodes = [
    [
        document.getElementById("ff-componentWish-A1"),
        document.getElementById("ff-componentWish-A2"),
        document.getElementById("ff-componentWish-A3"),
        document.getElementById("ff-componentWish-A4"),
        document.getElementById("ff-componentSauceA5"),
        document.getElementById("ff-componentClient-A"),
        document.getElementById("ff-componentPatience-A"),
        document.getElementById("ff-componentPatience-A1"),
    ],
    [
        document.getElementById("ff-componentWish-B1"),
        document.getElementById("ff-componentWish-B2"),
        document.getElementById("ff-componentWish-B3"),
        document.getElementById("ff-componentWish-B4"),
        document.getElementById("ff-componentSauceB5"),
        document.getElementById("ff-componentClient-B"),
        document.getElementById("ff-componentPatience-B"),
        document.getElementById("ff-componentPatience-B1"),
    ],
    [
        document.getElementById("ff-componentWish-C1"),
        document.getElementById("ff-componentWish-C2"),
        document.getElementById("ff-componentWish-C3"),
        document.getElementById("ff-componentWish-C4"),
        document.getElementById("ff-componentSauceC5"),
        document.getElementById("ff-componentClient-C"),
        document.getElementById("ff-componentPatience-C"),
        document.getElementById("ff-componentPatience-C1"),
    ],
    [
        document.getElementById("ff-componentWish-D1"),
        document.getElementById("ff-componentWish-D2"),
        document.getElementById("ff-componentWish-D3"),
        document.getElementById("ff-componentWish-D4"),
        document.getElementById("ff-componentSauceD5"),
        document.getElementById("ff-componentClient-D"),
        document.getElementById("ff-componentPatience-D"),
        document.getElementById("ff-componentPatience-D1"),
    ],
];

var gameComponentsWish = gameComponentsFood;

//Esta es la estructura para cuando agregue la maquina de bebidas
//var gameComponentsWish = gameComponentsFood.concat(gameComponentsSauce);

var gameComponentsHeart = [
    document.getElementById("ff-gamePrint-heart1"),
    document.getElementById("ff-gamePrint-heart2"),
    document.getElementById("ff-gamePrint-heart3"),
    document.getElementById("ff-gamePrint-heart4"),
    document.getElementById("ff-gamePrint-heart5"),
    document.getElementById("ff-gamePrint-heart6"),
];

var gameComponentsStar = [
    document.getElementById("ff-gamePrint-star1"),
    document.getElementById("ff-gamePrint-star2"),
    document.getElementById("ff-gamePrint-star3"),
    document.getElementById("ff-gamePrint-star4"),
    document.getElementById("ff-gamePrint-star5"),
    document.getElementById("ff-gamePrint-star6"),
];

var gameComponentsName = document.getElementById("ff-gamePrint-Name");

var gameComponentsCash = document.getElementById("ff-gamePrint-Cash");

var gameComponentsPause = document.getElementById("ff-gameComponentPause");

//GameObjects se diferencian de los gameComponents en que son datos de recurso para el juego, más no elementos o componentes directos representados.
var gameObjectsClient = [
    "assets/client_ico/client1.png",
    "assets/client_ico/client2.png",
    "assets/client_ico/client3.png",
    "assets/client_ico/client4.png",
    "assets/client_ico/client5.png",
    "assets/client_ico/client6.png",
    "assets/client_ico/client7.png",
    "assets/client_ico/client8.png",
    "assets/client_ico/client9.png",
    "assets/client_ico/client10.png",
    "assets/client_ico/client11.png",
    "assets/client_ico/client12.png",
    "assets/client_ico/client13.png",
    "assets/client_ico/client14.png",
    "assets/client_ico/client15.png",
    "assets/client_ico/client16.png",
    "assets/client_ico/client17.png",
    "assets/client_ico/client18.png",
    "assets/client_ico/client19.png",
    "assets/client_ico/client20.png",
    "assets/client_ico/client21.png",
    "assets/client_ico/client22.png",
    "assets/client_ico/client23.png",
    "assets/client_ico/client24.png",
    "assets/client_ico/client25.png",
    "assets/client_ico/client26.png",
    "assets/client_ico/client27.png",
];

//after all init process are done, it start the preload, and the game access.
preloader(preloadElement);
