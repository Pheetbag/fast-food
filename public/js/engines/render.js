//It have all the control over the render of all game. Its important to know, that render its just a visual representation
// of the gameState so no changes will be done from here, theonly calculations this engine does, is internal calculations
// for a better visual representation, but it doesnt have any repercution into the gameState, this kind of changes have
// to be done, in the game.state (not recommended) or using the setpropertys of the different objects we define,
// because this sets makes changes directly to the game state.

function Render() {
    this.state = "true";
    this.print = new RenderPrint();
    this.scene = new RenderScene();
    this.memory = {
        print: this.print.memory,
        scene: this.scene.memory,
        wish: "hola", //ELIMINAR
    };

    this.animate = new RenderAnimate();

    this.map = function (data, length, reverse = false) {
        let tempMap;
        if (reverse == false) {
            tempMap = [];

            for (let i = 0; i < length; i++) {
                tempMap.push(0);
            }
            let tempPointer = 0;

            for (let i = 0; i < data; i++) {
                tempMap[tempPointer]++;
                tempPointer++;
                if (tempPointer == length) {
                    tempPointer = 0;
                }
            }
        } else if (reverse == true) {
            tempMap = 0;

            for (let i = 0; i < data.length; i++) {
                tempMap += data[i];
            }
        }

        return tempMap;
    };

    this.do = function () {
        this.print.do();
    };
}

function RenderAnimate() {
    this.hearts = function (
        context,
        effect,
        gameState,
        memory,
        duration = 0,
        delay = 0,
        isStatic = false,
    ) {
        setTimeout(function () {
            let tempChilds = context.children;

            if (effect == "fill") {
                //it fill the updated hearts and outline the others.
                for (let i = 0; i < gameState.length; i++) {
                    tempChilds[i].style.backgroundImage =
                        "url(" + game.component.heartsOn[gameState[i]] + ")";

                    //Updated hearts get fill
                    if (gameState[i] != memory[i]) {
                        tempChilds[i].style.backgroundImage =
                            "url(" + game.component.heartsOn[3] + ")";
                    }
                }
            } else if (effect == "outline") {
                //it outline all hearts
                for (let i = 0; i < gameState.length; i++) {
                    tempChilds[i].style.backgroundImage =
                        "url(" + game.component.heartsOn[gameState[i]] + ")";
                }
            }
            //return everything to normal state after duration
            if (isStatic == false) {
                setTimeout(function () {
                    for (let i = 0; i < gameState.length; i++) {
                        tempChilds[i].style.backgroundImage =
                            "url(" + game.component.hearts[gameState[i]] + ")";
                    }
                }, duration);
            }
        }, delay);
    };

    this.stars = function (
        context,
        effect,
        gameState,
        memory,
        duration = 0,
        delay = 0,
        isStatic = false,
    ) {
        setTimeout(function () {
            let tempChilds = context.children;

            if (effect == "fill") {
                //fill the updated stars and outline the others
                for (let i = 0; i < gameState.length; i++) {
                    tempChilds[i].style.backgroundImage =
                        "url(" + game.component.starsOn[gameState[i]] + ")";

                    if (gameState[i] != memory[i]) {
                        tempChilds[i].style.backgroundImage =
                            "url(" + game.component.starsOn[6] + ")";
                    }
                }
            } else if (effect == "outline") {
                //outline all stars
                for (let i = 0; i < gameState.length; i++) {
                    tempChilds[i].style.backgroundImage =
                        "url(" + game.component.starsOn[gameState[i]] + ")";
                }
            } else if (effect == "rainbow") {
                //rainbow-in effect in updated hearts
                let frameDuration = duration / 7;
                for (let i = 0; i < 7; i++) {
                    let currentFrame = i;
                    setTimeout(function () {
                        let frameTrack = currentFrame;
                        for (let i = 0; i < gameState.length; i++) {
                            if (gameState[i] != memory[i]) {
                                tempChilds[i].style.backgroundImage =
                                    "url(" +
                                    game.component.starsRainbow[frameTrack] +
                                    ")";
                            }
                        }
                    }, frameDuration * i);
                }
            }
            //return everything to normal state after duration
            if (isStatic == false) {
                setTimeout(function () {
                    for (let i = 0; i < gameState.length; i++) {
                        tempChilds[i].style.backgroundImage =
                            "url(" + game.component.stars[gameState[i]] + ")";
                    }
                }, duration);
            }
        }, delay);
    };

    this.money = function (
        context,
        effect,
        gameState,
        memory,
        duration = 0,
        delay = 0,
        isStatic = false,
    ) {
        let tempChilds = context.children;
        let tempChange = gameState - memory;
        let pointer = 0;
        if (tempChange < 0) {
            tempChange = tempChange * -1;
        }

        if (effect == "++") {
            let tempInterval = setInterval(function () {
                pointer += tempChange / 500;

                tempChilds[0].innerHTML = Math.trunc(memory + pointer);

                if (pointer >= tempChange) {
                    tempChilds[0].innerHTML = gameState;
                    clearInterval(tempInterval);
                }
            }, 0);
        } else if (effect == "--") {
            let tempInterval = setInterval(function () {
                pointer += tempChange / 100;

                tempChilds[0].innerHTML = Math.trunc(memory - pointer);

                if (pointer >= tempChange) {
                    tempChilds[0].innerHTML = gameState;
                    clearInterval(tempInterval);
                }
            }, 0);
        }
    };
    this.hand = function (
        context,
        effect,
        gameState,
        memory,
        duration = 0,
        delay = 0,
        isStatic = false,
    ) {
        setTimeout(function () {
            if (effect == "fill") {
                let tempBrush = new PaintBrush();
                tempBrush.backgroundColor = "rgba(255, 255, 255, .8)";
                paint.brush(context, tempBrush);
            }

            if (effect == "fail") {
                let tempBrush = new PaintBrush();
                tempBrush.backgroundColor = "rgba(215, 207, 129, 0.8)";
                paint.brush(context, tempBrush);
            }
            if (effect == "delete") {
                let tempBrush = new PaintBrush();
                tempBrush.backgroundColor = "rgba(255, 106, 112, 0.8)";
                paint.brush(context, tempBrush);
            }
            //return everything to normal after duration
            if (isStatic == false) {
                setTimeout(function () {
                    let tempBrush = new PaintBrush();
                    tempBrush.backgroundColor = "rgba(255, 255, 255, .5)";
                    paint.brush(context, tempBrush);
                }, duration);
            }
        }, delay);
    };
}

