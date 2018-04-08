import {
  ROOT,
  CLASS,
  HOST,
  FUNC,
  PLACEMENT,
  UPDATE,
  DELETION
} from "../util/fiberUtil";
import { updateDomProperties } from "../dom/weactDom";

export const commitAllWork = globalQueue => {
  globalQueue.pendingCommit.effects.forEach(fiber => {
    commitWork(fiber);
  });
  globalQueue.pendingCommit.stateNode._rootContainerFiber =
    globalQueue.pendingCommit;
  globalQueue.nextFiber = null;
  globalQueue.pendingCommit = null;
};

const commitWork = fiber => {
  if (fiber.tag === ROOT) {
    return;
  }

  let domParentFiber = fiber.parent;
  while (domParentFiber.tag == CLASS) {
    domParentFiber = domParentFiber.parent;
  }

  const domParent = domParentFiber.stateNode;
  if (fiber.effectTag === PLACEMENT && fiber.tag !== CLASS) {
    domParent.appendChild(fiber.stateNode);
  } else if (fiber.effectTag === UPDATE) {
    updateDomProperties(fiber.stateNode, fiber.alternate.props, fiber.props);
  } else if (fiber.effectTag === DELETION) {
    commitDeletion(fiber, domParent);
  }
};

export const commitDeletion = (fiber, parentDom) => {
  let node = fiber;
  while (true) {
    if (node.tag === CLASS && node.type.prototype.componentWillUnmount) {
      node.stateNode.componentWillUnmount();
      node = node.child;
      continue;
    }
    if (!node.stateNode.type && node.tag !== FUNC) {
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
