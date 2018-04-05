export const HOST = "HOST";
export const CLASS = "CLASS";
export const ROOT = "ROOT";
export const FUNC = "FUNC";

export const PLACEMENT = 1;
export const DELETION = 2;
export const UPDATE = 3;

export const arrayify = (val) => {
  return val == null ? [] : Array.isArray(val) ? val : [val];
}

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
