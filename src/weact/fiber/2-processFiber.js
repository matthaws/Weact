import {
  CLASS,
  HOST,
  ROOT,
  FUNC,
  PLACEMENT,
  UPDATE,
  DELETION,
  cloneChildFibers,
  arrayify
} from "../util/fiberUtil";
import { createDomElement } from "../dom/weactDom";


let pendingCommit = null;

// Step 2 of workflow, determines the changes to be made to the dom
export const processFiber = currentFiber => {
  startWork(currentFiber);
  if (currentFiber.child) {
    return currentFiber.child;
  }

  let current = currentFiber;
  while (current) {
    completeWork(current);
    if (current.sibling) {
      return current.sibling;
    }

    current = current.parent;
  }
};

// updates the props for the current node
const startWork = currentFiber => {
  if (
    currentFiber.tag === CLASS &&
    currentFiber.type.prototype.componentWillMount
  ) {
    updateClassComponent(currentFiber);
  } else if (typeof currentFiber.type === "function") {
    updateFuncComponent(currentFiber);
  } else {
    updateHostComponent(currentFiber);
  }
};

// collects all changes to be made in the parent component - changes '
// trickle up' into a collection in the root array.

const completeWork = currentFiber => {
  if (currentFiber.tag === CLASS) {
    currentFiber.stateNode.__fiber = currentFiber;
  }

  if (currentFiber.parent) {
    const childEffects = currentFiber.effects || [];
    const thisEffect = currentFiber.effectTag != null ? [currentFiber] : [];
    const parentEffects = currentFiber.parent.effects || [];
    currentFiber.parent.effects = parentEffects.concat(
      childEffects,
      thisEffect
    );
  } else {
    pendingCommit = currentFiber;
  }
};

export const createInstance = fiber => {
  const instance = new fiber.type(fiber.props);
  instance.__fiber = fiber;
  return instance;
};

// updates class - lifecycle methods called here
const updateClassComponent = fiber => {
  debugger;
  let newInstance = false;
  let instance = fiber.stateNode;
  if (!instance) {
    newInstance = true;
    fiber.stateNode = createInstance(fiber);
    instance = fiber.stateNode;
    debugger;
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
  reconcileChildArray(fiber, newChildElements);
};

// updates regular DOM node
const updateHostComponent = fiber => {
  if (!fiber.stateNode) {
    fiber.stateNode = createDomElement(fiber);
  }
  reconcileChildArray(fiber, fiber.props.children);
};

// updates functional component
const updateFuncComponent = fiber => {
  fiber.stateNode = createDomFromFunc(fiber);
  fiber.tag = FUNC;
  reconcileChildArray(fiber, fiber.props.children);
};

// reconciles children
const reconcileChildArray = (currentFiber, newChildElements) => {
  const elements = arrayify(newChildElements);

  let index = 0;
  let oldFiber = currentFiber.alternate ? currentFiber.alternate.child : null;
  let newFiber = null;
  while (index < elements.length || oldFiber != null) {
    const prevFiber = newFiber;
    const element = index < elements.length && elements[index];
    const sameType = oldFiber && element && element.type == oldFiber.type;

    // if old and new are the same type, we are updating a node with new props
    if (sameType) {
      newFiber = {
        type: oldFiber.type,
        tag: oldFiber.tag,
        stateNode: oldFiber.stateNode,
        props: element.props,
        parent: currentFiber,
        alternate: oldFiber,
        newStateStuff: oldFiber.newStateStuff,
        effectTag: UPDATE
      };
    }

    // if we don't have an old version, we are placing a new node
    if (element && !sameType) {
      newFiber = {
        type: element.type,
        tag: typeof element.type === "string" ? HOST : CLASS,
        props: element.props,
        parent: currentFiber,
        effectTag: PLACEMENT
      };
    }

    // if we have an old version but not a new, we are deleting that node
    if (oldFiber && !sameType) {
      oldFiber.effectTag = DELETION;
      currentFiber.effects = currentFiber.effects || [];
      currentFiber.effects.push(oldFiber);
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (index == 0) {
      currentFiber.child = newFiber;
    } else if (prevFiber && element) {
      prevFiber.sibling = newFiber;
    }

    index++;
  }
};
