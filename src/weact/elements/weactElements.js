import { TEXT_ELEMENT } from "../util/weactUtil";

export const createElement = (type, initialProps, ...args) => {
  const props = Object.assign({}, initialProps);
  const hasChildren = args.length > 0;
  const allChildren = hasChildren ? [].concat(...args) : [];
  props.children = allChildren
    .filter(child => child != null && child !== false)
    .map(child => child instanceof Object ? child : createTextElement(child));
  if (typeof type === "function" && !type.prototype.componentDidMount) {
    return type(props);
  }
  return { type, props };
};

export const createTextElement = value => {
  return createElement(TEXT_ELEMENT, { nodeValue: value })
}
