import Weact from "../weact";
import { historyPush, historyReplace } from "./router_util";

class Redirect extends Weact.Component {
  componentDidMount() {
    const { to, push } = this.props;
    if (push) {
      historyPush(to);
    } else {
      historyReplace(to);
    }
  }

  render() {
    return null;
  }
}

export default Redirect;
