/*
 * ReactX is DOM event listener library intended to be use
 * together with RenderX and AnimateX.
 *
 * Library is the replacement of pre-existing react.js library,
 * but redesigned as a thin wrapper around the actual addEventListener
 * API, so we can hook multiple event listeners to the same element,
 * and have space to add features in the future if deemed necessary.
 *
 * One candidate feature is automatic unbinding of events when
 * an element is removed from the DOM, but this needs further refinement
 * of the lifecycle of the elements in the DOM.
 */

import {
    resolveContext,
    type ResolvedXContext,
    type XContext,
} from "./flexbones";
import { getUniqueId } from "../utils/get-unique-id";

/**
 * ReactiveX support some custom events, that are not built-in
 * and might have custom behaviors, those events are prefixed with an "@"
 */
interface ReactiveEventMap extends HTMLElementEventMap {
    /*
     * This event is a wrapper around mouseenter, mouseleave and
     * mousemove to emulate a hover effect, the listener will be triggered
     * for the three type of events.
     */
    "@hover": MouseEvent;
}
type ReactiveEvent = keyof ReactiveEventMap;

type ReactiveListener<T extends ReactiveEvent> = (
    this: HTMLElement,
    ev: ReactiveEventMap[T],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => any;

type Reactive<T extends ReactiveEvent> = {
    id: string;
    context: ResolvedXContext;
    unresolvedContext: XContext;
    event: T;
    listeners: Map<string, ReactiveListener<T>>;
    addListener: (listener: ReactiveListener<T>) => string;
    removeListener: (id: string) => boolean;
};

export function createReactive<T extends ReactiveEvent>(
    context: XContext,
    event: T,
    listener?: ReactiveListener<T>,
): Reactive<T> {
    const reactive: Reactive<T> = {
        id: getUniqueId(),
        context: resolveContext(context),
        unresolvedContext: context,
        event: event,
        listeners: new Map<string, ReactiveListener<T>>(),
        addListener(listener) {
            const id = getUniqueId();
            this.listeners.set(id, listener);
            return id;
        },
        removeListener(id: string) {
            return this.listeners.delete(id);
        },
    };

    if (listener) {
        reactive.addListener(listener);
    }

    return reactive;
}
