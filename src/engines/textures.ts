/**
 * For the purpose of having a unique way of registering and accessing textures in the game,
 * we use a container that maps unique ids to texture urls.
 * This serve the need of all textures being available at game loading to be preloaded and cached
 * and in the future be able to overwrite textures without altering any game mechanics.
 */
const texturesContainer = new Map();

/**
 * Container for all game textures registered in the game.
 *
 * This is a read-only view of the texturesContainer to prevent direct manipulation. For adding or removing
 * textures refer to the {@link addTexture} and {@link removeTexture} functions instead.
 */
const readonlyTexturesContainer: ReadonlyMap<
    string | null | undefined,
    string
> = Object.freeze({
    [Symbol.iterator]:
        texturesContainer[Symbol.iterator].bind(texturesContainer),
    entries: texturesContainer.entries.bind(texturesContainer),
    forEach: texturesContainer.forEach.bind(texturesContainer),
    keys: texturesContainer.keys.bind(texturesContainer),
    values: texturesContainer.values.bind(texturesContainer),
    get: texturesContainer.get.bind(texturesContainer),
    has: texturesContainer.has.bind(texturesContainer),
    get size() {
        return texturesContainer.size;
    },
});

/**
 * Add a texture to the container.
 *
 * @param id Unique id for the texture. Should ideally refer to the type of object / scope it belongs to. e.g.
 *           "core:hearts", "client:avatar:{id}"
 * @param textureUrl Url to the texture that can be loaded either from css styles or img tags.
 */
function addTexture(id: string, textureUrl: string) {
    if (texturesContainer.has(id)) {
        console.error(`Texture with id ${id} already exists.`);
        return;
    }

    const idRegex = /^[a-zA-Z0-9_]+(:[a-zA-Z0-9_]+)*$/;
    if (!idRegex.test(id)) {
        console.error(
            `Texture id \`${id}\` is not valid. It should be defined by an string that can be prefixed by any nested amount of scopes separated by colons. e.g. "core:hearts", "client:avatar:{id}"`,
        );
        return;
    }

    texturesContainer.set(id, textureUrl);
}

function removeTexture(id: string) {
    if (!texturesContainer.has(id)) {
        console.error(`Texture with id ${id} does not exist.`);
        return;
    }
    texturesContainer.delete(id);
}

export { readonlyTexturesContainer as textures, addTexture, removeTexture };
