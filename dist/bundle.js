'use strict';

require("core-js/shim");

require("regenerator-runtime/runtime");

require("core-js/fn/regexp/escape");

if (global._babelPolyfill) {
  throw new Error("only one instance of babel-polyfill is allowed");
}
global._babelPolyfill = true;

var DEFINE_PROPERTY = "defineProperty";
function define(O, key, value) {
  O[key] || Object[DEFINE_PROPERTY](O, key, {
    writable: true,
    configurable: true,
    value: value
  });
}

define(String.prototype, "padLeft", "".padStart);
define(String.prototype, "padRight", "".padEnd);

"pop,reverse,shift,keys,values,entries,indexOf,every,some,forEach,map,filter,find,findIndex,includes,join,slice,concat,push,splice,unshift,sort,lastIndexOf,reduce,reduceRight,copyWithin,fill".split(",").forEach(function (key) {
  [][key] && define(Array, key, Function.call.bind([][key]));
});

var TEXT_ELEMENT = "TEXT_ELEMENT";
var isEvent = function isEvent(name) {
  return name.startsWith("on");
};
var isAttribute = function isAttribute(name) {
  return !isEvent(name) && name != "children";
};
var isTextElement = function isTextElement(type) {
  return type === TEXT_ELEMENT;
};
var isNew = function isNew(prev, next, key) {
  return prev[key] !== next[key];
};
var isGone = function isGone(prev, next, key) {
  return !(key in next);
};

var createElement = function createElement(type, initialProps) {
  for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  var _ref;

  var props = Object.assign({}, initialProps);
  var hasChildren = args.length > 0;
  var allChildren = hasChildren ? (_ref = []).concat.apply(_ref, args) : [];
  props.children = allChildren.filter(function (child) {
    return child != null && child !== false;
  }).map(function (child) {
    return child instanceof Object ? child : createTextElement(child);
  });
  if (typeof type === "function" && !type.prototype.componentDidMount) {
    return type(props);
  }
  return { type: type, props: props };
};

var createTextElement = function createTextElement(value) {
  return createElement(TEXT_ELEMENT, { nodeValue: value });
};

var HOST = "HOST";
var CLASS = "CLASS";
var ROOT = "ROOT";
var FUNC = "FUNC";

var PLACEMENT = 1;
var DELETION = 2;
var UPDATE = 3;

var arrayify = function arrayify(val) {
  return val == null ? [] : Array.isArray(val) ? val : [val];
};

