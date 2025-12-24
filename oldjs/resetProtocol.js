//This file have all the protocols for making an effective reset of the game, cleaning all variables, and preparing it for thenext game, setting the default state of all objects.

//This set the default state of all the print objects.

function resetEngine_printObjects(heart, star, name, cash) {
    function printObjects_resetHeart() {
        printState_heart = 6;
    }

    if (heart) {
        printObjects_resetHeart();
    }

    function printObjects_resetStar() {
        printState_star = 6;
    }

    if (star) {
        printObjects_resetStar();
    }

    function printObjects_resetName() {
        printState_name = "Unknown";
    }

    if (name) {
        printObjects_resetName();
    }

    function printObjects_resetCash() {
        printState_cash = 1000;
    }

    if (cash) {
        printObjects_resetCash();
    }
}

function resetEngine_selectionHandler() {}
