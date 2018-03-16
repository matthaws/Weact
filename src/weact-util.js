export const TEXT_ELEMENT = "TEXT_ELEMENT";
export const isEvent = name => name.startsWith("on");
export const isAttribute = name => !isEvent(name) && name != "children";
export const isTextElement = type => type === TEXT_ELEMENT;
export const isDomElement = type => typeof type === "string";

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
