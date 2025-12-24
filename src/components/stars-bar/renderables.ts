import { type CreateRenderable } from "../../libs/render-x";
import { transformProgressToDisplayState } from "../../utils/stepped-progress-bar";
import { textures } from "../../engines/textures";
import { applyUpdates, f } from "../../libs/flexbones";
import { StarTexturesEnum } from "./textures";

const MAX_STARS = 6 as const;
const MAX_STAR_VALUE = 5 as const;

const STAR_VALUE_TO_TEXTURE = {
    0: StarTexturesEnum.STAR_EMPTY,
    1: StarTexturesEnum.STAR_LEVEL_1,
    2: StarTexturesEnum.STAR_LEVEL_2,
    3: StarTexturesEnum.STAR_LEVEL_3,
    4: StarTexturesEnum.STAR_LEVEL_4,
    5: StarTexturesEnum.STAR_LEVEL_5,
} as const;

export function loadRenderables(createRenderable: CreateRenderable): void {
    createRenderable(
        "stars_bar",
        () => game.state.player.stars as number,
        ({ newState }) => {
            if (newState > MAX_STARS * MAX_STAR_VALUE) {
                throw new Error(
                    `Cannot Render: Player stars value (${newState}) exceeds maximum allowed (${MAX_STARS * MAX_STAR_VALUE})`,
                );
            }

            const displayState = transformProgressToDisplayState(
                newState,
                MAX_STARS,
                MAX_STAR_VALUE,
            );

            for (let i = 0; i < MAX_STARS; i++) {
                const starValue = displayState[i] ?? 0;
                const starTextureId = STAR_VALUE_TO_TEXTURE[starValue];
                const starTextureUrl = `url(${textures.get(starTextureId)})`;

                applyUpdates(
                    f(null, { style: { backgroundImage: starTextureUrl } }),
                    `.ff-gamePrint-stars > :nth-child(${i + 1})`,
                );
            }
        },
    );
}
