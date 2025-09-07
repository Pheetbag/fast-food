import type { Component } from "./component";

export enum HeartTexturesEnum {
    HEART_HIGHLIGHTED = "core:hearts:highlighted",

    HEART_DEAD = "core:hearts:dead",
    HEART_DEAD_OUTLINED = "core:hearts:dead:outlined",
    HEART_ACTIVE = "core:hearts:active",
    HEART_ACTIVE_OUTLINED = "core:hearts:active:outlined",
    HEART_EXTRA = "core:hearts:extra",
    HEART_EXTRA_OUTLINED = "core:hearts:extra:outlined",
}

export const healthBarComponent: Component = {
    loadTextures(addTexture) {
        addTexture(
            HeartTexturesEnum.HEART_HIGHLIGHTED,
            "assets/gameGeneral_ico/heart_On.png",
        );

        addTexture(
            HeartTexturesEnum.HEART_DEAD,
            "assets/gameGeneral_ico/heart_dead.png",
        );
        addTexture(
            HeartTexturesEnum.HEART_DEAD_OUTLINED,
            "assets/gameGeneral_ico/heart_dead_On.png",
        );

        addTexture(
            HeartTexturesEnum.HEART_ACTIVE,
            "assets/gameGeneral_ico/heart_active.png",
        );
        addTexture(
            HeartTexturesEnum.HEART_ACTIVE_OUTLINED,
            "assets/gameGeneral_ico/heart_active_On.png",
        );

        addTexture(
            HeartTexturesEnum.HEART_EXTRA,
            "assets/gameGeneral_ico/heart_extra.png",
        );
        addTexture(
            HeartTexturesEnum.HEART_EXTRA_OUTLINED,
            "assets/gameGeneral_ico",
        );
    },
};
