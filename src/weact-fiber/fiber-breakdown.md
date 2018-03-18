Fibers are POJOs connected to an instance of one node on the DOM tree, and connected to other fibers to form a virtual DOM. They also are connected to an "alternate" fiber, allowing us to connect the current fiber tree (which is an accurate reflection of what is current on the DOM) with the work-in-progress fiber tree, which is what the DOM should look like after changes.

```js
fiber = {
  tag: HOST,
  type: "div",
  parent: parentFiber,
  child: childFiber,
  sibling: null,
  alternate: currentFiber,
  stateNode: document.createElement("div"),
  props: { children: [], className: "form-container"},
  newStateStuff: null,
  effectTag: PLACEMENT,
  effects: []
};
```
Fiber Workflow

* `render()` / `scheduleUpdate()` -- `processQueue` is queued by the browser to be run next time its idle using `window.requestIdleCallback()`;
  * `processQueue()` is run when the browser is idle. It kicks off one `FiberLoop()` and then queues itself recursively with `requestIdleCallback()` as long as there's still work in the queue or a fiber tree is still in process(there's a `nextFiber` defined).
    * `FiberLoop()` grabs the `nextFiber` or, if there isn't one, the next fiber in the global queue.
    * if there is enough time left before the "deadline" given by the browser in `requestIdleCallback()`, `FiberLoop()` performs the `nextFiber` with `performFiber()` 


Incremental rendering works by means of a global queue of fibers to be processed. Fibers make their way onto the queue either by means of a call to WeactDOM.render(), which starts at the root DOM element, or scheduleUpdate(), which is called in components (for instance, to trigger a re-render when a component's state updates).  
