type XElementAttrs =
    | {
          style?: Partial<CSSStyleDeclaration>;
      }
    | Record<string, string | number | boolean | undefined>;

type XElementLike = string | number | boolean | XElement;
type XElementChildren = XElementLike[];

const isXElementSymbol = Symbol("isXElement");

export type XElement = {
    [isXElementSymbol]: true;
    tagName: string;
    children?: XElementChildren | undefined;
    attrs?: XElementAttrs | undefined;
};

type XElementUpdates = Omit<XElement, "tagName">;

export function isXElement(value: unknown): value is XElement {
    return (
        value !== null && typeof value === "object" && isXElementSymbol in value
    );
}

function _createElementHtmlNode(
    xElement: Exclude<XElementLike, XElement>,
): Text;
function _createElementHtmlNode(xElement: XElement): HTMLElement;
function _createElementHtmlNode(xElement: XElementLike): HTMLElement | Text;
function _createElementHtmlNode(xElement: XElementLike): HTMLElement | Text {
    if (!isXElement(xElement)) {
        return document.createTextNode(String(xElement));
    }

    return document.createElement(xElement.tagName);
}

function _createElementHtmlTree(xElement: XElementLike): Element | Text {
    // it's a text node, no further steps
    if (!isXElement(xElement)) {
        return _createElementHtmlNode(xElement);
    }

    const elementHtml = _createElementHtmlNode(xElement);

    if (xElement.attrs) {
        _applyElementAttrsToHtml(xElement.attrs, elementHtml);
    }

    for (const child of xElement.children ?? []) {
        const childHtml = _createElementHtmlTree(child);
        elementHtml.appendChild(childHtml);
    }

    return elementHtml;
}

function _applyElementAttrsToHtml(
    attrs: NonNullable<XElementUpdates["attrs"]>,
    htmlElement: HTMLElement | Element,
): void {
    // apply general attributes that don't need special handling
    const pureAttrs: Omit<NonNullable<XElementUpdates["attrs"]>, "style"> = {
        ...attrs,
        style: undefined,
    };

    Object.entries(pureAttrs).forEach(([key, value]) => {
        if (key in ["style"]) return; // style is handled separately

        if (value === false || value === undefined) {
            htmlElement.removeAttribute(key);
        } else {
            htmlElement.setAttribute(key, String(value));
        }
    });

    if (attrs.style) {
        Object.entries(attrs.style).forEach(([styleKey, styleValue]) => {
            if (styleValue !== undefined) {
                // @ts-expect-error CSSStyleDeclaration is not indexable with string for typescript
                htmlElement.style[styleKey] = styleValue;
            }
        });
    }
}

type XElementChildrenArg = XElementChildren | XElementLike;

/**
 * Helper function to create an XElement or XElementDescription.
 *
 * The syntax for this function is heavily inspired by vue.js h() function.
 *
 * Usage examples for XElement:
 *
 * // full syntax with attributes and children
 *
 * f('div', { id: 'my-div', class: 'container' }, [
 *     f('h1', 'Hello World'),
 *     f('p', { style: { color: 'red' } }, 'This is a paragraph')
 * ]);
 *
 *
 * // witt no attributes and a text children
 *
 * f('span', 'Just a simple span with text');
 *
 *
 * // with no attributes and multiple children
 *
 * f('ul', [
 *     f('li', 'Item 1'),
 *     f('li', 'Item 2'),
 *     f('li', 'Item 3')
 * ]);
 *
 * With this function you can also create an XElementUpdates, which is
 * a partial definition of changes to apply to an existing HTMLElement. You
 * can update any existing attributes, or remove them by passing undefined
 * to the attribute value. You can also do partial updates to the styles.
 * Children are updated with a full replacement, so if you want to remove
 * all children, just pass an empty array.
 *
 * Usage examples for XElementUpdates:
 *
 * // update the class and style of an existing element
 *
 * f(null, { class: 'new-class', style: { color: 'blue' } });
 *
 *
 * // remove the id attribute and update the style
 *
 * f(null, { id: undefined, style: { fontSize: '20px' } });
 *
 *
 * // replace all children with new ones:
 *
 * f(null, [
 *     f('p', 'New child paragraph'),
 *     f('button', 'Click Me')
 * ]);
 *
 * Check {@link applyUpdates} to read more on how updates are applied to html elements.
 */
