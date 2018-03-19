/** @jsx Weact.createElement */
import Weact from "./weact/weact";
import WeactDOM from "./weact-dom/weact-dom";

class TestApp extends Weact.Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
  }

  componentDidMount() {
    console.log("did mount!")
  }

  componentWillReceiveProps(props, nextProps) {
    console.log([props, nextProps])
  }

  componentWillUnmount() {
    console.log(unmounting!)
  }

  render() {
    if (this.state.open) {
      return (
        <div>
          <h1> The tab is open! </h1>
          <button onClick={e => this.setState({ open: false })}>Close</button>
        </div>
      );
    }
    return (
      <div>
        <button onClick={e => this.setState({ open: true })}> Open </button>
      </div>
    );
  }
}

WeactDOM.render(<TestApp />, document.getElementById("root"));
