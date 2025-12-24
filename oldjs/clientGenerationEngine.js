//clientGenerationEngine takes care of generating new clients, and the list of wish that will be asocciate to it. It use the gameLevel to define how many clients, the game will have.

//todos estos métodos usarán gameLevel como referencía, que es una variable que aumenta en función de cuantos clientes hemos atendido.

var client_timeSpacing = 15; //time between one generation and another
var client_maxQuantity = 4; //max quantity of client able to be generate
var client_actualQuantity = 0; //generated clients being display in that moment
var client_totalQuantity = 0; //generated clients during the whole game
var client_GenerationChance = 5; //the chances of generating a new client when ramdomgen is true
var client_RamdomGen = true; //set if clients use ramdomgen after timespacing complete
var client_lastGenerationCicle = 0; //set the last cicle a client was generated

var client_maxWishQuantity = 3; //max wish quantity
var client_minWishQuantity = 1; //min wish quantity
var client_maxWaitLimit = 100; //max cicle quantity the client may wait (without ramdom)
var client_minWaitLimit = 80; //min cicle quantity the client may wait (without ramdom)
var client_wishSauce = 30; //it define if the client can generate sauce and the chances.

//detect if a client is being use, so it do not restart it.
var client_inUse = [false, false, false, false];

//This safes the information of any client wishes, also check the wishState, so we can check if a wish has been served already, finally also handle how many active wishes are left.
var client_wishSet = [[], [], [], []];
var client_wishState = [[], [], [], []];
var client_wishQuantity = [];

var client_patienceSet = [false, false, false, false];
var client_patienceActual = [false, false, false, false];

//This funtion take care of determinating if is posible to generate the new client. All this evaluation are if conditionals, that have a return inside in case is true, closing the function and not allowing to get to the end,
function evaluate_clientGeneration() {
    //EXCEPTION this make an exception to all this evaluations in case is the first client to be created.
    if (client_totalQuantity == 0) {
        return true;
    }

    //make sure that the minimun amount of cicle (0.5s per cicle) until the generation of a new client, has already pass.
    let tempCicleGeneration = currentGameCicle - client_lastGenerationCicle;
    if (client_timeSpacing > tempCicleGeneration) {
        return false;
    }

    //check if reach the client limit
    if (client_actualQuantity >= client_maxQuantity) {
        return false;
    }

    //generate a ramdom number between 0 and 100, for making the generation chance
    let ramdomGeneration = ramdomNumber(0, 100);

    //check the generation chance, if the clientRamdomGen is activated, incase there is no clients generated ramdomgen will be ignore from the process. If the code choose not to generate a client the system will retry in the next cicle.

    if (
        ramdomGeneration >= client_GenerationChance &&
        client_RamdomGen == true &&
        client_totalQuantity > 0
    ) {
        return false;
    }

    return true;
}

function generateClient() {
    function setClient(client, setFrom) {
        client_inUse[client] = true;

        //genera la lista de deseos de el cliente, almacenada en clienWishX.
        generate_clientWish(client);

        //this information is set in here so is the most up to date as possible, because this is a direct representation of time in the code. in the case o actualQuantity and totalQuantity this is not so important,they can allow a couple seconds delay.
        client_lastGenerationCicle = currentGameCicle;
    }

    //check if this is the first client. (The evaluation check make the code ignore the cicle require, this one set the timeout.
    if (client_totalQuantity == 0) {
        setTimeout(function () {
            setClient(0, 0);
            toRender_client = true;
        }, 1350);
    }

    //this make a cicle to verified witch client is not on use to generate the new one in that position.
    for (let i = 0; i < client_inUse.length; i++) {
        if (client_totalQuantity == 0) {
            break;
        }
        if (client_inUse[i] == false) {
            setClient(i, 1);
            break;
        }
    }

    client_actualQuantity++;
    client_totalQuantity++;
}

function deleteClient(client) {
    //set the client wish quantity into false, so the client is not generated yet, also clean up the client_wishSet so there is not any wish saved for that client.
    client_wishSet[client] = [];
    client_wishState[client] = [];
    client_wishQuantity[client] = false;

    //clean up the patienceSet and patienceActual so it can be generate again
    client_patienceSet[client] = false;
    client_patienceActual[client] = false;

    //set the client in use as false so the code knows this client is not being use anymore, also reduce by one the client_actualQuantity
    client_actualQuantity--;
    client_inUse[client] = false;
    toRender_client = true;
}

///////------------------------ WISH GENERATION

/* 
There is a init var call gameComponentsWish that contains all the component a client can wish.
Thats take the information directly from the div of this component on the selection board, so in some cases you have to set a specific property to be evaluated with information you want to use later, (like wishRender, that contains the backgrounimage the sytem will use to be render at the wishes.)
*/

function generate_clientWish(client) {
    //generate how many wishes will the client have
    let wishRamdomQuantity = ramdomNumber(
        client_minWishQuantity,
        client_maxWishQuantity,
    );

    //safe  how many wishes the client have
    client_wishQuantity[client] = wishRamdomQuantity;

    generate_wishFood(client, wishRamdomQuantity);
    generate_wishSauce(client);
    generate_wishFace(client);
    generate_wishPatience(client);
}

function generate_wishFood(client, quantity) {
    let wishRamdomQuantity = quantity;

    for (let i = 0; i < 4; i++) {
        //set the ramdom option at the end of the client wishes list if is on the limits, if not set it on false.
        if (i < wishRamdomQuantity) {
            //set a ramdom wish for the client.
            let wishRamdomOption = ramdomNumber(
                0,
                gameComponentsWish.length - 1,
            );

            client_wishSet[client].push(gameComponentsWish[wishRamdomOption]);

            //set in the wish state true, so the system can check if this is an actual wish to be served or if it was already served
            client_wishState[client].push(true);
        } else {
            client_wishSet[client].push(false);

            //set in the wish state false, so the system can check if this is an actual wish to be served or if it was already served
            client_wishState[client].push(false);
        }
    }
}

function generate_wishSauce(client) {
    //generate the sauce on the 4th position if is active the sauce generation, an using the percentage chances for generation.

    //generate a ramdom number between 0 and 100, for making the generation chance
    let ramdomGeneration = ramdomNumber(0, 100);

    if (client_wishSauce != false && ramdomGeneration <= client_wishSauce) {
        //add into the clientWishQuantity the counting of sauce for the wish list to be compare
        client_wishQuantity[client]++;

        //set a ramdom sauce for the client
        let wish_ramdomSauce = ramdomNumber(0, gameComponentsSauce.length - 1);

        client_wishSet[client][4] = gameComponentsSauce[wish_ramdomSauce];
        client_wishState[client].push(true);
    } else {
        client_wishSet[client][4] = false;
        client_wishState[client].push(false);
    }
}

function generate_wishFace(client) {
    //generate the client faces
    client_wishSet[client][5] =
        gameObjectsClient[ramdomNumber(0, gameObjectsClient.length - 1)];
}

function generate_wishPatience(client) {
    //set a ramdom number for the client Patience
    let clientPatienceRamdom = ramdomNumber(
        client_minWaitLimit,
        client_maxWaitLimit,
    );

    //set it on the patienceSet and patienceActual
    client_patienceSet[client] = clientPatienceRamdom;
    client_patienceActual[client] = clientPatienceRamdom;
}
