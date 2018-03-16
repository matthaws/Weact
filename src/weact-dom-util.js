import { isTextElement, isEvent,isAttribute, isDomElement } from "./weact-util";
import WeactDOM from "./weact-dom";


export const updateDomProperties = (dom, prevProps, nextProps) => {
  removeEventListeners(dom, prevProps);
  removeAttributes(dom, prevProps);
  addAttributes(dom, nextProps);
  addEventListeners(dom, nextProps);
};

export const createDomElement = (fiber) => {
  const dom = isTextElement
    ? document.createTextNode("")
    : document.createElement(fiber.type)
  updateDomProperties(dom, {}, fiber.props);
  return dom;
};

export const removeEventListeners = (domElement, props) => {
  Object.keys(props)
    .filter(isEvent)
    .forEach(prop => {
      const eventType = prop.toLowerCase().slice(2);
      domElement.removeEventListener(eventType, props[name]);
    });
};

export const removeAttributes = (domElement, props) => {
  Object.keys(props)
    .filter(isAttribute)
    .forEach(prop => {
      domElement[prop] = null;
    });
};

export const addAttributes = (domElement, props) => {
  Object.keys(props)
    .filter(isAttribute)
    .forEach(name => {
      domElement[name] = props[name];
    });
};

export const addEventListeners = (domElement, props) => {
  Object.keys(props)
    .filter(isEvent)
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2);
      domElement.addEventListener(eventType, props[name]);
    });
};
