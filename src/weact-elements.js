import { TEXT_ELEMENT } from "./weact-util";

const createElement = (type, initialProps, ...args) => {
  const props = Object.assign({}, initialProps);
  const hasChildren = args.length > 0;
  const allChildren = hasChildren ? [].concat(...args) : [];
  props.children = allChildren
    .filter(c => c != null && c !== false)
    .map(c => c instanceof Object ? c : createTextElement(c));
  return { type, props };
};

const createTextElement = value => {
  return createElement(TEXT_ELEMENT, { nodeValue: value })
}
