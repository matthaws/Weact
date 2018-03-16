export const HOST_COMPONENT = "HOST_COMPONENT";
export const CLASS_COMPONENT = "CLASS_COMPONENT";
export const ROOT_COMPONENT = "ROOT_COMPONENT";

const updateQueue = [];
let nextUnitOfWork = null;
let pendingCommit = null;

export const render = (elements, parentDom) => {
  updateQueue.push({
    from: ROOT_COMPONENT,
    dom: parentDom,
    newProps: { children: elements }
  });
  requestIdleCallback(performWork);
}

export const scheduleUpdate = (instance, partialState) => {
  updateQueue.push({
    from: CLASS_COMPONENT,
    instance: instance,
    partialState
  });
  requestIdleCallback(performWork);
}

// FIBER WORKFLOW:

const schedule = (task) => {
  workQueue.push(task);
  requestIdleCallback(performWork);
}

const workLoop = (deadline) => {
  if (!nextUnitOfWork) {
    nextUnitOfWork = workQueue.shift();
  }

  while (nextUnitOfWork && deadline.timeRemaining() > 1) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }

  if (pendingCommit) {
    commitAllWork(pendingCommit)
  }
}

const performWork = (deadline) => {
  workLoop(deadline);

  if (nextUnitOfWork || workQueue.length > 0) {
    requestIdleCallback(performWork);
  }
}
