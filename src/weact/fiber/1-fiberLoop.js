import { processFiber } from "./2-processFiber";
import { HOST, CLASS } from "../util/fiberUtil";
import { commitAllWork } from "./3-commitWork";

// Global queue/state for rendering process
const globalQueue = {
  updateQueue: [],
  nextFiber: null,
  pendingCommit: null
}

// Initializers (adds changes to queue)
export const render = (elements, rootDom) => {
  globalQueue.updateQueue.push({
    from: HOST,
    dom: rootDom,
    newProps: {
      children: elements
    }
  });
  requestIdleCallback(processQueue);
};

export const scheduleUpdate = (instance, newStateStuff) => {
  globalQueue.updateQueue.push({
    from: CLASS,
    instance,
    newStateStuff
  });
  requestIdleCallback(processQueue);
};

// Callback that fires off the workflow loop
const processQueue = deadline => {
  workLoop(deadline);
  if (globalQueue.nextFiber || globalQueue.updateQueue.length > 0) {
    requestIdleCallback(processQueue);
  }
};

// Master function that handles the three stages of the workflow
const workLoop = deadline => {
  if (!globalQueue.nextFiber) {
    getNextFiber();
  }

  while (globalQueue.nextFiber && deadline.timeRemaining() > 1) {
    globalQueue.nextFiber = processFiber(globalQueue);
  }

  if (globalQueue.pendingCommit) {
    commitAllWork(globalQueue);
  }
};

// Step 1 of workflow, pulling off the next change from the queue
const getNextFiber = () => {
  const update = globalQueue.updateQueue.shift();
  if (!update) {
    return;
  }

  if (update.newStateStuff) {
    update.instance.__fiber.newStateStuff = update.newStateStuff;
  }

  const root =
    update.from == HOST
      ? update.dom._rootContainerFiber
      : getRoot(update.instance.__fiber);

  globalQueue.nextFiber = {
    tag: HOST,
    stateNode: update.dom || root.stateNode,
    props: update.newProps || root.props,
    alternate: root
  };
};

const getRoot = fiber => {
  let node = fiber;
  while (node.parent) {
    node = node.parent;
  }
  return node;
};
