

export class Component {
  constructor(props) {
    this.props = props;
    this.state = this.state || {}
  }

  setState(newStateStuff) {
    this.state = Object.assign({}, this.state, newStateStuff);
    updateInstance(this.internalInstance)
  }
}

export const updateInstance = (internalInstance) => {
  const parentDomElement = internalInstance.dom.parentNode;
  const element = internalInstnace.element;
  reconcile(parentDom, internalInstance, element);

}
