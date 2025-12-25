function Player() {
    this.hearts = 6;
    this.stars = 0;
    this.name = "unknown";
    this.money = 0;
    this.hand = [];

    this.handLimit = 6;

    Player.prototype.set = function (type, value, strict = false) {
        if (type == "hearts") {
            if (strict == false) {
                this.hearts += value;
            } else if (strict == true) {
                this.hearts = value;
            }

            //update the game state to the new gameState, to be rendered.

            game.state.player.hearts = this.hearts;

            return this.hearts;
        } else if (type == "stars") {
            if (strict == false) {
                this.stars += value;
            } else if (strict == true) {
                this.stars = value;
            }

            //update the game state to the new gameState, to be rendered.
            game.state.player.stars = this.stars;
            return this.stars;
        } else if (type == "money") {
            if (strict == false) {
                this.money += parseInt(value);
            } else if (strict == true) {
                this.money = value;
            }

            //update the game state, to the new one.
            game.state.player.money = this.money;
            return this.money;
        } else if (type == "name") {
            this.name = value;

            //update the game state to the new one.
            game.state.player.name = this.name;
            return this.name;
        } else if (type == "hand") {
            //If value delete, delete until 0
            if (value == "delete") {
                if (player.hand.length > 0) {
                    this.hand.pop();
                    game.state.player.hand = this.hand;
                }

                return;
            }

            let context = paint.getContext("ff-gameMenu-hand");

            //if limit reach not update
            if (this.hand.length >= this.handLimit) {
                render.animate.hand(
                    context,
                    "fail",
                    game.state.player.hand,
                    render.scene.memory.hand,
                    200,
                    0,
                    true,
                );
                return;
            }

            //add the item
            const costo = value.context.dataset.cost;
            this.hand.push(value);
            player.set("money", costo);

            //update the game state to the new one.
            game.state.player.hand = this.hand;
        }
    };
}
