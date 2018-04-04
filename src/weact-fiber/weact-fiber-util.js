import { createDomElement, createDomFromFunc } from "../weact-dom/weact-dom-util";
import { reconcileChildArray, cloneChildFibers } from "./fiber-reconciliation";

export const HOST = "HOST";
export const CLASS = "CLASS";
export const ROOT = "ROOT";
export const FUNC = "FUNC";

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

export const updateClassComponent = fiber => {
  debugger
  let newInstance = false;
  let instance = fiber.stateNode;
  if (!instance) {
    newInstance = true;
    fiber.stateNode = createInstance(fiber);
    instance = fiber.stateNode;
    debugger
  } else if (fiber.props == instance.props && !fiber.newStateStuff) {
    cloneChildFibers(fiber);
    return;
  }

  const prevProps = instance.props;
  const prevState = instance.state;
  const nextProps = fiber.props;
  const nextState = Object.assign({}, instance.state, fiber.newStateStuff);
  if (newInstance) {
    componentMountingPhase(instance, fiber);
  } else {
    instance.componentWillReceiveProps(prevProps, nextProps);
    if (instance.shouldComponentUpdate(nextProps, nextState)) {
      instance.componentWillUpdate(nextProps, nextState);
      instance.props = fiber.props;
      instance.state = nextState;
      fiber.newStateStuff = null;
      const newChildElements = fiber.stateNode.render();
      instance.componentDidUpdate(prevProps, prevState);
      reconcileChildArray(fiber, newChildElements);
    } else {
      cloneChildFibers(fiber);
    }
  }
};

const componentMountingPhase = (instance, fiber) => {
  instance.componentWillMount();
  const newChildElements = instance.render();
  instance.componentDidMount();
  debugger
  reconcileChildArray(fiber, newChildElements);
};

export const updateHostComponent = fiber => {
  if (!fiber.stateNode) {
    fiber.stateNode = createDomElement(fiber);
  }
  reconcileChildArray(fiber, fiber.props.children);
};

export const updateFuncComponent = fiber => {
  fiber.stateNode = createDomFromFunc(fiber);
  fiber.tag = FUNC;
  reconcileChildArray(fiber, fiber.props.children);
};

export const commitDeletion = (fiber, parentDom) => {
  let node = fiber;
  while (true) {
    if (node.tag === CLASS && node.type.prototype.componentWillUnmount) {
      node.stateNode.componentWillUnmount();
      node = node.child;
      continue;
    }
    if(!node.stateNode.type && node.tag !== FUNC) {
      parentDom.removeChild(node.stateNode);
    }
    while (node != fiber && !node.sibling) {
      node = node.parent;
    }

    if (node == fiber) {
      return;
    }

    node = node.sibling;
  }
};
