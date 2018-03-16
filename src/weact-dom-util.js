import {
  isTextElement,
  isEvent,
  isAttribute,
  isDomElement,
  isNew,
  isGone
} from "./weact-util";
import WeactDOM from "./weact-dom";

export const updateDomProperties = (dom, prevProps, nextProps) => {
  removeEventListeners(dom, prevProps);
  removeAttributes(dom, prevProps);
  updateStyle(dom, prevProps, nextProps);
  addAttributes(dom, nextProps);
  addEventListeners(dom, nextProps);
};

export const createDomElement = fiber => {
  const dom = isTextElement
    ? document.createTextNode("")
    : document.createElement(fiber.type);
  updateDomProperties(dom, {}, fiber.props);
  return dom;
};

export const removeEventListeners = (domElement, prevProps, nextProps) => {
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

export const removeAttributes = (domElement, props) => {
  Object.keys(props)
    .filter(isAttribute)
    .filter(key => isGone(prevProps, nextProps, key))
    .forEach(prop => {
      domElement[prop] = null;
    });
};

export const addAttributes = (domElement, props) => {
  Object.keys(props)
    .filter(isAttribute)
    .filter(key => isNew(prevProps, nextProps, key))
    .forEach(name => {
      domElement[name] = props[name];
    });
};

export const addEventListeners = (domElement, props) => {
  Object.keys(props)
    .filter(isEvent)
    .filter(key => isNew(prevProps, nextProps, key))
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2);
      domElement.addEventListener(eventType, props[name]);
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
