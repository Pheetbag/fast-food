/*
 * AnimateX - RenderX extension for handling animations
 *
 * Offers a declarative API for animation creations that can later be
 * applied to any animatable context.
 *
 * implements the WAAPI (Web Animations API) under the hood, to take advantage
 * of low level rendering performance optimizations and built-in features like
 * animation timing control, easing, etc, declaring keyframes.
 *
 * Certain limitations in the WAAPI like not being able to operate on the DOM
 * but only on css styles, are circumvented by allowing to define "computedKeyframes"
 * which are actually not part of the animation itself, but take advantage of
 * the animation timing and watch its progress to trigger the keyframe at the
 * right time.
 *
 * Support for both stateful and stateless animations is provided, to give specific
 * APIs depending on if the animation is reaction to an "state change". (In the
 * future, we can expect certain animations to be triggered by an event) that
 * doesn't need to change state, but does need to provide visual feedback.
 *
 *
 */
import {
    resolveContext,
    type ResolvedXContext,
    type XContext,
} from "./flexbones";
import { getUniqueId } from "../utils/get-unique-id";
import { resolveValueGetter, type ValueGetter } from "../utils/value-getter";

type ResolvedAnimation = {
    keyframes: Keyframe[];
    computedKeyframes: Map<number, ComputeKeyframeFn[]>;
    hasPendingComputedKeyframes: () => boolean;
};

type Animatable = {
    id: string;
    context: ResolvedXContext;
    duration: number;
    animation: ResolvedAnimation;
    /*
     * Lifecycle hooks for the animation
     */
    onFinish?: () => void;
    /*
     * General configs
     */
    useCommitStyles: boolean;
    /*
     * Defines when the animatable is animating, and
     * all properties related to the running animation
     */
    isRunning: boolean;
    nativeAnimations: {
        animation: Animation;
        context: ResolvedXContext[number];
    }[];
    // usually the first generated animation, use to follow the progress
    // of all other animations.
    animationLifecycle?: Animation;
};

const AnimatableRefSymbol = Symbol("AnimatableRef");

export type AnimatableController = {
    [AnimatableRefSymbol]: Animatable;
    onFinish: (cb: () => void) => void;
    useCommitStyles: (value: boolean) => void;
};

const animatables = new Map<string, Animatable>();
const runningAnimatables = new Map<string, Animatable>();

type AnimatableKeyframe = Omit<Keyframe, "offset">;
/**
 * Register a regular keyframe, that will be executed by the WAAPI engine.
 * If no offset is provided, the keyframe will be added at the end of the
 * keyframes list, and the WAAPI engine will distribute the offsets evenly.
 * If an offset is provided, it must be a number between 0 and 1, representing
 * the percentage of the animation duration when the keyframe should be applied.
 * Offsets must be provided in ascending order, otherwise an error will be thrown
 * during the animation resolution phase.
 */
type AddKeyframe = ((keyframe: AnimatableKeyframe) => void) &
    ((offset: number, keyframe: AnimatableKeyframe) => void);

/**
 * Adds a keyframe that will be computed during the animation running time. This requires a
 * offset to define when to do so.
 * This keyframe is called at runtime, so you can resolve whatever is needed at any point in time.
 * attributes of the callback tbd
 */
type ComputeKeyframeFn = (computedAnimatable: ResolvedXContext[number]) => void;
type AddComputedKeyframe = (
    offset: number,
    computeKeyframeFn: ComputeKeyframeFn,
) => void;

/*
 * Animate function resolution. For the creation of the animation frames
 */
type AnimateFns = {
    addKeyframe: AddKeyframe;
    addComputedKeyframe: AddComputedKeyframe;
};
type StatefulAnimateFn<T> = (state: T, builder: AnimateFns) => void;
type StatelessAnimateFn = (builder: AnimateFns) => void;

