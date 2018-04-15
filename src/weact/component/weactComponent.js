import { scheduleUpdate } from "../fiber/1-fiberLoop";

export class Component {
  constructor(props) {
    this.props = props;
    this.state = this.state || {};
  }

  setState(newStateStuff) {
    scheduleUpdate(this, newStateStuff);
  }

  forceUpdate() {
    scheduleUpdate(this, {});
  }

  //lifecycle methods

  componentWillMount() {}

  componentDidMount() {}

  componentWillReceiveProps() {}

  shouldComponentUpdate() {
    return true;
  }

  componentWillUpdate() {}

  componentDidUpdate() {}

  componentWillUnmount() {}
}
