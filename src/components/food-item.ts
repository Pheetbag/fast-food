import type { Component } from "./component";

export enum FoodItemTexturesEnum {
    HAMBURGER = "core:food-item:hamburguer",
    FRIES = "core:food-item:fries",
    HOT_DOG = "core:food-item:hot-dog",
    TOAST = "core:food-item:toast",
    DOUGHNUT = "core:food-item:doughnut",
    EGG = "core:food-item:egg",
    CHEESE = "core:food-item:cheese",
    FISH = "core:food-item:fish",
    SANDWICH = "core:food-item:sandwich",
    MEAT = "core:food-item/meat",
    PIZZA = "core:food-item:pizza",
    SHRIMP = "core:food-item:shrimp",
    KEBAB = "core:food-item:kebab",
    CROISSANT = "core:food-item:croissant",
    STEAK = "core:food-item:steak",
    COOKIES = "core:food-item:cookies",
    SALAD = "core:food-item:salad",
    SUSHI = "core:food-item:sushi",
    PANCAKES = "core:food-item:pancakes",
    SALAMI = "core:food-item:salami",
}

export const foodItemComponent: Component = {
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
};
