

export default class Clock extends Component {

  constructor(props) {
    super(props);

    this.state = {
      time: 1000
    };
  }
  
  increment() {
    this.setState({
      time: this.state.time + 1
    });
    console.log("APP", JSON.stringify(app), app.state.time);
  }

	render() {
    console.log(app.state.clock);
		return <div>
      <span> Time: { this.state.time }</span>
        <div>
          <button onclick={this.increment.bind(this)}>Increment</button>
        </div>
      </div>
	}
}
