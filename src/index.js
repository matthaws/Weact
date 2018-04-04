/** @jsx Weact.createElement */
import Weact from "./weact/weact";
import WeactDOM from "./weact-dom/weact-dom";

const TestFunc = (props) => {
  return (
    <p>Test Func is {props.sampleProp}</p>
  )
}

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
    console.log("unmounting!")
  }

  render() {
    return (
      <div>
        <TestFunc sampleProp="Hello" />
      </div>
    )
  }
}



WeactDOM.render(<TestApp />, document.getElementById("root"));
