import { createRenderable, type StateChangeSnapshot } from "../libs/render-x";
import { createAnimatable, createStatefulAnimation } from "../libs/animate-x";

// TODO: a renderable without a matching component? keep that in mind if renderables will be integrated
//       to the component itself.
export function loadRenderablesMoney(): void {
    createRenderable(
        "money",
        () => game.state.player.money,
        (state) => {
            // TODO: consider making an initialrender signal an official part of the api spec.
            const initialRender = state.oldState === undefined;
            return createAnimatable(
                ".ff-gamePrint-money > :first-child",
                initialRender ? 0 : 300,
                moneyChangeAnimation,
                state,
            );
        },
    );
}

const moneyChangeAnimation = createStatefulAnimation<
    StateChangeSnapshot<number>
>(({ oldState = 0, newState }, { addKeyframe, addComputedKeyframe }) => {
    const color = newState < 0 ? "#D83930" : "#fff";
    addKeyframe(1, { color });

    const moneyDifferential = Math.abs(oldState - newState);
    const keyframesAmount = moneyDifferential <= 100 ? moneyDifferential : 100;
    const offsetStep = 1 / keyframesAmount;
    const moneyIterationIncrement = (newState - oldState) / keyframesAmount;
    for (let i = 0; i <= keyframesAmount; i++) {
        // final keyframe should be exactly the new state
        if (i === keyframesAmount) {
            addComputedKeyframe(1, (animatable) => {
                animatable.innerHTML = newState.toString();
            });
            break;
        }

        const offset = i * offsetStep;
        const amount = Math.round(oldState + i * moneyIterationIncrement);

        addComputedKeyframe(offset, (animatable) => {
            animatable.textContent = amount.toString();
        });
    }
});
