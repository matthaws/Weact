import { isTextElement, isEvent, isAttribute } from "./weact-util";
import WeactDOM from "./weact-dom";

let rootInstance = null;

export const render = (element, parentDomElement) => {
  const prevInstance = rootInstance;
  const nextInstance = reconcile(parentDomElement, prevInstance, element);
  rootInstance = nextInstance;
};

const reconcile = (parentDomElement, instance, element) => {
  const newInstance = instantiate(element);
  if (instance === null) {
    parentDomElement.appendChild(newInstance.dom);
    return newInstance;
  } else {
    parentDomElement.replaceChild(newInstance.dom, instance.dom);
    return newInstance;
  }
};

const instantiate = (element) => {
  const { type, props } = element;

  const domElement = isTextElement(type)
    ? document.createTextNode("")
    : document.createElement(type);

  addEventListeners(props, domElement);
  addAttributes(props, domElement);

  const childElements = props.children || [];
  const childInstances = childElements.map(instantiate);
  const childDoms = childInstances.map(child => child.dom);
  childDoms.forEach(child => domElement.append(child));

  const instance = { dom: domElement, element, childInstances };
  return instance;
};

const addAttributes = (props, domElement) => {
  Object.keys(props)
    .filter(isAttribute)
    .forEach(name => {
      domElement[name] = props[name];
    });
};

const addEventListeners = (props, domElement) => {
  Object.keys(props)
    .filter(isEvent)
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2);
      domElement.addEventListener(eventType, props[name]);
    });
};
