/**
 * Representation of an HTML element in the flexbones structure
 *
 * @property x - The tag name of the HTML element (e.g., 'div', 'span').
 * @property [_children] - An optional array of child elements or text nodes.
 * @property [style] - inline css styles definition, with support for types.
 * @property [key] - Additional attributes for the HTML element (e.g., id, src, type...).
 */

type XElement = {
    x: string;
    _children?: XMapEntry[];
    style?: Partial<CSSStyleDeclaration>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
};

/**
 * An entry in the flexbones structure, which can be either an XElement or a primitive value that will be parsed as
 * a text node.
 */
type XMapEntry = XElement | string | number | boolean;

/**
 * Represents an HTML tree where each entry can be parsed to some element or a text node, for elements
 * syntax refer to {@see XElement}.
 *
 * Syntax example:
 *
 * [
 *    {x: 'div'},
 *    'hello world example',
 *    {x: 'h1', _children: ['Lorem Ipsum]},
 *    {x: 'header', _children: [ {x: 'h2', class: 'text-primary'}  ]}
 * ]
 *
 * represents the html:
 *
 * <div></div>
 * hello world example
 * <h1>Lorem Ipsum</h1>
 * <header>
 *     <h2 class="text-primary"></h2>
 * </header>
 */
type XMap = XMapEntry[];

const xPrimitiveMapKey = Symbol("xMapKey");
const xPrimitiveFragmentKey = Symbol("xFragmentKey");

/**
 * The resulting flexbones primitive value after parsing an XMap into a DocumentFragment.
 *
 * this primitive serve as a template to then apply it with any of the available actions, it is reusable,
 * which means you can apply the same primitive in multiple actions without side effects.
 *
 *
 * @property xPrimitiveMapKey - The original XMap that was parsed.
 * @property xPrimitiveFragmentKey - Getter for the resulting DocumentFragment containing the created HTML elements.
 *                                   the creation fo this fragment is lazy, so it will only be created the first time
 *                                   this property is accessed.
 */
type XPrimitive = {
    [xPrimitiveMapKey]: XMap;
    [xPrimitiveFragmentKey]: DocumentFragment;
};

function isXElement(entry: XMapEntry): entry is XElement {
    return typeof entry === "object";
}

/**
 * Receive an HtmlElement and takes care of applying all the state declared in the XElement to that
 * HtmlElement. Regardless of the element being created for the first time, or being updated.
 *
 * This means that internally it will set/remove attributes, styles, etc to match the XElement definition.
 */
function applyXElementToHtml(
    xMapEntry: Omit<XElement, "x">,
    htmlElement: HTMLElement | Element,
): void {
    // apply general attributes
    Object.entries(xMapEntry).forEach(([key, value]) => {
        if (["x", "_children", "style"].includes(key)) return;

        if (value !== undefined) {
            htmlElement.setAttribute(key, value);
        } else {
            htmlElement.removeAttribute(key);
        }
    });

    // apply styles
    if (xMapEntry.style) {
        Object.entries(xMapEntry.style).forEach(([styleKey, styleValue]) => {
            if (styleValue !== undefined) {
                // @ts-expect-error CSSStyleDeclaration is not indexable with string for typescript
                htmlElement.style[styleKey] = styleValue;
            }
        });
    }
}

function createXMapEntryHtml(xMapEntry: XMapEntry): HTMLElement | Text {
    if (!isXElement(xMapEntry)) {
        return document.createTextNode(String(xMapEntry));
    }

    const htmlElement = document.createElement(xMapEntry.x);

    applyXElementToHtml(xMapEntry, htmlElement);

    return htmlElement;
}

function parseXMapEntry(
    xMapEntry: XMapEntry,
    parentHtml: Element | DocumentFragment,
): void {
    const htmlElement = createXMapEntryHtml(xMapEntry);

    // handles childrens management
    if (isXElement(xMapEntry) && xMapEntry._children) {
        xMapEntry._children.forEach((child) => {
            // when item is xObject, element is HTMLElement
            parseXMapEntry(child, htmlElement as HTMLElement);
        });
    }

    parentHtml.appendChild(htmlElement);
}

