import { createDomElement } from "../weact-dom/weact-dom-util";
import { reconcileChildArray, cloneChildFibers } from "./fiber-reconciliation";

export const HOST = "HOST";
export const CLASS = "CLASS";
export const ROOT = "ROOT";

export const createInstance = fiber => {
  const instance = new fiber.type(fiber.props);
  instance.__fiber = fiber;
  return instance;
};

export const getRoot = fiber => {
  let node = fiber;
  while (node.parent) {
    node = node.parent;
  }
  return node;
};

// TODO: Call lifecycle methods!
export const updateClassComponent = fiber => {
  let instance = fiber.stateNode;
  if (!instance) {
    fiber.stateNode = createInstance(fiber);
    instance = fiber.stateNode;
  } else if (fiber.props == instance.props && !fiber.newStateStuff) {
    // shouldComponentUpdate();
    cloneChildFibers(fiber);
    return;
  }

  instance.props = fiber.props;
  instance.state = Object.assign({}, instance.state, fiber.newStateStuff);
  fiber.newStateStuff = null;
  const newChildElements = fiber.stateNode.render();
  reconcileChildArray(fiber, newChildElements);
};

export const updateHostComponent = fiber => {
  if (!fiber.stateNode) {
    fiber.stateNode = createDomElement(fiber);
  }
  reconcileChildArray(fiber, fiber.props.children);
};

export const commitDeletion = (fiber, parentDom) => {
  let node = fiber;
  while (true) {
    if (node.tag === CLASS) {
      node = node.child;
      continue;
    }

    parentDom.removeChild(node.stateNode);
    while (node != fiber && !node.sibling) {
      node = node.parent;
    }

    if (node == fiber) {
      return;
    }

    node = node.sibling;
  }
};
