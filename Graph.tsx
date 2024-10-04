import React, { Component } from 'react';
import { Table } from '@finos/perspective';
import { ServerRespond } from './DataStreamer';

/**
 * Interface for props passed to <Graph />
 */
interface IProps {
  data: ServerRespond[],
}

/**
 * Perspective library adds load to HTMLElement prototype.
 * This interface acts as a wrapper for Typescript compiler.
 */
interface PerspectiveViewerElement extends HTMLElement {
  load: (table: Table) => void,
}

/**
 * React component that renders the graph using Perspective
 */
class Graph extends Component<IProps, {}> {
  table: Table | undefined;

  render() {
    return (
      <perspective-viewer></perspective-viewer>
    );
  }

  componentDidMount() {
    console.log('rendering');
    // Get element to attach the table from the DOM.
    const elem = document.getElementsByTagName('perspective-viewer')[0] as unknown as PerspectiveViewerElement;

    const schema = {
      stock: 'string',
      top_ask_price: 'float',
      top_bid_price: 'float',
      timestamp: 'date',
    };

    if (window.perspective) {
      this.table = window.perspective.worker().table(schema);
    }
    if (this.table) {
      console.log('change table');
      // Load the `table` in the `<perspective-viewer>` DOM reference.
      elem.load(this.table);
      elem.setAttribute('view', 'y_line');
      elem.setAttribute('column-pivots', '["stock"]');
      elem.setAttribute('row-pivots', '["timestamp"]');
      elem.setAttribute('columns', '["top_ask_price"]');
      elem.setAttribute('aggregates', '{"stock":"distinct count","top_ask_price":"avg","top_bid_price":"avg","timestamp":"distinct count"}');
    }
  }

  componentDidUpdate() {
    if (this.table) {
      this.table.update([
        {
          stock: this.props.data[0].stock,
          top_ask_price: this.props.data[0].top_ask && this.props.data[0].top_ask.price || 0,
          top_bid_price: this.props.data[0].top_bid && this.props.data[0].top_bid.price || 0,
          timestamp: this.props.data[0].timestamp,
        },
      ]);
    }
  }
}

export default Graph;