function _resolveAnimateFn<T>(
    animateFn: StatefulAnimateFn<T>,
    state: ValueGetter<T>,
): ResolvedAnimation;
function _resolveAnimateFn(animateFn: StatelessAnimateFn): ResolvedAnimation;
function _resolveAnimateFn<T>(
    animateFn: StatefulAnimateFn<T> | StatelessAnimateFn,
    state?: ValueGetter<T>,
): ResolvedAnimation {
    const keyframes: Keyframe[] = [];
    let lastOffset: number;

    const addKeyframe: AddKeyframe = (
        offsetOrKeyframe: number | AnimatableKeyframe,
        keyframe?: AnimatableKeyframe,
    ): void => {
        const offset =
            typeof offsetOrKeyframe === "number" ? offsetOrKeyframe : null;
        keyframe =
            typeof offsetOrKeyframe === "number" ? keyframe : offsetOrKeyframe;

        const resolvedKeyframe: Keyframe = { ...keyframe };
        if (offset !== null) {
            if (offset < 0 || offset > 1) {
                throw new Error(
                    `Keyframe offset must be between 0 and 1, got ${offset}`,
                );
            }

            if (lastOffset && offset < lastOffset) {
                throw new Error(
                    `Keyframe offsets must be provided in ascending order, got ${offset} after ${lastOffset}`,
                );
            }
            lastOffset = offset;
            resolvedKeyframe.offset = offset;
        }

        keyframes.push(resolvedKeyframe);
    };

    const computedKeyframes = new Map<number, ComputeKeyframeFn[]>();

    const addComputedKeyframe: AddComputedKeyframe = (
        offset: number,
        computedKeyframeFn: ComputeKeyframeFn,
    ): void => {
        if (offset < 0 || offset > 1) {
            throw new Error(
                `Computed keyframe offset must be between 0 and 1, got ${offset}`,
            );
        }

        if (!computedKeyframes.has(offset)) {
            computedKeyframes.set(offset, []);
        }

        computedKeyframes.get(offset)?.push(computedKeyframeFn);
    };

    // state allow us to differentiate between stateful and stateless animations
    if (state) {
        animateFn = animateFn as StatefulAnimateFn<T>;
        animateFn(resolveValueGetter(state), {
            addKeyframe,
            addComputedKeyframe,
        });
    } else {
        animateFn = animateFn as StatelessAnimateFn;
        animateFn({ addKeyframe, addComputedKeyframe });
    }

    return {
        keyframes,
        computedKeyframes,
        hasPendingComputedKeyframes: () => {
            return computedKeyframes.size > 0;
        },
    };
}

/*
 * Animation types and APIs
 */
export enum AnimationType {
    STATEFUL,
    STATELESS,
}

type StatefulAnimation<T> = {
    type: AnimationType.STATEFUL;
    animateFn: StatefulAnimateFn<T>;
};

type StatelessAnimation = {
    type: AnimationType.STATELESS;
    resolvedAnimation: ResolvedAnimation;
};

export function createStatefulAnimation<T>(
    animateFn: StatefulAnimateFn<T>,
): StatefulAnimation<T> {
    return {
        type: AnimationType.STATEFUL,
        animateFn: animateFn,
    };
}

export function createStatelessAnimation(
    animateFn: StatelessAnimateFn,
): StatelessAnimation {
    return {
        type: AnimationType.STATELESS,
        resolvedAnimation: _resolveAnimateFn(animateFn),
    };
}

