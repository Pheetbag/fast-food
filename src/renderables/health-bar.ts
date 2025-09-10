// TODO: consider this file maybe can be defined/ declared within the component

import { createRenderable } from "../libs/render-x";
import { applyUpdates, f } from "../libs/flexbones";
import { HeartTexturesEnum } from "../components/health-bar";
import { transformProgressToDisplayState } from "../utils/stepped-progress-bar";
import { textures } from "../engines/textures";

const MAX_HEARTS = 6 as const;
const MAX_HEART_VALUE = 2 as const;

const HEART_VALUE_TO_TEXTURE = {
    0: HeartTexturesEnum.HEART_DEAD,
    1: HeartTexturesEnum.HEART_ACTIVE,
    2: HeartTexturesEnum.HEART_EXTRA,
} as const;

export function loadRenderablesHealthBar() {
    createRenderable(
        "health_bar",
        () => game.state.player.hearts as number,
        ({ newState }) => {
            if (newState > MAX_HEARTS * MAX_HEART_VALUE) {
                throw new Error(
                    `Cannot Render: Player hearts value (${newState}) exceeds maximum allowed (${MAX_HEARTS * MAX_HEART_VALUE})`,
                );
            }

            const displayState = transformProgressToDisplayState(
                newState,
                MAX_HEARTS,
                MAX_HEART_VALUE,
            );

            for (let i = 0; i < MAX_HEARTS; i++) {
                const heartValue = displayState[i] ?? 0;
                const heartTextureId = HEART_VALUE_TO_TEXTURE[heartValue];
                const heartTextureUrl = `url(${textures.get(heartTextureId)})`;

                applyUpdates(
                    f(null, { style: { backgroundImage: heartTextureUrl } }),
                    `.ff-gamePrint-hearts > :nth-child(${i + 1})`,
                );
            }
        },
    );
}
