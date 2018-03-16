import { TEXT_ELEMENT } from "./weact-util";

export const createElement = (type, initialProps, ...args) => {
  const props = Object.assign({}, initialProps);
  const hasChildren = args.length > 0;
  const allChildren = hasChildren ? [].concat(...args) : [];
  props.children = allChildren
    .filter(child => child != null && child !== false)
    .map(child => child instanceof Object ? child : createTextElement(child));
  return { type, props };
};

export const createTextElement = value => {
  return createElement(TEXT_ELEMENT, { nodeValue: value })
}