var cloneChildFibers = function cloneChildFibers(parentFiber) {
  var oldFiber = parentFiber.alternate;
  if (!oldFiber.child) {
    return;
  }

  var oldChild = oldFiber.child;
  var prevChild = null;
  while (oldChild) {
    var newChild = {
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

var updateDomProperties = function updateDomProperties(dom, prevProps, nextProps) {
  removeEventListeners(dom, prevProps, nextProps);
  removeAttributes(dom, prevProps, nextProps);
  updateStyle(dom, prevProps, nextProps);
  addAttributes(dom, prevProps, nextProps);
  addEventListeners(dom, prevProps, nextProps);
};

var createDomElement = function createDomElement(fiber) {
  var dom = isTextElement(fiber.type) ? document.createTextNode("") : document.createElement(fiber.type);
  updateDomProperties(dom, {}, fiber.props);
  return dom;
};

var removeEventListeners = function removeEventListeners(domElement, prevProps, nextProps) {
  Object.keys(prevProps).filter(isEvent).filter(function (key) {
    isNew(prevProps, nextProps, key) || isGone(prevProps, nextProps, key);
  }).forEach(function (prop) {
    var eventType = prop.toLowerCase().slice(2);
    domElement.removeEventListener(eventType, props[name]);
  });
};

var removeAttributes = function removeAttributes(domElement, prevProps, nextProps) {
  Object.keys(prevProps).filter(isAttribute).filter(function (key) {
    return isGone(prevProps, nextProps, key);
  }).forEach(function (prop) {
    domElement[prop] = null;
  });
};

var addAttributes = function addAttributes(domElement, prevProps, nextProps) {
  Object.keys(nextProps).filter(isAttribute).filter(function (key) {
    return isNew(prevProps, nextProps, key);
  }).forEach(function (name) {
    domElement[name] = nextProps[name];
  });
};

var addEventListeners = function addEventListeners(domElement, prevProps, nextProps) {
  Object.keys(nextProps).filter(isEvent).filter(function (key) {
    return isNew(prevProps, nextProps, key);
  }).forEach(function (name) {
    var eventType = name.toLowerCase().substring(2);
    domElement.addEventListener(eventType, nextProps[name]);
  });
};

var updateStyle = function updateStyle(element, prevProps, nextProps) {
  prevProps.style = prevProps.style || {};
  nextProps.style = nextProps.style || {};
  Object.keys(nextProps.style).filter(function (key) {
    return isNew(prevProps.style, nextProps.style, key);
  }).forEach(function (key) {
    dom.style[key] = nextProps.style[key];
  });
  Object.keys(prevProps.style).filter(function (key) {
    return isGone(prevProps.style, nextProps.style, key);
  }).forEach(function (key) {
    dom.style[key] = "";
  });
};

// Step 2 of workflow, determines the changes to be made to the dom
var processFiber = function processFiber(globalQueue) {
  var currentFiber = globalQueue.nextFiber;
  startWork(currentFiber);
  if (currentFiber.child) {
    return currentFiber.child;
  }

  var current = currentFiber;
  while (current) {
    completeWork(current, globalQueue);
    if (current.sibling) {
      return current.sibling;
    }

    current = current.parent;
  }
};

// updates the props for the current node
var startWork = function startWork(currentFiber) {
  if (currentFiber.tag === CLASS && currentFiber.type.prototype.componentWillMount) {
    updateClassComponent(currentFiber);
  } else if (typeof currentFiber.type === "function") {
    updateFuncComponent(currentFiber);
  } else {
    updateHostComponent(currentFiber);
  }
};

// collects all changes to be made in the parent component - changes '
// trickle up' into a collection in the root array.

var completeWork = function completeWork(currentFiber, globalQueue) {
  if (currentFiber.tag === CLASS) {
    currentFiber.stateNode.__fiber = currentFiber;
  }

  if (currentFiber.parent) {
    var childEffects = currentFiber.effects || [];
    var thisEffect = currentFiber.effectTag != null ? [currentFiber] : [];
    var parentEffects = currentFiber.parent.effects || [];
    currentFiber.parent.effects = parentEffects.concat(childEffects, thisEffect);
  } else {
    globalQueue.pendingCommit = currentFiber;
  }
};

var createInstance = function createInstance(fiber) {
  var instance = new fiber.type(fiber.props);
  instance.__fiber = fiber;
  return instance;
};

// updates class - lifecycle methods called here
var updateClassComponent = function updateClassComponent(fiber) {
  var newInstance = false;
  var instance = fiber.stateNode;
  if (!instance) {
    newInstance = true;
    fiber.stateNode = createInstance(fiber);
    instance = fiber.stateNode;
  } else if (fiber.props == instance.props && !fiber.newStateStuff) {
    cloneChildFibers(fiber);
    return;
  }

  var prevProps = instance.props;
  var prevState = instance.state;
  var nextProps = fiber.props;
  var nextState = Object.assign({}, instance.state, fiber.newStateStuff);
  if (newInstance) {
    componentMountingPhase(instance, fiber);
  } else {
    instance.componentWillReceiveProps(prevProps, nextProps);
    if (instance.shouldComponentUpdate(nextProps, nextState)) {
      instance.componentWillUpdate(nextProps, nextState);
      instance.props = fiber.props;
      instance.state = nextState;
      fiber.newStateStuff = null;
      var newChildElements = fiber.stateNode.render();
      instance.componentDidUpdate(prevProps, prevState);
      reconcileChildArray(fiber, newChildElements);
    } else {
      cloneChildFibers(fiber);
    }
  }
};

var componentMountingPhase = function componentMountingPhase(instance, fiber) {
  instance.componentWillMount();
  var newChildElements = instance.render();
  instance.componentDidMount();
  reconcileChildArray(fiber, newChildElements);
};

// updates regular DOM node
var updateHostComponent = function updateHostComponent(fiber) {
  if (!fiber.stateNode) {
    fiber.stateNode = createDomElement(fiber);
  }
  reconcileChildArray(fiber, fiber.props.children);
};

// updates functional component
var updateFuncComponent = function updateFuncComponent(fiber) {
  fiber.stateNode = createDomFromFunc(fiber);
  fiber.tag = FUNC;
  reconcileChildArray(fiber, fiber.props.children);
};

// reconciles children
var reconcileChildArray = function reconcileChildArray(currentFiber, newChildElements) {
  var elements = arrayify(newChildElements);

  var index = 0;
  var oldFiber = currentFiber.alternate ? currentFiber.alternate.child : null;
  var newFiber = null;
  while (index < elements.length || oldFiber != null) {
    var prevFiber = newFiber;
    var element = index < elements.length && elements[index];
    var sameType = oldFiber && element && element.type == oldFiber.type;

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

var commitAllWork = function commitAllWork(globalQueue) {
  globalQueue.pendingCommit.effects.forEach(function (fiber) {
    commitWork(fiber);
  });
  globalQueue.pendingCommit.stateNode._rootContainerFiber = globalQueue.pendingCommit;
  globalQueue.nextFiber = null;
  globalQueue.pendingCommit = null;
};

var commitWork = function commitWork(fiber) {
  if (fiber.tag === ROOT) {
    return;
  }

  var domParentFiber = fiber.parent;
  while (domParentFiber.tag == CLASS) {
    domParentFiber = domParentFiber.parent;
  }

  var domParent = domParentFiber.stateNode;
  if (fiber.effectTag === PLACEMENT && fiber.tag !== CLASS) {
    domParent.appendChild(fiber.stateNode);
  } else if (fiber.effectTag === UPDATE) {
    updateDomProperties(fiber.stateNode, fiber.alternate.props, fiber.props);
  } else if (fiber.effectTag === DELETION) {
    commitDeletion(fiber, domParent);
  }
};

var commitDeletion = function commitDeletion(fiber, parentDom) {
  var node = fiber;
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

// Global queue/state for rendering process
var globalQueue = {
  updateQueue: [],
  nextFiber: null,
  pendingCommit: null

  // Initializers (adds changes to queue)
};var render = function render(elements, rootDom) {
  globalQueue.updateQueue.push({
    from: HOST,
    dom: rootDom,
    newProps: {
      children: elements
    }
  });
  requestIdleCallback(processQueue);
};

var scheduleUpdate = function scheduleUpdate(instance, newStateStuff) {
  globalQueue.updateQueue.push({
    from: CLASS,
    instance: instance,
    newStateStuff: newStateStuff
  });
  requestIdleCallback(processQueue);
};

// Callback that fires off the workflow loop
var processQueue = function processQueue(deadline) {
  workLoop(deadline);
  if (globalQueue.nextFiber || globalQueue.updateQueue.length > 0) {
    requestIdleCallback(processQueue);
  }
};

// Master function that handles the three stages of the workflow
var workLoop = function workLoop(deadline) {
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
var getNextFiber = function getNextFiber() {
  var update = globalQueue.updateQueue.shift();
  if (!update) {
    return;
  }

  if (update.newStateStuff) {
    update.instance.__fiber.newStateStuff = update.newStateStuff;
  }

  var root = update.from == HOST ? update.dom._rootContainerFiber : getRoot(update.instance.__fiber);

  globalQueue.nextFiber = {
    tag: HOST,
    stateNode: update.dom || root.stateNode,
    props: update.newProps || root.props,
    alternate: root
  };
};

var getRoot = function getRoot(fiber) {
  var node = fiber;
  while (node.parent) {
    node = node.parent;
  }
  return node;
};

var asyncToGenerator = function (fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new Promise(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }

      return step("next");
    });
  };
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var Component = function () {
  function Component(props) {
    classCallCheck(this, Component);

    this.props = props;
    this.state = this.state || {};
  }

  createClass(Component, [{
    key: "setState",
    value: function setState(newStateStuff) {
      scheduleUpdate(this, newStateStuff);
    }
  }, {
    key: "forceUpdate",
    value: function forceUpdate() {
      scheduleUpdate(this, {});
    }

    //lifecycle methods

  }, {
    key: "componentWillMount",
    value: function componentWillMount() {}
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {}
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps() {}
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate() {
      return true;
    }
  }, {
    key: "componentWillUpdate",
    value: function componentWillUpdate() {}
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {}
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {}
  }]);
  return Component;
}();

var Weact = {
  createElement: createElement,
  Component: Component,
  render: render
};

var Welcome = function Welcome() {
  return Weact.createElement(
    "section",
    { className: "text-field" },
    Weact.createElement(
      "h2",
      null,
      "Welcome"
    ),
    Weact.createElement(
      "p",
      null,
      "This project was built with love out of a desire to understand how React works under the hood. It supports JSX parsing, component state, props, functional components, class components, and all current lifecycle methods - future updates will incorporate the new lifecyle methods coming soon to React. It also features an incremental rendering and reconciliation process based on React's new fiber architecture. See this post on my blog for more info on this project!"
    ),
    Weact.createElement(
      "p",
      null,
      "I put together a few widgets to show Weact in action. Enjoy!"
    ),
    Weact.createElement(
      "p",
      null,
      "-Matt"
    )
  );
};

var APIKey = "U1cuu7wiatumcI2ymI8lpFDbe5zURI5d";

var _this = undefined;

var fetchRandomGif = function () {
  var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(tag) {
    var response, gifInfo;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return fetch("https://api.giphy.com/v1/gifs/random?api_key=" + APIKey + "&tag=" + tag + "&rating=G");

          case 2:
            response = _context.sent;
            _context.next = 5;
            return response.json();

          case 5:
            gifInfo = _context.sent;
            return _context.abrupt("return", gifInfo);

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, _this);
  }));

  return function fetchRandomGif(_x) {
    return _ref.apply(this, arguments);
  };
}();

var GifOMatic = function (_Weact$Component) {
  inherits(GifOMatic, _Weact$Component);

  function GifOMatic(props) {
    classCallCheck(this, GifOMatic);

    var _this = possibleConstructorReturn(this, (GifOMatic.__proto__ || Object.getPrototypeOf(GifOMatic)).call(this, props));

    _this.state = { searchTerm: "", gif: null };
    _this.handleSearchSubmit = _this.handleSearchSubmit.bind(_this);
    _this.handleChange = _this.handleChange.bind(_this);
    return _this;
  }

  createClass(GifOMatic, [{
    key: "handleSearchSubmit",
    value: function handleSearchSubmit() {
      var _this2 = this;

      fetchRandomGif(this.state.searchTerm).then(function (gif) {
        _this2.setState({ gif: gif });
      });
    }
  }, {
    key: "handleChange",
    value: function handleChange(e) {
      this.setState({ searchTerm: e.target.value });
    }
  }, {
    key: "render",
    value: function render() {
      return Weact.createElement(
        "section",
        null,
        Weact.createElement(
          "h1",
          null,
          "Gif-O-Matic"
        ),
        Weact.createElement(
          "h3",
          null,
          "Use Weact to make calls to the GIPHY api."
        ),
        Weact.createElement(
          "form",
          null,
          Weact.createElement("input", {
            type: "text",
            onChange: this.handleChange,
            value: this.state.searchTerm
          }),
          Weact.createElement("input", { type: "submit", value: "Fetch Gif!" })
        ),
        Weact.createElement(
          "aside",
          null,
          this.state.gif ? Weact.createElement("img", { src: this.state.gif.embed_url }) : null
        )
      );
    }
  }]);
  return GifOMatic;
}(Weact.Component);

var routes = [];

var registerRoute = function registerRoute(route) {
  return routes.push(route);
};
var unregisterRoute = function unregisterRoute(route) {
  return routes.splice(routes.indexOf(route));
};

var historyPush = function historyPush(path) {
  history.pushState({}, null, path);
  routes.forEach(function (route) {
    return route.forceUpdate();
  });
};

var matchPath = function matchPath(pathname, options) {
  var _options$exact = options.exact,
      exact = _options$exact === undefined ? false : _options$exact,
      path = options.path;

  var pathArray = path.split("/");
  var currentPathArray = pathname.split("/");
  var params = {};

  if (exact && pathArray.length !== currentPathArray.length) {
    return null;
  }
  for (var i = 0; i < currentPathArray.length; i++) {
    if (pathArray[i] && pathArray[i].startsWith(":")) {
      params[pathArray[i].slice(1)] = currentPathArray[i];
    } else if (currentPathArray[i] !== pathArray[i]) {
      return null;
    }
  }

  return {
    path: path,
    url: pathname,
    params: params
  };
};

var Route = function (_Weact$Component) {
  inherits(Route, _Weact$Component);

  function Route(props) {
    classCallCheck(this, Route);

    var _this = possibleConstructorReturn(this, (Route.__proto__ || Object.getPrototypeOf(Route)).call(this, props));

    _this.handleHistoryChange = _this.handleHistoryChange.bind(_this);
    return _this;
  }

  createClass(Route, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      document.addEventListener("popstate", this.handleHistoryChange);
      registerRoute(this);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      document.removeEventListener("popstate", this.handleHistoryChange);
      unregisterRoute(this);
    }
  }, {
    key: "handleHistoryChange",
    value: function handleHistoryChange() {
      this.forceUpdate();
    }
  }, {
    key: "render",
    value: function render() {
      var _props = this.props,
          exact = _props.exact,
          path = _props.path,
          Component = _props.component,
          render = _props.render;

      var match = matchPath(location.pathname, { path: path, exact: exact });

      if (!match) {
        return null;
      }

      if (component) {
        return Weact.createElement(Component, { match: match });
      }

      if (render) {
        return render({ match: match });
      }

      return null;
    }
  }]);
  return Route;
}(Weact.Component);

