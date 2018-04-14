import Weact from "../weact/weact";
import Welcome from "./components/welcome.jsx";
import GifOMatic from "./components/gifomatic.jsx";

class App extends Weact.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0
    };

    this.handleTabChange = this.handleTabChange.bind(this);
  }

  handleTabChange(idx) {
    return () => {
      this.setState({ page: idx });
    };
  }

  render() {
    const pages = [<Welcome />, <GifOMatic />];
    const tabs = ["Welcome", "Gif-O-Matic"];
    return (
      <main className="app">
        <h1>Welcome to Weact!</h1>
        <h3>Just like React, only wee</h3>
        <section id="main-area">
          <ul id="tabs">
            {tabs.map((tab, idx) => {
              const className = this.state.page === idx ? "selected" : null;
              return (
                <li
                  onClick={this.handleTabChange(idx)}
                  key={tab}
                  className={className}
                >
                  {tab}
                </li>
              );
            })}
          </ul>
          {pages[this.state.page]}
        </section>
      </main>
    );
  }
}

export default App;
