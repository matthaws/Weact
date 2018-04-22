import Weact from "../weact.js";
import { registerRoute, unregisterRoute, matchPath } from "./router_util";

class Route extends Weact.Component {
  constructor(props) {
    super(props);
    this.handleHistoryChange = this.handleHistoryChange.bind(this);
  }

  componentWillMount() {
    document.addEventListener("popstate", this.handleHistoryChange);
    registerRoute(this);
  }

  componentWillUnmount() {
    document.removeEventListener("popstate", this.handleHistoryChange);
    unregisterRoute(this);
  }

  handleHistoryChange() {
    this.forceUpdate();
  }

  render() {
    const { exact, path, component: Component, render } = this.props;
    const match = matchPath(location.pathname, { path, exact });
    if (!match) {
      return null;
    }

    if (Component) {
      return <Component match={match} />;
    }

    if (render) {
      return render({ match });
    }

    return null;
  }
}

export default Route;
