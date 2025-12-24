//This start the whole game engine (previous the reset sequence, for "play again" mode.

function startGame() {
    //Close startwindow
    document.getElementById("startWindow").style.display = "none";

    //get userName
    initName = document.getElementById("inputUser").value;
    if (
        initName == "" ||
        initName == " " ||
        initName == "  " ||
        initName == "   " ||
        initName == "    " ||
        initName == "     " ||
        initName == "      " ||
        initName == "       " ||
        initName == "        "
    ) {
        initName = "Unknown";
    }

    //start all initial renders.
    render_printHeart();
    render_printStar();
    render_printName(initName);
    render_printCash();

    //start gameCicle engine.
    cicleAction_onOff("on");
}

//gameCicle is the function triggered by the gameCicles, the gameCicles is the way for the game to make time updates, and time calculations under the same base. The game makes 10cps(cicles per second), making a precision of 0.1 second, for any engine based on his update.

//for making better code maintenance, any (or as many as possible) updates (render updates, and code updates) will fall on gameCicle, setting a centraliced place for updates to be tracked.
//TODO[!] Move those update engines in the future to here.

function cicleUpdate() {
    //the object oriented edition of gameCicle

    //check if cicle is actived
    if (game.cicle.state == "off") {
        return;
    }

    //update all cicle.currents.
    game.cicle.update();

    //CICLE PROCESS

    //TODO IMPORTANT!!!!!!!
    //In the future this will work in a different way, we will run checkMemory and save the return in a var, if the value is false, then the memory is update, otherwise it return and array,that will be run for starting the renders of the partitions of the memory not updated.

    //We update the print renders.
    if (
        render.print.checkMemory("hearts", game.state.render.print.hearts) ==
        false
    ) {
        render.print.hearts(game.state.render.print.hearts);
    }

    if (
        render.print.checkMemory("stars", game.state.render.print.stars) ==
        false
    ) {
        render.print.stars(game.state.render.print.stars);
    }

    if (
        render.print.checkMemory("money", game.state.render.print.money) ==
        false
    ) {
        render.print.money(game.state.render.print.money);
        console.log("need render");
    }
}

function gameCicle() {
    //This increment the currentGameCicle variable.
    //TODO on the future its going to be defined other varibles of currentGameCicle, currentGameCicle_deca that increases in 1 everytime 10 cicles goes(1sec), and currentGameCicle_hecta for 100 cicles (10sec).
    currentGameCicle++;

    //update renders in every cicle

    //prints
    //render_printHeart();
    //render_printStar();
    //render_printCash();

    //clients
    render_client();
    render_clientPatience();

    //this start the clientEngine in every cicle trying to generate anew client if possible, in clientGenerationEngine.js
    clientAction_create();
    clientAction_patience();
}
