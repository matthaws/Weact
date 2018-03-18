import { CLASS, HOST, ROOT } from "./weact-fiber-util";

export const PLACEMENT = 1;
export const DELETION = 2;
export const UPDATE = 3;

function arrify(val) {
  return val == null ? [] : Array.isArray(val) ? val : [val];
}

// TODO: change to use keys to reconcile rather than array indices
export const reconcileChildArray = (currentFiber, newChildElements) => {
  const elements = arrify(newChildElements);

  let index = 0;
  let oldFiber = currentFiber.alternate ? currentFiber.alternate.child : null;
  let newFiber = null;
  while (index < elements.length || oldFiber != null) {
    const prevFiber = newFiber;
    const element = index < elements.length && elements[index];
    const sameType = oldFiber && element && element.type == oldFiber.type;

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

    if (element && !sameType) {
      newFiber = {
        type: element.type,
        tag: typeof element.type === "string" ? HOST : CLASS,
        props: element.props,
        parent: currentFiber,
        effectTag: PLACEMENT
      };
    }

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

export const cloneChildFibers = parentFiber => {
  const oldFiber = parentFiber.alternate;
  if (!oldFiber.child) {
    return;
  }

  let oldChild = oldFiber.child;
  let prevChild = null;
  while (oldChild) {
    const newChild = {
      type: oldChild.type,
      tag: oldChild.tag,
      stateNode: oldChild.stateNode,
      props: oldChild.props,
      newStateStuff: oldChild.newStateStuff,
      alternate: oldChild,
      parent: parentFiber
    };
    if (prevChild) {
      prevChild.sibling = newChild;
    } else {
      parentFiber.child = newChild;
    }
    prevChild = newChild;
    oldChild = oldChild.sibling;
  }
};
