import Weact from "../weact.js";
import Redirect from "./redirect.jsx";

const hashRouter = ({ hostname, children }) => {
  if (!hostname) {
    hostname = location.hostname;
  }
  const path = location.href.slice(hostname.length + 8);
  if (!path.startsWith("#")) {
    return <Redirect to={`/#${path}`} />;
  } else {
    return children;
  }
};

export default hashRouter;
