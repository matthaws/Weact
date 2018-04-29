# Weact

### Wee little recreation of React

A dive into React's magic through recreating its core features.

## Features

* JSX parsing via Babel, Rollup, and Weact.createElement. Use JSX syntax to your heart's content!

* Class and pure functional components, including all standard lifecycle methods, props, and state.

* Processes and updates event handlers, attributes, and inline styles to the DOM

* Uses an incremental rendering, time-slicing reconciliation workflow inspired by the new React Fiber architecture. Reconciliation with the virtual DOM doesn't block the thread, woo hoo! [This post on my blog](http://matthaws.com/the-blog/posts/react-fiber/) gives more details on how I implemented this.

* Now includes basic routing with Route, Link, and Redirect classes!

* Now includes "Wedux" with `createStore` and `combineReducers`. Basic Weact integration is provided in the form of a `configureConnect` function that uses closure (rather than a Provider and the React context API, which is not yet part of Weact) to create a connect function that will create a connected Higher Order Component with access to Wedux state and dispatch.

## Acknowledgements

React is a very clever piece of tech, especially its new Fiber plumbing, and I'm indebted to some great articles and guides for helping me dig in and get to grips on the concepts and how to recreate them. I highly recommend checking them out, especially if you are at all interested in embarking on a similar project:

* [Andrew Clark's "React Fiber Architecture"](https://github.com/acdlite/react-fiber-architecture) - an excellent high level overview from an excellent source!

* [Rodrigo Pombo's "Build Your Own React"](https://engineering.hexacta.com/didact-fiber-incremental-reconciliation-b2fe028dcaec) - An incredibly helpful series of posts laying out classic React virtual DOM diffing and, in the latest post, the best and most detailed discussion of Fiber implementation I've seen yet.

* [Ofir Dagan's "Build Your Own React"](https://hackernoon.com/build-your-own-react-48edb8ed350d) This is just for classic, simple reconciliation, no Fiber, but is a very helpful dive into basic React functionality.
