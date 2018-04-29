import Weact from "../../weact/weact.js";

const Welcome = () => (
  <section className="text-field">
    <h2>Welcome</h2>
    <p>
      This project was built with love out of a desire to understand how React
      works under the hood. It supports JSX parsing, component state, props,
      functional components, class components, and all current lifecycle methods
      as well - future updates will incorporate the new lifecyle methods coming
      soon to React. It supports basic routing similar to react-router, and it
      also features an incremental rendering and reconciliation process based on
      React's new fiber architecture. See this
      <a href="http://matthaws.com/the-blog/posts/react-fiber/">
        post on my blog
      </a>
      for more info on this project!
    </p>
  </section>
);

export default Welcome;