export function createPrimitive(xMap: XMap | XMapEntry): XPrimitive {
    let rootFragment: DocumentFragment;

    return {
        [xPrimitiveMapKey]: structuredClone(
            Array.isArray(xMap) ? xMap : [xMap],
        ),
        get [xPrimitiveFragmentKey]() {
            const xMap = this[xPrimitiveMapKey];

            if (!rootFragment) {
                rootFragment = document.createDocumentFragment();
                xMap.forEach((xItem) => parseXMapEntry(xItem, rootFragment));
            }

            return rootFragment;
        },
    };
}

type XContext = HTMLElement | HTMLElement[] | NodeListOf<Element> | string;
type ResolvedXContext = HTMLElement[] | NodeListOf<Element>;

export function resolveContext(context: XContext): ResolvedXContext {
    if (typeof context === "string") {
        return document.querySelectorAll(context);
    } else if (context instanceof HTMLElement) {
        return [context];
    } else {
        return context;
    }
}

/**
 * Appends the primitive to the end of the context content.
 */
export function appendToContent(
    primitive: XPrimitive,
    context: XContext,
): void {
    const contextElements = resolveContext(context);

    contextElements.forEach((context) => {
        const fragmentElement =
            primitive[xPrimitiveFragmentKey].cloneNode(true);
        context.appendChild(fragmentElement);
    });
}

/**
 * Prepends the primitive to the start of the context content.
 */
export function peprendToContent(
    primitive: XPrimitive,
    context: XContext,
): void {
    const contextElements = resolveContext(context);

    contextElements.forEach((context) => {
        const fragmentElement =
            primitive[xPrimitiveFragmentKey].cloneNode(true);
        context.insertBefore(fragmentElement, context.firstChild);
    });
}

/**
 * Clears the context content and inserts the primitive.
 */
export function setToContent(primitive: XPrimitive, context: XContext): void {
    const contextElements = resolveContext(context);

    contextElements.forEach((context) => {
        context.innerHTML = "";
        const fragmentElement =
            primitive[xPrimitiveFragmentKey].cloneNode(true);
        context.appendChild(fragmentElement);
    });
}

/**
 * Updates the context element to match the provided XElement. Allows to
 * apply partial updates to an existing DOM element, in any of its attributes.
 *
 * This function expose the following behaviors for each key of the XElement:
 * - {@link XElement.x} - Not allowed. The tag name of the element cannot be changed during an update.
 * - {@link XElement.style} - Styles will be updated to match the new definition. The update is partial
 *                            which means it will only apply to the defined styles and any other pre-existing
 *                            one will be left untouched. If you want to remove a style, set it to null or an empty
 *                            string, as defined in https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style.
 * - {@link XElement._children} - If children array is defined we will remove all childrens from the context and
 *                               replace them with the new ones. This can be used to remove all children from the context
 *                               by setting it to an empty array.
 * - Any other key - These will be treated as attributes and when provided will update the corresponding attribute
 *                   with the new value. The update is partial which means it will only apply to the defined attributes
 *                   and any other pre-existing one will be left untouched. If you want to remove an attribute, set it to
 *                   undefined.
 */
export function applyUpdates(
    updatesDefinition: Omit<XElement, "x">,
    context: XContext,
): void {
    const contextElements = resolveContext(context);

    contextElements.forEach((context) => {
        applyXElementToHtml(updatesDefinition, context);

        // handle children updates clearing existing children and add the new ones
        if (updatesDefinition._children) {
            context.innerHTML = "";
            updatesDefinition._children.forEach((child: XMapEntry) => {
                parseXMapEntry(child, context);
            });
        }
    });
}
