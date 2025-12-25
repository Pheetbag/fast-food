// It have the full control over theprint of information on the header ofthe game,this includes live, stars, username and cash, and all the calculation behind it.
//It is important to understand the 2 phases process of work with this, the first phase will make constant recalculation, and drop the final results to be uses by the game object process and the game action process.

//toRender_type allow to keep changes of the game to be rendered in control. so you can render things just when necessary.
var toRender_client = false;
var toRender_patience = false;

//renders, this take care of setting the printStates into the visuals of the game, and make the stateUpdates when need it. renders do not make printObjects recalculation, it just make the calculations need it for the right display of the current info in the screen, for printObjects updates you may use printUpdate functions.

//it have the capability of reprinting, that allows the system to render (all from 0) the heart, for printing a new set of heart (or stars), and the new heart state set, so you can use the printRenders to a new number, and the system will re-render it.

function render_printHeart() {
    for (i = 0; i < printState_heart; i) {
        gameComponentsHeart[i].style.backgroundImage =
            "url(assets/gameGeneral_ico/heart_active.png)";

        if (i == 5) {
            break;
        } else {
            i++;
        }
    }

    if (printState_heart > 6) {
        var e = 0;

        for (i = 6; i < printState_heart; i++) {
            gameComponentsHeart[e].style.backgroundImage =
                "url(assets/gameGeneral_ico/heart_extra.png)";

            e++;
        }
    }

    if (printState_heart < 6) {
        for (i = printState_heart; i < 6; i++) {
            gameComponentsHeart[i].style.backgroundImage =
                "url(assets/gameGeneral_ico/heart_dead.png)";
        }
    }
}

function render_printStar() {
    for (i = 0; i < printState_star; i) {
        gameComponentsStar[i].style.backgroundImage =
            "url(assets/gameGeneral_ico/star1.png)";

        if (i == 5) {
            break;
        } else {
            i++;
        }
    }

    if (printState_star > 6) {
        var e = 0;

        for (i = 6; i < printState_star; i++) {
            if (i < 12) {
                gameComponentsStar[e].style.backgroundImage =
                    "url(assets/gameGeneral_ico/star2.png)";
            }

            e++;
        }
    }

    if (printState_star > 12) {
        var e = 0;

        for (i = 12; i < printState_star; i++) {
            if (i < 18) {
                gameComponentsStar[e].style.backgroundImage =
                    "url(assets/gameGeneral_ico/star3.png)";
            }
            e++;
        }
    }

    if (printState_star > 18) {
        var e = 0;

        for (i = 18; i < printState_star; i++) {
            if (i < 24) {
                gameComponentsStar[e].style.backgroundImage =
                    "url(assets/gameGeneral_ico/star4.png)";
                e++;
            }
        }
    }

    if (printState_star > 24) {
        var e = 0;

        for (i = 24; i < printState_star; i++) {
            if (i < 30) {
                gameComponentsStar[e].style.backgroundImage =
                    "url(assets/gameGeneral_ico/star5.png)";
                e++;
            }
        }
    }

    if (printState_star < 6) {
        for (i = printState_star; i < 6; i++) {
            gameComponentsStar[i].style.backgroundImage =
                "url(assets/gameGeneral_ico/star0.png)";
        }
    }
}

function render_printName(nameRender = Unknown) {
    printState_name = nameRender;
    gameComponentsName.innerHTML = printState_name;

    document.title = nameRender + " | FastFood";
}

function render_printCash() {
    gameComponentsCash.innerHTML = printState_cash;

    if (printState_cash < 0) {
        gameComponentsCash.style.color = "rgb(216, 57, 48)";
    } else {
        gameComponentsCash.style.color = "white";
    }
}

//This code was for the print section of the game box, but now its going to be the whole renderEngine ( or at least the most part) of the game. This means anything that does not make tecnical changes, or "gameActions" to any "gameComponent" or gameNativeActions its going to be consider a render, if it haves visual references on the screen for the player, and the code to do it will be in this file.

