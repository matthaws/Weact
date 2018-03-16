/** @jsx Weact.createElement */
import Weact from "./weact";
import WeactDOM from "./weact-dom";

const element = (
  <div> HELLO WORLD </div>
);

WeactDOM.render(element, document.getElementById("root"));
