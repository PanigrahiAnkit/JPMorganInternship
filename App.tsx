import React, { Component } from 'react';
import './App.css';
import Graph from './Graph';
import DataStreamer, { ServerRespond } from './DataStreamer';

/**
 * State declaration for <App />
 */
interface IState {
  data: ServerRespond[],
  showGraph: boolean,
}

/**
 * The parent element of the react app.
 * It renders title, button and Graph react element.
 */
class App extends Component<{}, IState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      data: [],
      showGraph: false,
    };
  }

  /**
   * Render Graph react component with state.data parse as property data
   */
  renderGraph() {
    if (this.state.showGraph) {
      return (<Graph data={this.state.data} />);
    }
  }

  /**
   * Get new data from server and update the state with the new data
   */
  getDataFromServer() {
    let x = 0;
    const interval = setInterval(() => {
      DataStreamer.getData((serverResponds: ServerRespond[]) => {
        this.setState({
          data: serverResponds,
          showGraph: true,
        });
      });
      x++;
      if (x > 1000) {
        clearInterval(interval);
      }
    }, 100);
  }

  /**
   * Render the app
   */
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Stock Price Monitor</h1>
        </header>
        <div className="App-content">
          <button onClick={() => { this.getDataFromServer() }}>
            Start Streaming Data
          </button>
          {this.renderGraph()}
        </div>
      </div>
    )
  }
}

export default App;
