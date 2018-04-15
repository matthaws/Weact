import Weact from "../weact.js";
import { historyPush } from "./router_util";

class Link extends Weact.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    const { to } = this.props;
    historyPush(to);
  }

  render() {
    const { to, children } = this.props;
    return (
      <a href={to} onClick={this.handleClick}>
        {children}
      </a>
    );
  }
}
