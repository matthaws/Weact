import Weact from "../../weact/weact.js";

class GifOMatic extends Weact.Component {
  constructor(props) {
    super(props);
    this.state = { searchTerm: "", gif: null };
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSearchSubmit() {
    // fetchRandomGif(this.state.searchTerm).then(gif => {
    //   this.setState({ gif });
    // });
  }

  handleChange(e) {
    this.setState({ searchTerm: e.target.value });
  }

  render() {
    return (
      <section>
        <h1>Gif-O-Matic</h1>
        <h3>Use Weact to make calls to the GIPHY api.</h3>
        <form>
          <input
            type="text"
            onChange={this.handleChange}
            value={this.state.searchTerm}
          />
          <input type="submit" value="Fetch Gif!" />
        </form>
        <aside>
          {this.state.gif ? <img src={this.state.gif.embed_url} /> : null}
        </aside>
      </section>
    );
  }
}

export default GifOMatic;
