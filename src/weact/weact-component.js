import { scheduleUpdate } from "../weact-fiber/weact-fiber";

export class Component {
  constructor(props) {
    this.props = props;
    this.state = this.state || {}
  }

  setState(newStateStuff) {
    scheduleUpdate(this, newStateStuff);
  }
}