export function f(
    tagName: string,
    attrs?: XElementAttrs,
    children?: XElementChildrenArg,
): XElement;
export function f(tagName: string, children?: XElementChildrenArg): XElement;
export function f(
    tagName: null,
    attrs: XElementAttrs,
    children?: XElementChildrenArg,
): XElementUpdates;
export function f(
    tagName: null,
    children: XElementChildrenArg,
): XElementUpdates;
export function f(
    tagName: string | null,
    arg2?: XElementAttrs | XElementChildrenArg,
    arg3?: XElementChildrenArg,
): XElement | XElementUpdates {
    let attrs: XElementAttrs | undefined = undefined;
    let children: XElementChildren | undefined = undefined;

    if (
        arg2 &&
        typeof arg2 === "object" &&
        !Array.isArray(arg2) &&
        !(isXElementSymbol in arg2)
    ) {
        attrs = arg2;

        if (arg3) {
            children = Array.isArray(arg3) ? arg3 : [arg3];
        }
    } else if (arg2) {
        children = Array.isArray(arg2) ? arg2 : [arg2];
    }

    // transform input data to the internal XElement structure
    const xElementDescription: XElementUpdates = {
        [isXElementSymbol]: true,
        attrs,
        children,
    };

    if (tagName !== null) {
        return {
            ...xElementDescription,
            tagName,
        } as XElement;
    }

    return xElementDescription;
}

type XContext =
    | HTMLElement
    | HTMLElement[]
    | Element
    | NodeListOf<Element>
    | string;
type ResolvedXContext = Element[] | HTMLElement[] | NodeListOf<Element>;

export function resolveContext(context: XContext): ResolvedXContext {
    let contextElements: ResolvedXContext;

    if (typeof context === "string") {
        contextElements = document.querySelectorAll(context);
    } else {
        contextElements =
            context instanceof HTMLElement || context instanceof Element
                ? [context]
                : context;
    }

    if (contextElements.length === 0) {
        console.warn(`No elements found for context: ${String(context)}`);
    }

    return contextElements;
}

/**
 * Appends the XElement to the end of the context content.
 */
export function appendToContent(xElement: XElement, context: XContext): void {
    const contextElements = resolveContext(context);

    for (const context of contextElements) {
        context.appendChild(_createElementHtmlTree(xElement));
    }
}

/**
 * Prepends the XElement to the start of the context content.
 */
export function peprendToContent(xElement: XElement, context: XContext): void {
    const contextElements = resolveContext(context);

    for (const context of contextElements) {
        context.insertBefore(
            _createElementHtmlTree(xElement),
            context.firstChild,
        );
    }
}

/**
 * Clears the context content and inserts the XElement.
 */
export function setToContent(xElement: XElement, context: XContext): void {
    const contextElements = resolveContext(context);

    for (const context of contextElements) {
        context.innerHTML = "";
        context.appendChild(_createElementHtmlTree(xElement));
    }
}

/**
 * Updates the context element to match the provided XElement. Allows to
 * apply partial updates to an existing DOM element, in any of its attributes.
 *
 * This function expose the following behaviors for each key of the XElement:
 * - {@link XElement.attrs.style} - Styles will be updated to match the new definition. The update is partial
 *                            which means it will only apply to the defined styles and any other pre-existing
 *                            one will be left untouched. If you want to remove a style, set it to null or an empty
 *                            string, as defined in https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style.
 * - {@link XElement.children} - If children array is defined we will remove all childrens from the context and
 *                               replace them with the new ones. This can be used to remove all children from the context
 *                               by setting it to an empty array.
 * - {@link XElement.attrs} - When provided will update the corresponding attribute with the new value. The update is
 *                            partial which means it will only apply to the defined attributes and any other pre-existing
 *                            one will be left untouched. If you want to remove an attribute, set it to undefined.
 */
export function applyUpdates(
    updatesDefinition: XElementUpdates,
    context: XContext,
): void {
    const contextElements = resolveContext(context);

    for (const context of contextElements) {
        if (updatesDefinition.attrs) {
            _applyElementAttrsToHtml(updatesDefinition.attrs, context);
        }

        if (updatesDefinition.children) {
            context.innerHTML = "";
            updatesDefinition.children.forEach((child) => {
                context.appendChild(_createElementHtmlTree(child));
            });
        }
    }
}
