// TODO: consider this file maybe can be defined/ declared within the component

import {
    type CreateRenderable,
    type StateChangeSnapshot,
} from "../../libs/render-x";
import { transformProgressToDisplayState } from "../../utils/stepped-progress-bar";
import { textures } from "../../engines/textures";
import {
    type AnimatableController,
    createAnimatable,
    createStatefulAnimation,
} from "../../libs/animate-x";
import type { MaxInt } from "../../utils/max-int.type";

import { HeartTexturesEnum } from "./textures";

const MAX_HEARTS = 6 as const;
const MAX_HEART_VALUE = 2 as const;

// FIXME: createRenderable fix in the future.
export function loadRenderables(createRenderable: CreateRenderable): void {
    createRenderable(
        "health_bar",
        () => game.state.player.hearts as number,
        ({ oldState, newState }) => {
            if (newState > MAX_HEARTS * MAX_HEART_VALUE) {
                throw new Error(
                    `Cannot Render: Player hearts value (${newState}) exceeds maximum allowed (${MAX_HEARTS * MAX_HEART_VALUE})`,
                );
            }

            // TODO: consider making an initialrender signal an official part of the api spec.
            const initialRender = oldState === undefined;

            const oldDisplayState = transformProgressToDisplayState(
                oldState,
                MAX_HEARTS,
                MAX_HEART_VALUE,
            );

            const newDisplayState = transformProgressToDisplayState(
                newState,
                MAX_HEARTS,
                MAX_HEART_VALUE,
            );

            const animations: AnimatableController[] = [];

            for (let i = 0; i < MAX_HEARTS; i++) {
                const newState = newDisplayState[i] ?? 0;
                const oldState = oldDisplayState[i] ?? 0;

                animations.push(
                    createAnimatable(
                        `.ff-gamePrint-hearts > :nth-child(${i + 1})`,
                        /*
                         * TODO: reconsider how to better handle initial renders in animatables. Using it to define animations
                         *  from the inside of the renderable might not be the best approach. Maybe renderer should handle that?
                         */
                        initialRender ? 0 : 300,
                        heartUpdateAnimation,
                        { oldState, newState },
                    ),
                );
            }

            return animations;
        },
    );
}

const HEART_VALUE_TO_TEXTURE = {
    0: HeartTexturesEnum.HEART_DEAD,
    1: HeartTexturesEnum.HEART_ACTIVE,
    2: HeartTexturesEnum.HEART_EXTRA,
} as const;

const HEART_VALUE_TO_OUTLINED_TEXTURE = {
    0: HeartTexturesEnum.HEART_DEAD_OUTLINED,
    1: HeartTexturesEnum.HEART_ACTIVE_OUTLINED,
    2: HeartTexturesEnum.HEART_EXTRA_OUTLINED,
} as const;

const heartUpdateAnimation = createStatefulAnimation<
    StateChangeSnapshot<MaxInt<2>>
>(({ oldState, newState }, { addKeyframe }) => {
    const isUpdated = oldState !== newState;
    const outlinedTextureId = HEART_VALUE_TO_OUTLINED_TEXTURE[newState];
    const highlightTextureId = HeartTexturesEnum.HEART_HIGHLIGHTED;
    const updatedTextureId = HEART_VALUE_TO_TEXTURE[newState];

    /*
     * easing doesn't apply to the transition TO the keyframe it is declared on,
     * instead, applies to the transition FROM keyframe it is declare on TO the
     * next keyframe.
     * For that, if we want to apply an easing from starting state to the first
     * keyframe, we need an easing only keyframe to do the trick.
     */
    addKeyframe({ easing: "linear(0, 1 5%)" });
    // highlight or outline depending on if the state changed
    addKeyframe({
        backgroundImage: `url(${textures.get(isUpdated ? highlightTextureId : outlinedTextureId)})`,
    });
    // Updated new value rendered
    addKeyframe({ backgroundImage: `url(${textures.get(updatedTextureId)})` });
    // Outline highlight
    addKeyframe({ backgroundImage: `url(${textures.get(outlinedTextureId)})` });
    // Back to normal
    addKeyframe({ backgroundImage: `url(${textures.get(updatedTextureId)})` });
});
