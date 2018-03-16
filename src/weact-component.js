export class Component {
  constructor(props) {
    this.props = props;
    this.state = this.state || {}
  }

  setState(newStateStuff) {
    scheduleUpdate(this, newStateStuff);
  }
}

export const createInstance = (fiber) => {
  const instance = new fiber.type(fiber.props);
  instance.fiber = fiber;
  return instance;
}