function RenderPrint() {
    this.state = "true";
    this.memory = {
        //save all gameStates for print in a memory

        hearts: [0, 0, 0, 0, 0, 0],
        stars: [0, 0, 0, 0, 0, 0],
        money: -1,
        name: "",
    };

    RenderPrint.prototype.do = function () {
        this.hearts(game.state.player.hearts);
        this.stars(game.state.player.stars);
        this.money(game.state.player.money);
        this.name(game.state.player.name);
    };

    RenderPrint.prototype.hearts = function (gameState) {
        //if false do not render
        if (render.state == "false" || this.state == "false") {
            return;
        }

        gameState = render.map(gameState, 6);
        const context = paint.getContext("ff-gamePrint-hearts");
        for (let i = 0; i < context.length; i++) {
            render.animate.hearts(
                context[i],
                "fill",
                gameState,
                this.memory.hearts,
                100,
            );
            render.animate.hearts(
                context[i],
                "outline",
                gameState,
                this.memory.hearts,
                100,
                200,
            );
        }
        //updates the memory
        this.updateMemory("hearts", gameState);
    };
    RenderPrint.prototype.stars = function (gameState) {
        //if false do not render
        if (render.state == "false" || this.state == "false") {
            return;
        }

        gameState = render.map(gameState, 6);
        const context = paint.getContext("ff-gamePrint-stars");

        if (!tools.arrEqual(this.memory.stars, gameState, ">")) {
            for (let i = 0; i < context.length; i++) {
                render.animate.stars(
                    context[i],
                    "fill",
                    gameState,
                    this.memory.stars,
                    100,
                    0,
                    true,
                );
                render.animate.stars(
                    context[i],
                    "rainbow",
                    gameState,
                    this.memory.stars,
                    500,
                    200,
                );
                render.animate.stars(
                    context[i],
                    "fill",
                    gameState,
                    this.memory.stars,
                    100,
                    800,
                );
            }
        } else {
            for (let i = 0; i < context.length; i++) {
                render.animate.stars(
                    context[i],
                    "fill",
                    gameState,
                    this.memory.stars,
                    100,
                );
                render.animate.stars(
                    context[i],
                    "outline",
                    gameState,
                    this.memory.stars,
                    100,
                    200,
                );
            }
        }
        //updates the memory
        this.updateMemory("stars", gameState);
    };
    RenderPrint.prototype.money = function (gameState) {
        //if false do not render
        if (render.state == "false" || this.state == "false") {
            return;
        }

        const context = paint.getContext("ff-gamePrint-money");
        for (let i = 0; i < context.length; i++) {
            let childs = context[i].children;
            //text color
            if (gameState < 0) {
                childs[0].style.color = "rgb(216,57,48)";
            } else {
                childs[0].style.color = "white";
            }
            //animate ++ or --
            if (this.memory.money <= gameState) {
                render.animate.money(
                    context[i],
                    "++",
                    gameState,
                    this.memory.money,
                    0,
                );
            } else if (this.memory.money > gameState) {
                console.log("hdec");
                render.animate.money(
                    context[i],
                    "--",
                    gameState,
                    this.memory.money,
                    0,
                );
            }
        }
        //updates the memory
        this.updateMemory("money", gameState);
    };

    RenderPrint.prototype.checkMemory = function (partition, gameState) {
        //Memory checks test for changes in the gameState compared to the last render memory saved.
        if (partition == "hearts") {
            if (!tools.arrEqual(render.map(gameState, 6), this.memory.hearts)) {
                return false; /*no updated memory */
            }
        } else if (partition == "stars") {
            if (!tools.arrEqual(render.map(gameState, 6), this.memory.stars)) {
                return false; /*no updated memory */
            }
        } else if (partition == "money") {
            if (gameState != this.memory.money) {
                return false; /*no updated memory */
            }
        } else if (partition == "name") {
            if (gameState != this.memory.name) {
                return false; /*no updated memory */
            }
        } else {
            return true;
        }
    };

    RenderPrint.prototype.updateMemory = function (partition, gameState) {
        if (partition == "hearts") {
            this.memory.hearts = gameState;
        } else if (partition == "stars") {
            this.memory.stars = gameState;
        } else if (partition == "money") {
            this.memory.money = gameState;
        } else if (partition == "name") {
            this.memory.name = gameState;
        }
    };
}