function render_client() {
    //esto es un mecanismo de seguridad para que se genere el render solo cuando se necesite rederizar algo nuevo, por ahora no se usará, pero en el futuro se aplicará a todos los renders.
    if (toRender_client == false) {
        return;
    }
    console.log("render");
    toRender_client = false;

    //this for go through all clients to check the ones that are defined, and render them.
    for (i = 0; i < client_inUse.length; i++) {
        if (client_inUse[i] == true) {
            gameComponentsClient[i].style.visibility = "visible";

            //all ramdom generations with the next format of the array: [0]-[3] wishes ramdom, [4]sauce, [5]client image [6] waittime.
            let inRender_client = client_wishSet[i];

            //we safe all the data targets to be rendered from the client in cuestion.

            //EN EL FUTURO PODRÍA TRANSFORMARLOS EN GETTERS PARA UN USO MÁS GENERAL, Y NO REPETIR CODIGO.
            let render_clientFace = gameComponentsClientNodes[i][5];
            let render_clientWish = [
                gameComponentsClientNodes[i][0],
                gameComponentsClientNodes[i][1],
                gameComponentsClientNodes[i][2],
                gameComponentsClientNodes[i][3],
            ];
            let render_clientSauce = gameComponentsClientNodes[i][4];
            let render_wishState = client_wishState[i];

            //render the client image face
            doRender_clientFace(render_clientFace, inRender_client);
            doRender_clientWish(
                render_clientWish,
                inRender_client,
                render_wishState,
            );
            doRender_clientSauce(
                render_clientSauce,
                inRender_client,
                render_wishState,
            );
        } else {
            doRender_clientClean(i);
        }
    }
}

function render_clientPatience() {
    if (toRender_patience == false) {
        return;
    }
    toRender_patience = false;

    for (i = 0; i < 4; i++) {
        doRender_clientPatience(i);
    }
}

function doRender_clientFace(render_clientFace, inRender_client) {
    render_clientFace.style.backgroundImage = "url(" + inRender_client[5] + ")";
}

function doRender_clientWish(
    render_clientWish,
    inRender_client,
    render_wishState,
) {
    //use a for, to check every client wish from 1 to 4, checking if are defined, and if the are render it
    for (let i = 0; i < render_clientWish.length; i++) {
        if (inRender_client[i] !== false) {
            //This define temporaly a variable with the value of background to be display when wish defined in the div attribute, to be use in the visual render.
            let bgWishDisplay = inRender_client[i].getAttribute("bg-display");

            render_clientWish[i].style.backgroundImage =
                "url(assets/" + bgWishDisplay + ")";

            //this verified if the wish has been served to the client, so render it the right way
            if (render_wishState[i] == "served") {
                render_clientWish[i].style.opacity = "0.7";
                render_clientWish[i].style.backgroundSize = "35px";
            }
        }
    }
}

function doRender_clientSauce(
    render_clientSauce,
    inRender_client,
    render_wishState,
) {
    //Check if the sauce is defined, in case is not, will be false, so no render.
    if (inRender_client[4] == false) {
        return;
    }

    //This define temporaly a variable with the value of background to be display when wish defined in the div attribute, to be use in the visual render.
    let bgSauceDisplay = inRender_client[4].getAttribute("bg-display");

    render_clientSauce.style.backgroundImage =
        "url(assets/" + bgSauceDisplay + ")";

    //this verified if the sauce has been served to the client, so render it the right way
    if (render_wishState[4] == "served") {
        render_clientSauce.style.opacity = "0.7";
        render_clientSauce.style.backgroundSize = "20px";
    }
}

function doRender_clientPatience(i) {
    let render_clientPatience = gameComponentsClientNodes[i][7];

    //we transform the patience in a percentage to be used in the display
    let patiencePercentage =
        (client_patienceActual[i] * 100) / client_patienceSet[i];

    render_clientPatience.style.height = patiencePercentage + "%";

    //set the background colors
    if (patiencePercentage > 80) {
        render_clientPatience.style.backgroundColor = "rgb(42, 135, 189)";
    } else if (patiencePercentage > 50) {
        render_clientPatience.style.backgroundColor = "rgb(147, 193, 80)";
    } else if (patiencePercentage > 20) {
        render_clientPatience.style.backgroundColor = "rgb(241, 172, 63)";
    } else {
        render_clientPatience.style.backgroundColor = "rgb(194, 66, 53)";
    }
}

function doRender_clientClean(client) {
    gameComponentsClient[client].style.visibility = "hidden";
    //reset all the client Elements, like wishes and the client avatar just in the visuals
    //TODO ALERT this in later future will be display in two fases, first one here, updating the code, and the second one in the renderEngine, for changing visuals

    gameComponentsClientNodes[client][5].removeAttribute("style");
    gameComponentsClientNodes[client][0].removeAttribute("style");
    gameComponentsClientNodes[client][1].removeAttribute("style");
    gameComponentsClientNodes[client][2].removeAttribute("style");
    gameComponentsClientNodes[client][3].removeAttribute("style");
    gameComponentsClientNodes[client][4].removeAttribute("style");
}