var Link = function (_Weact$Component) {
  inherits(Link, _Weact$Component);

  function Link(props) {
    classCallCheck(this, Link);

    var _this = possibleConstructorReturn(this, (Link.__proto__ || Object.getPrototypeOf(Link)).call(this, props));

    _this.handleClick = _this.handleClick.bind(_this);
    return _this;
  }

  createClass(Link, [{
    key: "handleClick",
    value: function handleClick(e) {
      e.preventDefault();
      var to = this.props.to;

      historyPush(to);
    }
  }, {
    key: "render",
    value: function render() {
      var _props = this.props,
          to = _props.to,
          children = _props.children;

      return Weact.createElement(
        "a",
        { href: to, onClick: this.handleClick },
        children
      );
    }
  }]);
  return Link;
}(Weact.Component);

var App = function App() {
  var pages = [Weact.createElement(Welcome, null), Weact.createElement(GifOMatic, null)];
  return Weact.createElement(
    "main",
    { className: "app" },
    Weact.createElement(
      "h1",
      null,
      "Welcome to Weact!"
    ),
    Weact.createElement(
      "h3",
      null,
      "Just like React, only wee"
    ),
    Weact.createElement(
      "section",
      { id: "main-area" },
      Weact.createElement(Route, { exact: true, path: "/", component: Welcome })
    )
  );
};

/** @jsx Weact.createElement */

Weact.render(Weact.createElement(App, null), document.getElementById("root"));
