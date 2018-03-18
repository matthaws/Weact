import { updateDomProperties } from "../weact-dom/weact-dom-util";
import { PLACEMENT, DELETION, UPDATE } from "./fiber-reconciliation";
import {
  getRoot,
  CLASS,
  HOST,
  ROOT,
  updateHostComponent,
  updateClassComponent,
  commitDeletion
} from "./weact-fiber-util";

const updateQueue = [];
let nextFiber = null;
let pendingCommit = null;

export const render = (elements, rootDom) => {
  updateQueue.push({
    from: HOST,
    dom: rootDom,
    newProps: {
      children: elements
    }
  });
  requestIdleCallback(processQueue);
};

export const scheduleUpdate = (instance, newStateStuff) => {
  updateQueue.push({
    from: CLASS,
    instance,
    newStateStuff
  });
  requestIdleCallback(processQueue);
};

const processQueue = deadline => {

  workLoop(deadline);
  if (nextFiber || updateQueue.length > 0) {
    requestIdleCallback(processQueue);
  }
};

const workLoop = deadline => {
  if (!nextFiber) {
    getNextFiber();
  }

  while (nextFiber && deadline.timeRemaining() > 1) {
    nextFiber = processFiber(nextFiber);
  }

  if (pendingCommit) {
    commitAllWork(pendingCommit);
  }
};

const getNextFiber = () => {
  const update = updateQueue.shift();
  if (!update) {
    return;
  }
  console.log(update.instance)
  if (update.newStateStuff) {
    update.instance.__fiber.newStateStuff = update.newStateStuff;
  }

  const root =
    update.from == HOST
      ? update.dom._rootContainerFiber
      : getRoot(update.instance.__fiber);

  nextFiber = {
    tag: HOST,
    stateNode: update.dom || root.stateNode,
    props: update.newProps || root.props,
    alternate: root
  };
};

const processFiber = currentFiber => {
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

const startWork = currentFiber => {
  if (currentFiber.tag === CLASS) {
    updateClassComponent(currentFiber);
  } else {
    updateHostComponent(currentFiber);
  }
};

const completeWork = currentFiber => {

  if (currentFiber.tag === CLASS) {
    currentFiber.stateNode.__fiber = currentFiber;
  }

  if (currentFiber.parent) {
    const childEffects = currentFiber.effects || [];
    const thisEffect = currentFiber.effectTag != null ? [currentFiber] : [];
    const parentEffects = currentFiber.parent.effects || [];
    currentFiber.parent.effects = parentEffects.concat(childEffects, thisEffect);
  } else {
    pendingCommit = currentFiber;
  }
  ;
}

const commitAllWork = (rootFiber) => {
  rootFiber.effects.forEach( fiber => {
    commitWork(fiber);
  });
  rootFiber.stateNode._rootContainerFiber = rootFiber;
  nextFiber = null;
  pendingCommit = null;
}

const commitWork = (fiber) => {
  if (fiber.tag === ROOT) {
    return;
  }

  let domParentFiber = fiber.parent;
  while (domParentFiber.tag == CLASS) {
    domParentFiber = domParentFiber.parent;
  }

  const domParent = domParentFiber.stateNode;


  if (fiber.effectTag === PLACEMENT && fiber.tag === HOST) {
    domParent.appendChild(fiber.stateNode);
  } else if (fiber.effectTag === UPDATE) {
    updateDomProperties(fiber.stateNode, fiber.alternate.props, fiber.props)
  } else if (fiber.effectTag === DELETION) {
    commitDeletion(fiber, domParent);
  }
}
