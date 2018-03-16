/** @jsx Weact.createElement */
import Weact from "./weact";
import WeactDOM from "./weact-dom";

class Hello extends Weact.Component {
  render() {
    return (
      <div>
        <h1 key="hello"> Hello World! </h1>
        <ul key="ul">
          <li key="1"> Thing 1 </li>
          <li key="2"> Thing 2 </li>
        </ul>
      </div>
    );
  }
}

WeactDOM.render(<Hello />, document.getElementById("root"));
