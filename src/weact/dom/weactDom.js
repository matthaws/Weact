import {
  isTextElement,
  isEvent,
  isAttribute,
  isDomElement,
  isNew,
  isGone
} from "../util/weactUtil";

export const updateDomProperties = (dom, prevProps, nextProps) => {
  removeEventListeners(dom, prevProps, nextProps);
  removeAttributes(dom, prevProps, nextProps);
  updateStyle(dom, prevProps, nextProps);
  addAttributes(dom, prevProps, nextProps);
  addEventListeners(dom, prevProps, nextProps);
};

export const createDomElement = fiber => {
  const dom = isTextElement(fiber.type)
    ? document.createTextNode("")
    : document.createElement(fiber.type);
  updateDomProperties(dom, {}, fiber.props);
  return dom;
};

export const createDomFromFunc = fiber => {
  const dom = document.createElement(fiber.type(fiber.props));
  updateDomProperties(dom, {}, fiber.props);
  return dom;
};

const removeEventListeners = (domElement, prevProps, nextProps) => {
  Object.keys(prevProps)
    .filter(isEvent)
    .filter(key => {
      isNew(prevProps, nextProps, key) || isGone(prevProps, nextProps, key);
    })
    .forEach(prop => {
      const eventType = prop.toLowerCase().slice(2);
      domElement.removeEventListener(eventType, props[name]);
    });
};

const removeAttributes = (domElement, prevProps, nextProps) => {
  Object.keys(prevProps)
    .filter(isAttribute)
    .filter(key => isGone(prevProps, nextProps, key))
    .forEach(prop => {
      domElement[prop] = null;
    });
};

const addAttributes = (domElement, prevProps, nextProps) => {
  Object.keys(nextProps)
    .filter(isAttribute)
    .filter(key => isNew(prevProps, nextProps, key))
    .forEach(name => {
      domElement[name] = nextProps[name];
    });
};

const addEventListeners = (domElement, prevProps, nextProps) => {
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(key => isNew(prevProps, nextProps, key))
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2);
      domElement.addEventListener(eventType, nextProps[name]);
    });
};

const updateStyle = (element, prevProps, nextProps) => {
  prevProps.style = prevProps.style || {};
  nextProps.style = nextProps.style || {};
  Object.keys(nextProps.style)
    .filter(key => isNew(prevProps.style, nextProps.style, key))
    .forEach(key => {
      dom.style[key] = nextProps.style[key];
    });
  Object.keys(prevProps.style)
    .filter(key => isGone(prevProps.style, nextProps.style, key))
    .forEach(key => {
      dom.style[key] = "";
    });
};
