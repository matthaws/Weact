import Weact from "../weact/weact";
import Welcome from "./components/welcome.jsx";
import GifOMatic from "./components/gifomatic.jsx";
import Route from "../weact/router/route";
import Link from "../weact/router/link";

const App = () => {
  const pages = [<Welcome />, <GifOMatic />];
  const tabs = ["Welcome", "Gif-O-Matic"];
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
