import { clientsEngine } from "./client";

export class Cicle {
    current: number = 0;
    currentDeca: number = 0;
    currentHecta: number = 0;
    currentGlobal: number[] = [
        this.current,
        this.currentDeca,
        this.currentHecta,
    ];
    controller: ReturnType<typeof setInterval> | undefined;
    state: "on" | "off" = "on";

    update(): void {
        //define a new cicle execution
        this.current++;
        this.currentDeca = Math.trunc(this.current / 10);
        this.currentHecta = Math.trunc(this.current / 1000);
        this.currentGlobal = [
            this.current,
            this.currentDeca,
            this.currentHecta,
        ];
    }

    action(action: "clear" | "set"): void {
        if (action === "clear") {
            this.clearCicle();
        }
        if (action === "set") {
            this.setCicle();
        }
    }

    setCicle(): void {
        this.controller = setInterval(cicleUpdate, 100);
        this.state = "on";
    }

    clearCicle(): void {
        if (this.controller) {
            clearInterval(this.controller);
        }
        this.state = "off";
    }
}

function cicleUpdate() {
    //check if cicle is actived
    if (cicle.state == "off") {
        return;
    }

    //update all cicle.currents.
    cicle.update();

    //CICLE PROCESS

    //---PAINT----
    //we paint out all the elements in here, the sketch have to be defined out of this cicle, for being reuse, otherwise if you define the sketch inside the cicleUpdate it will slow down performance

    //TODO IMPORTANT!!!!!!!
    //In the future this will work in a different way, we will run checkMemory and save the return in a var, if the value is false, then the memory is update, otherwise it return and array,that will be run for starting the renders of the partitions of the memory not updated.

    //---RENDER---
    //We update the print renders.
    if (render.print.checkMemory("hearts", game.state.player.hearts) == false) {
        render.print.hearts(game.state.player.hearts);
    }
    if (render.print.checkMemory("stars", game.state.player.stars) == false) {
        render.print.stars(game.state.player.stars);
    }
    if (render.print.checkMemory("money", game.state.player.money) == false) {
        render.print.money(game.state.player.money);
    }
    if (render.print.checkMemory("name", game.state.player.name) == false) {
        render.print.name(game.state.player.name);
    }

    //We update the scene renders.
    if (render.scene.checkMemory("menu", game.state.scene.menu) == false) {
        render.scene.menu(game.state.scene.menu);
    }
    if (render.scene.checkMemory("hand", game.state.player.hand) == false) {
        render.scene.hand(game.state.player.hand);
    }

    //Generate clients

    if (clientsEngine.evaluate()) {
        clientsEngine.new();
    }
}

export const cicleEngine = new Cicle();
