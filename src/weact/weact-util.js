export const TEXT_ELEMENT = "TEXT_ELEMENT";
export const isEvent = name => name.startsWith("on");
export const isAttribute = name => !isEvent(name) && name != "children";
export const isTextElement = type => type === TEXT_ELEMENT;
export const isDomElement = type => typeof type === "string";
export const isNew = (prev, next, key) => prev[key] !== next[key];
export const isGone = (prev, next, key) => !(key in next);
