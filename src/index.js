/** @jsx Weact.createElement */
import "babel-polyfill";
import Weact from "./weact/weact";
import DemoApp from "./demo/App.jsx";

Weact.render(<DemoApp />, document.getElementById("root"));
