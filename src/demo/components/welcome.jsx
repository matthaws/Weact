import Weact from "../../weact/weact.js";


const Welcome = () => (
  <section className="text-field">
    <h2>Welcome</h2>
    <p>This project was built with love out of a desire to understand how React
      works under the hood. It supports JSX parsing, component state, props,
      functional components, class components, and all current lifecycle methods -
      future updates will incorporate the new lifecyle methods coming soon to React.
      It also features an incremental rendering and reconciliation process based on
      React's new fiber architecture. See this post on my blog for more info on
      this project!
    </p>
    <p>I put together a few widgets to show Weact in action. Enjoy!</p>
    <p>-Matt</p>
  </section>
)

export default Welcome;
