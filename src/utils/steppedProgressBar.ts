import type { FixedArray } from "./fixedArray.type";
import type { MaxInt } from "./maxInt.type";

export type SteppedProgressBarDisplayState<
    StepValue extends number,
    StepsAmount extends number,
> = FixedArray<StepValue, StepsAmount>;

/**
 * Utility for creating and managing a stepped-display progress bars,
 * which is useful for states like health, stars, etc.
 *
 * A stepped progress bar is represented as a fixed size array of `stepsAmount` where each entry
 * is a step in the progress bar, the value of the entry would be a number representing the state
 * of that step base on the total progress.
 *
 * For example for a stepped bar with stepsAmount=6 and progress=5:
 * - [1,1,1,1,1,0] (5 full steps and 1 empty step)
 *
 * Stepped bars support being multileveled, which means that progress can exceed stepsAmount,
 * representing any exceeding progress by increasing the level of each step from left to right.
 *
 * For example for a stepped bar with stepsAmount=6 and progress=8:
 * - [2,2,1,1,1,1] (2 full steps at level 2 and 4 full steps at level 1)
 *
 * For example for a stepped bar with stepsAmount=6 and progress=20:
 * - [4,4,3,3,3,3] (2 full steps at level 4 and 4 full steps at level 3)
 *
 * You can optionally benefit of a great type safety by defining the maximum step value, and this will also
 * include runtime checks so progress cannot exceed stepsAmount * maxStepValue.
 */
export function transformProgressToDisplayState<
    MaxStepValue extends number,
    StepsLength extends number,
>(progress: number, stepsLength: StepsLength, maxStepValue?: MaxStepValue) {
    if (progress < 0) {
        throw new Error("Progress must be a non-negative integer");
    }

    if (stepsLength <= 0) {
        throw new Error("Steps amount must be a positive integer");
    }

    if (maxStepValue !== undefined && progress > stepsLength * maxStepValue) {
        throw new Error(
            `Progress (${progress}) exceeds maximum allowed (${stepsLength * maxStepValue}) for the given steps amount (${stepsLength}) and max step value (${maxStepValue})`,
        );
    }

    const display: MaxInt<MaxStepValue>[] = [];

    // Determine the lower and higher level of steps based on total progress
    // For example, progress: 20 -> lower level 3, higher level 4
    //              progress: 7  -> lower level 1, higher level 2
    //              progress: 5  -> lower level 0, higher level 1
    const lowerStepValue = Math.floor(
        progress / stepsLength,
    ) as MaxInt<MaxStepValue>;
    const higherStepValue = Math.ceil(
        progress / stepsLength,
    ) as MaxInt<MaxStepValue>;

    for (let i = 0; i < stepsLength; i++) {
        // define if the current step should use the higher or lower level
        const isHigherStepValue = i < progress % stepsLength;
        display.push(isHigherStepValue ? higherStepValue : lowerStepValue);
    }

    return display as SteppedProgressBarDisplayState<
        MaxInt<MaxStepValue>,
        StepsLength
    >;
}
