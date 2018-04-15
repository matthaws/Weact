import Weact from "../weact/weact";
import Welcome from "./components/welcome.jsx";
import Route from "../weact/router/route.jsx";
import Link from "../weact/router/link.jsx";

const App = () => {
  return (
    <main className="app">
      <h1>Welcome to Weact!</h1>
      <h3>Just like React, only wee</h3>
      <section id="main-area">
        <Route exact path="/" component={Welcome} />
      </section>
    </main>
  );
};

export default App;
