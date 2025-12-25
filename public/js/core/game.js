//any variable of function we want to create native, should be defined in this object so we dont touch the global namespaces
var ff = new Object();

function Game() {
    this.level;

    this.state = {
        player: {
            hearts: 6,
            stars: 0,
            money: 0,
            name: "unknown",
            hand: [],
        },

        scene: {
            menu: [],
            hand: [],
            client: [],
        },
    };

    this.assets = [];

    //TODO Is important to note that this have to be moved from here, the use of components is deprecated in the code,
    // so now we have to create a way to refers to all components  (this is deprecated because the system now have assets for it)
    // But right now it do not support the components or similar (also check where components are used)

    this.component = new Component();

    Game.prototype.over = function () {
        alert("you lost");
    };
}

function Scene() {
    this.menu = [];
    this.hand = [];

    this.set = function (type, value) {
        this.menu.push(value);
        //update the gamestate;
        game.state.scene.menu = this.menu;
    };

    this.setup = function () {
        return;
        let reactTree = react("click").do();
        let context = paint.getContext("ff-gameMenu-slot");

        for (let i = 0; i < context.length; i++) {
            console.log("parsing menu items");
            //---CLICK

            reactive("mousedown")
                .do((rx) => {
                    //rx is the shortcut for reactive
                    player.set("hand", rx);
                    console.info(scene.menu[rx.context.dataset.id]);
                })
                .use(context[i])
                .add(reactTree);

            //---HOVER IN
            reactive("mouseenter")
                .do((rx) => {
                    //rx is the shortcut for reactive
                    let context = rx.context;
                    let showboxContext = context.children[0];
                    console.log(showboxContext);
                    console.log("showboxContext");
                    let xMap = [
                        [
                            { x: "div", class: "showBox" },
                            [{ x: "p", class: "title" }, context.dataset.name],
                            [{ x: "p", class: "desc" }, context.dataset.desc],
                            [{ x: "p", class: "cost" }, context.dataset.cost],
                            [
                                { x: "p", class: "price" },
                                "+" + context.dataset.price,
                            ],
                        ],
                    ];
                    var foo = flexbones(xMap)
                        .contextualize([showboxContext])
                        .clear()
                        .bind();

                    //TODO REMOVE THIS FROM THE REACTTREE AFTER USING IT OR CREATE A NEW REACT TREE A CLEAR IT EVERYTIME
                    reactive("mousedown")
                        .do((rx) => {
                            flexbones().contextualize(context.children).clear();
                        })
                        .use(showboxContext.children[0])
                        .add(reactTree);
                })
                .use(context[i])
                .add(reactTree);

            //---HOVER OUT
            reactive("mouseleave")
                .do((rx) => {
                    let context = rx.context.children[0];
                    flexbones().contextualize([context]).clear();
                })
                .use(context[i])
                .add(reactTree);
        }

        reactive()
            .do((rx) => {
                player.set("hand", "delete");
                console.log("delete action");
            })
            .use(paint.getContext("ff-gameMenu-delete")[0])
            .add(reactTree);
    };
}
