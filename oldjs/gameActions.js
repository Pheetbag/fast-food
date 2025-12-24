//Game actions are the main controllers of any engine, everything thats not active by the startsequence will have to be active by an game action.

////---------- CLIENTS

function clientAction_create() {
    //evaluate if a new client can be create. do it if true.
    if (evaluate_clientGeneration() == true) {
        generateClient();
        toRender_client = true;
    }
}

function clientAction_delete(client) {
    if (client == "all") {
        for (let i = 0; i < 4; i++) {
            deleteClient(i);
        }
        return;
    }

    deleteClient(client);
}

function clientAction_patience() {
    //check for every client patience for update
    for (let i = 0; i < 4; i++) {
        //verify is client patience is defined
        if (client_patienceSet[i] !== false) {
            //update the actual patience
            client_patienceActual[i]--;

            //if after the update the client do not have anymore patience, delete it
            if (client_patienceActual[i] == 0) {
                clientAction_lost(i);
            }
            toRender_patience = true;
        }
    }
}

function clientAction_lost(client) {
    //this is use in case the client is deleted because it was lost, so we get the game changes, like losing life

    //printAction_heart(false, 1);
    player.set("hearts", -1);

    clientAction_delete(client);
}

function clientAction_served(client) {
    //this is use in case we served a client so we can make changes like gain cash

    //printAction_cash(true, 100);
    player.set("money", 100);

    clientAction_delete(client);
}

////---------- CICLE

function cicleAction_onOff(i) {
    if (i == "on") {
        gameCicle_controller = setInterval("gameCicle()", 100);
    } else if (i == "off") {
        clearInterval(gameCicle_controller);
    }
}

////---------- PRINTS

function printAction_heart(type, quantity) {
    if (type == false) {
        printState_heart = printState_heart - quantity;
    } else if (type == true) {
        //ganas corazones
    }

    if (printState_heart == 0) {
        gameAction_end();
    }
}

function printAction_cash(type, quantity) {
    if (type == false) {
        printState_cash = printState_cash - quantity;
    } else if (type == true) {
        printState_cash = printState_cash + quantity;
    }
}

////---------- SELECTION

function selectionAction_trash() {
    //printAction_cash(false, 75);
    player.set("money", -150);
    selectionAction_deselect();
}

////---------- GAME

function gameAction_end() {
    clientAction_delete("all");
    setTimeout("cicleAction_onOff('off')", 100);
    alert("perdiste");
}
