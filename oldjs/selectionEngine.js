//This code hold the process for selection doing, the code inside here doesnot have the capability of make gameActions, just some especific renders. this code have a couple of especific variables that will contain the main information recopiled from this engine, to be use in gameActions, and gameComponents.

var selectionInHand = null; //if selection = true, this contain the selection information.
var selectionInHandSafe = false; //helps to make the deselect in case of safes are use
var selectionSelected = null; //This in theory contains the same information as selectionInHand, but it                                          doesnt have to be that way all the time, it's a preventive variable.
var letSelect = true; //This make sure the player can select something (or not)
var inSafeA;
var inSafeB;
var inSafeUseA = false;
var inSafeUseB = false;

//take care of clicks in the main board.

function selectionEngineInit() {
    selectionEngineListeners();
}

function selectionEngineListeners() {
    //food listeners
    for (let i = 0; i < gameComponentsFood.length; i) {
        let currentComponent = gameComponentsFood[i];

        currentComponent.addEventListener("mousedown", function () {
            selectionAction_food(currentComponent);
        });

        i++;
    }

    //utility listeners
    for (let i = 0; i < gameComponentsUtility.length; i) {
        let currentComponent = gameComponentsUtility[i];

        currentComponent.addEventListener("click", function () {
            selectionAction_utility(currentComponent, i);
        });

        i++;
    }

    //sauce listeners
    for (let i = 0; i < gameComponentsSauce.length; i) {
        let currentComponent = gameComponentsSauce[i];

        currentComponent.addEventListener(
            "mousedown",

            function () {
                selectionAction_sauce(currentComponent);
            },
        );

        i++;
    }

    //client listeners

    for (let i = 0; i < gameComponentsClient.length; i) {
        let currentComponent = gameComponentsClient[i];

        currentComponent.addEventListener(
            "mousedown",

            function () {
                selectionAction_client(currentComponent, i - 1);
            },
        );

        i++;
    }

    //General listeners

    gameComponentsPause.addEventListener(
        "click",

        function () {
            selectionAction_pause();
        },
    );
}

function selectionAction_food(listenedComponent) {
    if (letSelect === false) {
        return;
    }
    letSelect = false;

    listenedComponent.style.backgroundColor = "rgba(224, 200, 90, 0.849)";
    listenedComponent.style.opacity = "0.9";
    listenedComponent.style.boxShadow =
        "inset 0px 0px 75px 2px rgba(0,0,0,0.36)";
    listenedComponent.style.backgroundSize = "45px 45px";

    selectionInHand = listenedComponent;
}

function selectionAction_utility(listenedComponent, from) {
    //This detect the trash utility and take cares of the doing.
    if (from == 1) {
        if (letSelect === true) {
            return;
        }
        selectionAction_trash();
    }

    //This detect the safe A and B utility and take cares of the doing.

    if (from == 2 || 3) {
        selectAction_setSafe(from);
    }
}

function selectionAction_sauce(listenedComponent) {
    if (letSelect === false) {
        return;
    }

    letSelect = false;

    listenedComponent.style.backgroundColor = "#221f1ccc";
    listenedComponent.style.boxShadow =
        "inset 0px 0px 17px 0px rgba(0,0,0,0.75)";

    selectionInHand = listenedComponent;
}

function selectionAction_deselect() {
    letSelect = true;
    selectionInHand.removeAttribute("style");
    selectionInHand = null;

    //in case of safes

    if (selectionInHandSafe != false) {
        gameComponentsUtility[selectionInHandSafe].removeAttribute("style");

        if (selectionInHandSafe == 1) {
            inSafeA = false;
            inSafeUseA = false;
        } else if (selectionInHandSafe == 2) {
            inSafeB = false;
            inSafeUseB = false;
        }

        selectionInHandSafe = false;
    }
}

function selectAction_setSafe(witch) {
    if (witch == 2) {
        if (inSafeUseA == false && selectionInHand !== null) {
            let backgroundFromHand = window
                .getComputedStyle(selectionInHand, null)
                .getPropertyValue("background-image");
            gameComponentsUtility[1].style.backgroundImage = backgroundFromHand;

            inSafeUseA = true;
            inSafeA = selectionInHand;

            selectionAction_deselect();
        } else if (inSafeUseA == true && selectionInHand == null) {
            selectionInHandSafe = 1;

            selectionInHand = inSafeA;
            letSelect = false;
            gameComponentsUtility[1].style.backgroundSize = "45px";
            gameComponentsUtility[1].style.backgroundColor =
                "rgba(153, 153, 153, 0.7)";
            gameComponentsUtility[1].style.boxShadow =
                "inset 0px 0px 28px 4px rgba(0,0,0,0.37)";
        }
    } else if (witch == 3) {
        if (inSafeUseB == false && selectionInHand != null) {
            let backgroundFromHand = window
                .getComputedStyle(selectionInHand, null)
                .getPropertyValue("background-image");
            gameComponentsUtility[2].style.backgroundImage = backgroundFromHand;

            inSafeUseB = true;
            inSafeB = selectionInHand;
            selectionAction_deselect();
        } else if (inSafeUseB == true && selectionInHand == null) {
            selectionInHandSafe = 2;

            selectionInHand = inSafeB;
            letSelect = false;
            gameComponentsUtility[2].style.backgroundSize = "45px";
            gameComponentsUtility[2].style.backgroundColor =
                "rgba(153, 153, 153, 0.7)";
            gameComponentsUtility[2].style.boxShadow =
                "inset 0px 0px 28px 4px rgba(0,0,0,0.37)";
        }
    }
}

function selectionAction_pause() {
    if (gameComponentsPause.getAttribute("state") == "play") {
        cicleAction_onOff("off");
        gameComponentsPause.setAttribute("state", "pause");
        gameComponentsPause.style.backgroundColor = "red";
    } else if (gameComponentsPause.getAttribute("state") == "pause") {
        cicleAction_onOff("on");
        gameComponentsPause.setAttribute("state", "play");
        gameComponentsPause.style.backgroundColor = "blue";
    }
}

//---!!!--- CLIENT SELECTION ---!!!---//
//This code was intended to be use just for selection engine on the food table, but now will control any selection on the game, the next selection it will control will be clientselections.

function selectionAction_client(listenedComponent, from) {
    for (let i = 0; i <= 5; i++) {
        //si llega al final del conteo sin verificar nada entonces saltará el error porque el elemento en mano no es el que el cliente desea, tambien verifica que se tenga algun elemento en la mano
        if (i == 5 && selectionInHand !== null) {
            alert("end");
        }

        //verifica el array para definir si el pedido es el que se encuentra en la mano.
        if (
            client_wishSet[from][i] == selectionInHand &&
            client_wishState[from][i] == true
        ) {
            //cambia el clientWishState so that client is served, and reduce the wishQuantity so we can detect when all wishes were served
            client_wishState[from][i] = "served";
            client_wishQuantity[from]--;

            if (client_wishQuantity[from] == 0) {
                //TODO IN THE FUTURE CHANGE THIS FOR clientAction_served() THAT TAKE CARES OF ALL THE RIGHT DOINGS
                clientAction_served(from);
            }
            //clear the selection so you can select something else.
            selectionAction_deselect();

            toRender_client = true;
            break;
        }
    }
}

selectionEngineListeners();
