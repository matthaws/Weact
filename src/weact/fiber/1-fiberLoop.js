import { processFiber } from "./2-processFiber";
import { HOST, CLASS } from "../util/fiberUtil";

// Global queue/state for rendering process
const updateQueue = [];
let nextFiber = null;


// Initializers (adds changes to queue)
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

// Callback that fires off the workflow loop
const processQueue = deadline => {
  workLoop(deadline);
  if (nextFiber || updateQueue.length > 0) {
    requestIdleCallback(processQueue);
  }
};

// Master function that handles the three stages of the workflow
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

// Step 1 of workflow, pulling off the next change from the queue
const getNextFiber = () => {
  const update = updateQueue.shift();
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

  nextFiber = {
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
