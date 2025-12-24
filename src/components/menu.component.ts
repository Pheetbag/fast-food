import type { Component } from "./component";
import { type CreateRenderable } from "../libs/render-x";
import { textures } from "../engines/textures";
import { applyUpdates, f } from "../libs/flexbones";

export enum FoodItemTexturesEnum {
    HAMBURGER = "core:menu:food-item:hamburguer",
    FRIES = "core:menu:food-item:fries",
    HOT_DOG = "core:menu:food-item:hot-dog",
    TOAST = "core:menu:food-item:toast",
    DOUGHNUT = "core:menu:food-item:doughnut",
    EGG = "core:menu:food-item:egg",
    CHEESE = "core:menu:food-item:cheese",
    FISH = "core:menu:food-item:fish",
    SANDWICH = "core:menu:food-item:sandwich",
    MEAT = "core:menu:food-item:meat",
    PIZZA = "core:menu:food-item:pizza",
    SHRIMP = "core:menu:food-item:shrimp",
    KEBAB = "core:menu:food-item:kebab",
    CROISSANT = "core:menu:food-item:croissant",
    STEAK = "core:menu:food-item:steak",
    COOKIES = "core:menu:food-item:cookies",
    SALAD = "core:menu:food-item:salad",
    SUSHI = "core:menu:food-item:sushi",
    PANCAKES = "core:menu:food-item:pancakes",
    SALAMI = "core:menu:food-item:salami",
}

export const menuComponent: Component = {
    loadTextures(addTexture) {
        addTexture(
            FoodItemTexturesEnum.HAMBURGER,
            "assets/food_ico/hamburguer.png",
        );
        addTexture(FoodItemTexturesEnum.FRIES, "assets/food_ico/fries.png");
        addTexture(FoodItemTexturesEnum.HOT_DOG, "assets/food_ico/hot-dog.png");
        addTexture(FoodItemTexturesEnum.TOAST, "assets/food_ico/toast.png");
        addTexture(
            FoodItemTexturesEnum.DOUGHNUT,
            "assets/food_ico/doughnut.png",
        );
        addTexture(FoodItemTexturesEnum.EGG, "assets/food_ico/egg.png");
        addTexture(FoodItemTexturesEnum.CHEESE, "assets/food_ico/cheese.png");
        addTexture(FoodItemTexturesEnum.FISH, "assets/food_ico/fish.png");
        addTexture(
            FoodItemTexturesEnum.SANDWICH,
            "assets/food_ico/sandwich.png",
        );
        addTexture(FoodItemTexturesEnum.MEAT, "assets/food_ico/meat.png");
        addTexture(FoodItemTexturesEnum.PIZZA, "assets/food_ico/pizza.png");
        addTexture(FoodItemTexturesEnum.SHRIMP, "assets/food_ico/shrimp.png");
        addTexture(FoodItemTexturesEnum.KEBAB, "assets/food_ico/kebab.png");
        addTexture(
            FoodItemTexturesEnum.CROISSANT,
            "assets/food_ico/croissant.png",
        );
        addTexture(FoodItemTexturesEnum.STEAK, "assets/food_ico/steak.png");
        addTexture(FoodItemTexturesEnum.COOKIES, "assets/food_ico/cookies.png");
        addTexture(FoodItemTexturesEnum.SALAD, "assets/food_ico/salad.png");
        addTexture(FoodItemTexturesEnum.SUSHI, "assets/food_ico/sushi.png");
        addTexture(
            FoodItemTexturesEnum.PANCAKES,
            "assets/food_ico/pancakes.png",
        );
        addTexture(FoodItemTexturesEnum.SALAMI, "assets/food_ico/salami.png");
    },

    loadRenderables(createRenderable: CreateRenderable) {
        createRenderable("menu", game.state.scene.menu, ({ newState }) => {
            // we get the all references in one go, for performance
            const menuSlots = document.querySelectorAll(".ff-gameMenu-slot");

            for (let i = 0; i < newState.length; i++) {
                const menuItem = newState[i];
                const menuItemSlot = menuSlots[i];
                const menuItemTexture = `url(${textures.get(menuItem.ico)})`;

                if (!menuItemSlot) {
                    throw new Error(
                        `No menu slot found for index ${i}. Current amount of available slots is: ${menuSlots.length}`,
                    );
                }

                applyUpdates(
                    f(
                        null,
                        {
                            "data-id": i,
                            "data-uID": menuItem.uID,
                            "data-name": menuItem.name,
                            "data-desc": menuItem.desc,
                            "data-cost": menuItem.cost,
                            "data-price": menuItem.price,
                        },
                        f("div", {
                            style: { backgroundImage: menuItemTexture },
                        }),
                    ),
                    menuItemSlot,
                );
            }
        });
    },
};