export function createAnimatable<T>(
    context: XContext,
    duration: number,
    animation: StatefulAnimation<T>,
    state: ValueGetter<T>,
): AnimatableController;
export function createAnimatable(
    context: XContext,
    duration: number,
    animation: StatelessAnimation,
): AnimatableController;
export function createAnimatable<T>(
    context: XContext,
    duration: number,
    animation: StatefulAnimation<T> | StatelessAnimation,
    state?: ValueGetter<T>,
): AnimatableController {
    const contextElements = resolveContext(context);

    if (!contextElements) {
        console.warn(
            `No elements found for context: ${String(context)} to create animatable.`,
        );
    }

    let resolvedAnimation;

    if (animation.type === AnimationType.STATEFUL) {
        if (!state) {
            throw new Error("State must be provided for stateful animations");
        }
        // the entire animation should operate on a snapshot of it's state
        state = structuredClone(state);
        resolvedAnimation = _resolveAnimateFn(animation.animateFn, state);
    } else {
        resolvedAnimation = animation.resolvedAnimation;
    }

    const animatable: Animatable = {
        id: getUniqueId(),
        context: contextElements,
        duration,
        animation: resolvedAnimation,
        isRunning: false,
        nativeAnimations: [],
        useCommitStyles: false,
    };

    animatables.set(animatable.id, animatable);

    return {
        [AnimatableRefSymbol]: animatable,
        onFinish: (cb) => (animatable.onFinish = cb),
        useCommitStyles: (value) => {
            if (animatable.isRunning) {
                console.error(
                    `useCommitStyles: ${JSON.stringify(value)} cannot be apply on an animation already running`,
                );
                return;
            }

            animatable.useCommitStyles = value;
        },
    };
}

function animate(animatable: Animatable) {
    if (
        !animatable.animation.keyframes &&
        !animatable.animation.computedKeyframes
    ) {
        console.warn(
            "No keyframes or computed keyframes defined for animation",
        );
        return;
    }

    if (!animatable.context) {
        // TODO: define if we might have animations without a context, for computed only
        //      animations.
        console.warn("No context found to attach animation");
        return;
    }

    for (const contextElement of animatable.context) {
        const animation = contextElement.animate(
            animatable.animation.keyframes,
            {
                duration: animatable.duration,
                fill: animatable.useCommitStyles ? "forwards" : "none",
            },
        );
        animatable.nativeAnimations.push({
            animation,
            context: contextElement,
        });

        if (!animatable.animationLifecycle) {
            animatable.animationLifecycle = animation;
        }
    }

    for (const nativeAnimation of animatable.nativeAnimations) {
        nativeAnimation.animation.addEventListener("finish", () => {
            // FIXME: this trigger right before the next tick happens to
            //          do the final iteration, this removal should be schedule, and be execute by the next
            //          iteration.
            //          Another cleaner alternative to a nextTick() api, is to wrap the basic event listeners
            //          of these api in equivalents that take into account that computedKeyframe progress
            //          are gameloop dependent and not animation dependent, even if the API makes it look like it is.
            //runningAnimatables.delete(animatable.id);
            if (animatable.useCommitStyles) {
                nativeAnimation.animation.commitStyles();
                nativeAnimation.animation.cancel();
            }

            if (animatable.onFinish) {
                animatable.onFinish();
            }
        });
    }
}

export function animateAll() {
    for (const [id, animatable] of animatables) {
        animatables.delete(id);

        animate(animatable);

        runningAnimatables.set(id, animatable);
        animatable.isRunning = true;
    }
}

export function animateAllComputed() {
    for (const [id, animatable] of runningAnimatables) {
        // remove un-schedule animatables
        // FIXME: implement a nextTick() function so this could be schedule
        //      in the proper place (onfinish callback).
        if (!animatable.isRunning) {
            runningAnimatables.delete(id);
        }

        if (!animatable.animation.hasPendingComputedKeyframes()) continue;
        for (const [offset, computedKeyframes] of animatable.animation
            .computedKeyframes) {
            // if offset is equal or over current progress of the native animation
            // run the keyframes for that offset.
            // @ts-expect-error overallProgress is an actual available attr on the WAAPI spec
            if (
                (offset <=
                    animatable.animationLifecycle.overallProgress) as number
            ) {
                for (const { context } of animatable.nativeAnimations) {
                    computedKeyframes.forEach((computedKeyframe) =>
                        computedKeyframe(context),
                    );
                }

                // remove this offset now
                animatable.animation.computedKeyframes.delete(offset);
            }
        }
    }
}
