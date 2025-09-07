//here we safe any item we want to set into the game

//This items are not set in here, but in the init.js, here we only define them and save them into an array that will be
// pass to the assets engine.

//TODO CAMBIAR LA FORMA EN LA QUE SE RENDERIZAN LAS TEXTURAS DE LOS OBJECTOS USANDO EL TEXTUREMAP, ENTRE OTRAS COSAS
// (TOMAR EN CONSIDERACION LA ACTUALIZACION DE TEXTURE MAP NATIVO POR OTRAS EXTENSIONES)

//--------TEXTURES

ff.defaultTextures = function () {
    let defaultTextures = {
        item: [],
        client: [],
    };

    // Client textures moved to clientComponent

    return defaultTextures;
};

//-----------------------ITEMS

ff.defaultItems = function () {
    let defaultItems = [];

    for (let i = 0; i < 20; i++) {
        defaultItems.push(new assets.item(i));

        defaultItems[i].texture = i;
    }

    //------LOW
    defaultItems[0].name = "Hamburguesa";
    defaultItems[0].cost = -25;
    defaultItems[0].price = 35;
    defaultItems[0].ico = "core:menu:food-item:hamburguer";

    defaultItems[1].name = "Papas fritas";
    defaultItems[1].desc = "Descripción de las papas fritas";
    defaultItems[1].cost = -10;
    defaultItems[1].price = 20;
    defaultItems[1].ico = "core:menu:food-item:fries";

    defaultItems[2].name = "Perro caliente";
    defaultItems[2].cost = -20;
    defaultItems[2].price = 37;
    defaultItems[2].ico = "core:menu:food-item:hot-dog";

    defaultItems[3].name = "Pan tostado";
    defaultItems[3].cost = -8;
    defaultItems[3].price = 17;
    defaultItems[3].ico = "core:menu:food-item:toast";

    defaultItems[4].name = "Dona";
    defaultItems[4].cost = -8;
    defaultItems[4].price = 16;
    defaultItems[4].ico = "core:menu:food-item:doughnut";

    defaultItems[5].name = "Huevos fritos";
    defaultItems[5].cost = -9;
    defaultItems[5].price = 13;
    defaultItems[5].ico = "core:menu:food-item:egg";

    defaultItems[6].name = "Queso";
    defaultItems[6].cost = -6;
    defaultItems[6].price = 10;
    defaultItems[6].ico = "core:menu:food-item:cheese";

    defaultItems[7].name = "Pescado frito";
    defaultItems[7].cost = -20;
    defaultItems[7].price = 36;
    defaultItems[7].ico = "core:menu:food-item:fish";

    //---------MEDIUM
    defaultItems[8].name = "Sandwich";
    defaultItems[8].cost = -30;
    defaultItems[8].price = 47;
    defaultItems[8].ico = "core:menu:food-item:sandwich";

    defaultItems[9].name = "Muslos de pollo";
    defaultItems[9].cost = -40;
    defaultItems[9].price = 58;
    defaultItems[9].ico = "core:menu:food-item:meat";

    defaultItems[10].name = "Pizza";
    defaultItems[10].cost = -70;
    defaultItems[10].price = 100;
    defaultItems[10].ico = "core:menu:food-item:pizza";

    defaultItems[11].name = "Camarones";
    defaultItems[11].cost = -100;
    defaultItems[11].price = 177;
    defaultItems[11].ico = "core:menu:food-item:shrimp";

    defaultItems[12].name = "Shawarma";
    defaultItems[12].cost = -50;
    defaultItems[12].price = 70;
    defaultItems[12].ico = "core:menu:food-item:kebab";

    defaultItems[13].name = "Croissant";
    defaultItems[13].cost = -48;
    defaultItems[13].price = 67;
    defaultItems[13].ico = "core:menu:food-item:croissant";

    defaultItems[14].name = "Bistec";
    defaultItems[14].cost = -65;
    defaultItems[14].price = 80;
    defaultItems[14].ico = "core:menu:food-item:steak";

    defaultItems[15].name = "Galletas";
    defaultItems[15].cost = -50;
    defaultItems[15].price = 77;
    defaultItems[15].ico = "core:menu:food-item:cookies";

    //--------HIGH
    defaultItems[16].name = "Ensalada";
    defaultItems[16].cost = -120;
    defaultItems[16].price = 148;
    defaultItems[16].ico = "core:menu:food-item:salad";

    defaultItems[17].name = "Sushi";
    defaultItems[17].cost = -250;
    defaultItems[17].price = 300;
    defaultItems[17].ico = "core:menu:food-item:sushi";

    defaultItems[18].name = "Panquecas";
    defaultItems[18].cost = -100;
    defaultItems[18].price = 120;
    defaultItems[18].ico = "core:menu:food-item:pancakes";

    defaultItems[19].name = "Salami";
    defaultItems[19].cost = -110;
    defaultItems[19].price = 180;
    defaultItems[19].ico = "core:menu:food-item:salami";

    return defaultItems;
};

ff.defaultAsset = new assets.object(ff.defaultItems(), ff.defaultTextures());
