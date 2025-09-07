// TODO: consider this file maybe can be defined/ declared within the component

import { createRenderable } from "../libs/render-x";
import { applyUpdates, f } from "../libs/flexbones";
import { HeartTexturesEnum } from "../components/health-bar";

/**
 * Each heart can be in one of three states:
 * 0 - empty: no health in this heart
 * 1 - full: health is enough to render this heart
 * 2 - extra: health is above the max hearts, render as extra
 */
type HeartValue = 0 | 1 | 2;

/**
 * Represents the health bar, displaying a set health ranging from 0 to 12
 * with a maximum of 6 hearts.
 * If health exceeds the maximum hearts, then we start displaying "extra"
 * health converting hearts to "extra" hearts from left to right.
 *
 * Examples:
 * - health 5  -> [1,1,1,1,1,0]
 * - health 7  -> [2,1,1,1,1,1]
 * - health 12 -> [2,2,2,2,2,2]
 */
type HealthBarDisplayState = [
    HeartValue,
    HeartValue,
    HeartValue,
    HeartValue,
    HeartValue,
    HeartValue,
];

function transformHealthToDisplayState(health: number): HealthBarDisplayState {
    if (health > 12) {
        console.error("Health value exceeds maximum of 12");
    }

    const maxHearts = 6;
    const display: HeartValue[] = [];
    for (let i = 0; i < maxHearts; i++) {
        if (health > maxHearts) {
            // For health above maxHearts, fill with 'extra' hearts from left
            display.push(i < health - maxHearts ? 2 : 1);
        } else {
            // For health within maxHearts, fill with 'full' hearts, rest empty
            display.push(i < health ? 1 : 0);
        }
    }
    return display as HealthBarDisplayState;
}

export function loadRenderablesHealthBar() {
    createRenderable(
        "health_bar",
        () => game.state.player.hearts,
        ({ newState }) => {
            const displayState = transformHealthToDisplayState(newState);
            const heartValueTexturesMap = {
                0: HeartTexturesEnum.HEART_DEAD,
                1: HeartTexturesEnum.HEART_ACTIVE,
                2: HeartTexturesEnum.HEART_EXTRA,
            };

            for (let i = 0; i < 6; i++) {
                const heartElement = document.querySelector(
                    `.ff-gamePrint-hearts > :nth-child(${i + 1})`,
                ) as HTMLElement;
                if (!heartElement) {
                    throw new Error(
                        `Health bar heart element .ff-gamePrint-hearts:nth-child(${i + 1}) not found`,
                    );
                }

                const heartTextureId =
                    heartValueTexturesMap[displayState[i] ?? 0];
                const heartTexture = textures.get(heartTextureId);
                if (!heartTexture) {
                    throw new Error(
                        `Couldn't find texture path. Invalid heart texture: ${heartTextureId}`,
                    );
                }

                applyUpdates(
                    f(null, {
                        style: { backgroundImage: `url(${heartTexture})` },
                    }),
                    heartElement,
                );
            }
        },
    );
}
