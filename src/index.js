/** @jsx Weact.createElement */
import Weact from "./weact";
import WeactDOM from "./weact-dom";

const element = (
  <div>
    <h1 key="hello"> Hello World! </h1>
    <ul key="ul">
      <li key="1"> Thing 1 </li>
      <li key="2"> Thing 2 </li>
    </ul>
  </div>
);

WeactDOM.render(element, document.getElementById("root"));
