import Weact from "../weact.js";
import Redirect from "./redirect.jsx";

const hashRouter = ({ rootFolder = "", children }) => {
  if (!location.href.split("").includes("#")) {
    return <Redirect to={location.pathname} />;
  } else {
    return <main>{children}</main>;
  }
};

export default hashRouter;
