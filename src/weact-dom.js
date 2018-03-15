import { TEXT_ELEMENT } from "./weact-util";

const WeactDOM = {
  render: (element, parentDomElement) => {
    const { type, props } = element;
    const domElement = isTextElement
      ? document.createTextNode("")
      : document.createElement(type)

    addEventListeners(props, domElement);
    addAttributes(props, domElement);

    const childElements = props.children || [];
    childElements.forEach(childElement => render(childElement, domElement));

    parentDomElement.appendChild(domElement);
  }
}

const TEXT_ELEMENT = "TEXT_ELEMENT";

const isEvent = name => name.startsWith("on");
const isAttribute = name => !isEvent(name) && name != "children";
const isTextElement = type => type === TEXT_ELEMENT;

const addAttributes = (props, domElement) => {
  Object.keys(props).filter(isAttribute).forEach(name => {
    domElement[name] = props[name];
  });
};

const addEventListeners = (props, domElement) => {
  Object.keys(props).filter(isEvent).forEach(name => {
    const eventType = name.toLowerCase().substring(2);
    domElement.addEventListener(eventType, props[name]);
  });
}
