import { addTexture as addTextureFn } from "../../engines/textures";

export enum StarTexturesEnum {
    STAR_EMPTY = "core:stars:empty",
    STAR_HIGHLIGHTED = "core:stars:highlighted",

    STAR_LEVEL_1 = "core:stars:level:1",
    STAR_LEVEL_2 = "core:stars:level:2",
    STAR_LEVEL_3 = "core:stars:level:3",
    STAR_LEVEL_4 = "core:stars:level:4",
    STAR_LEVEL_5 = "core:stars:level:5",

    STAR_RAINBOW_0 = "core:stars:rainbow:0",
    STAR_RAINBOW_1 = "core:stars:rainbow:1",
    STAR_RAINBOW_2 = "core:stars:rainbow:2",
    STAR_RAINBOW_3 = "core:stars:rainbow:3",
    STAR_RAINBOW_4 = "core:stars:rainbow:4",
    STAR_RAINBOW_5 = "core:stars:rainbow:5",
}

export function loadTextures(addTexture: typeof addTextureFn) {
    addTexture(StarTexturesEnum.STAR_EMPTY, "assets/gameGeneral_ico/star0.png");
    addTexture(
        StarTexturesEnum.STAR_HIGHLIGHTED,
        "assets/gameGeneral_ico/starWhite.png",
    );

    addTexture(
        StarTexturesEnum.STAR_LEVEL_1,
        "assets/gameGeneral_ico/star1_black.png",
    );
    addTexture(
        StarTexturesEnum.STAR_LEVEL_2,
        "assets/gameGeneral_ico/star2_black.png",
    );
    addTexture(
        StarTexturesEnum.STAR_LEVEL_3,
        "assets/gameGeneral_ico/star3_black.png",
    );
    addTexture(
        StarTexturesEnum.STAR_LEVEL_4,
        "assets/gameGeneral_ico/star4_black.png",
    );
    addTexture(
        StarTexturesEnum.STAR_LEVEL_5,
        "assets/gameGeneral_ico/star5_black.png",
    );

    addTexture(
        StarTexturesEnum.STAR_RAINBOW_0,
        "assets/gameGeneral_ico/starWhite_Rainbow0.png",
    );
    addTexture(
        StarTexturesEnum.STAR_RAINBOW_1,
        "assets/gameGeneral_ico/starWhite_Rainbow1.png",
    );
    addTexture(
        StarTexturesEnum.STAR_RAINBOW_2,
        "assets/gameGeneral_ico/starWhite_Rainbow2.png",
    );
    addTexture(
        StarTexturesEnum.STAR_RAINBOW_3,
        "assets/gameGeneral_ico/starWhite_Rainbow3.png",
    );
    addTexture(
        StarTexturesEnum.STAR_RAINBOW_4,
        "assets/gameGeneral_ico/starWhite_Rainbow4.png",
    );
    addTexture(
        StarTexturesEnum.STAR_RAINBOW_5,
        "assets/gameGeneral_ico/starWhite_Rainbow5.png",
    );
}
