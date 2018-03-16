import {
  isTextElement,
  isEvent,
  isAttribute,
  addEventListeners,
  removeEventListeners,
  addAttributes,
  removeAttributes
} from "./weact-util";
import WeactDOM from "./weact-dom";

let rootInstance = null;

export const render = (element, parentDomElement) => {
  const prevInstance = rootInstance;
  const nextInstance = reconcile(parentDomElement, prevInstance, element);
  rootInstance = nextInstance;
};

const reconcile = (parentDomElement, instance, element) => {
  if (instance === null) {
    const newInstance = instantiate(element);
    parentDomElement.appendChild(newInstance.dom);
    return newInstance;
  } else if (instance.element.type === element.type) {
    updateDomProperties(instance.dom, instance.element.props, element.props);
    instance.element = element;
    return instance;
  } else {
    const newInstance = instantiate(element);
    parentDomElement.replaceChild(newInstance.dom, instance.dom);
    return newInstance;
  }
};

const instantiate = element => {
  const { type, props } = element;

  const domElement = isTextElement(type)
    ? document.createTextNode("")
    : document.createElement(type);

  updateDomProperties(domElement, [], props);

  const childElements = props.children || [];
  const childInstances = createChildInstanceObject(childElements);
  const childDoms = Object.values(childInstances).map(child => child.dom);
  childDoms.forEach(child => domElement.append(child));

  const instance = { dom: domElement, element, childInstances };
  return instance;
};

const createChildInstanceObject = childArray => {
  const multipleChildren = childArray.length < 2 ? false : true;
  const childInstances = {};
  childArray.map(instantiate).forEach((child, idx) => {
    if (child.element.props.key) {
      childInstances[child.element.props.key] = child;
    } else {
      childInstances[idx] = child;
    }
  });
  return childInstances;
};

const updateDomProperties = (dom, prevProps, nextProps) => {
  removeEventListeners(dom, prevProps);
  removeAttributes(dom, prevProps);
  addAttributes(dom, nextProps);
  addEventListeners(dom, nextProps);
};
