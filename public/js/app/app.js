//app.js takes control of the game function, after everything is already preloaded and setup, the system execute app.js so the game start working, the main functioning of the game is initialize in this file.
//Init.js takes cares of initialize all major variables, set all the reactive and the corresponding reaction, so the game can work just fine. After the init.js is executed

//We initialize the core objects of the game.
game = new Game();
player = new Player();
scene = new Scene();
paint = new Paint();
render = new Render();