function RenderScene() {
    this.state = "true";
    this.memory = {
        menu: [],
        hand: [],
    };

    this.menu = function (gameState) {
        //if false do not render
        if (render.state == "false" || this.state == "false") {
            return;
        }

        const context = paint.getContext("ff-gameMenu-slot");

        for (let i = 0; i < context.length; i++) {
            let tempStroke = [
                ["data-id", i],
                ["data-uID", gameState[i].uID],
                ["data-exID", gameState[i].exID],
                ["data-name", gameState[i].name],
                ["data-desc", gameState[i].desc],
                ["data-cost", gameState[i].cost],
                ["data-price", gameState[i].price],
            ];
            let tempContext = [context[i]];
            paint.stroke(tempContext, tempStroke);

            let tempBrush = new PaintBrush();
            tempBrush.backgroundImage =
                game.assets[config.defaultAsset].textureMap.item[
                    gameState[i].texture
                ];
            tempContext = context[i].children;
            paint.brush(tempContext, tempBrush);
        }

        this.memory.menu = tools.objClone(gameState);
    };

    this.hand = function (gameState) {
        //if false do not render
        if (render.state == "false" || this.state == "false") {
            return;
        }

        let context = paint.getContext("ff-gameMenu-hand");
        paint.erase(context);

        if (gameState.length == player.handLimit) {
            render.animate.hand(
                context,
                "fail",
                gameState,
                this.memory.hand,
                0,
                0,
                true,
            );
        } else if (gameState.length < this.memory.hand.length) {
            render.animate.hand(
                context,
                "delete",
                gameState,
                this.memory.hand,
                200,
            );
        } else {
            render.animate.hand(
                context,
                "fill",
                gameState,
                this.memory.hand,
                200,
            );
        }

        for (let i = 0; i < gameState.length; i++) {
            if (gameState[i] == false) {
                continue;
            }

            let tempSketch = paint.sketch(["div"]);
            let tempBrush = new PaintBrush();

            tempBrush.backgroundImage =
                game.assets[config.defaultAsset].textureMap.item[
                    scene.menu[gameState[i].context.dataset.id].texture
                ];
            paint.brush(tempSketch, tempBrush);

            paint.draw(tempSketch, context);
        }
        this.memory.hand = tools.objClone(gameState);
    };

    this.checkMemory = function (partition, gameState) {
        if (partition == "menu") {
            if (tools.arrEqual(this.memory.menu, gameState) == false) {
                return false;
            }
        } else if (partition == "hand") {
            if (gameState.length != this.memory.hand.length) {
                return false;
            }
        }

        return true;
    };
}
