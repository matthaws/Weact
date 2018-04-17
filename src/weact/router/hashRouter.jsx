import Weact from "../weact.js";
import Redirect from "./redirect.jsx";

const hashRouter = ({ rootFolder = "", children }) => {
  const pathStart =
    location.protocol.length + 3 + location.hostname.length + rootFolder.length;
  const appPath = location.href.split(pathStart);
  debugger;
  if (!appPath.startsWith("#")) {
    return <Redirect to={`${rootFolder}/#/${appPath}`} />;
  } else {
    return <main>{children}</main>;
  }
};

export default hashRouter;
