const start = Date.now();

import React from 'react';
import { render } from 'react-dom';
import './style.css';
import { Router, Route, Link, hashHistory } from 'react-router';
import Perf from 'react-addons-perf';

const CounterDisplayStateless = props => (
  <div
    onClick={ props.onClick}
    className="box">
    {props.item}-{Date.now() - start}<sup>{props.index}</sup>
  </div>
);

class CounterDisplayComponent extends React.Component {
  render() {
    return (
      <div
        onClick={ this.props.onClick }
        className="box">
        {this.props.item}-{Date.now() - start}<sup>{this.props.index}</sup>
      </div>
    );
  }
}

class CounterDisplayComponentWithSCU extends CounterDisplayComponent {
  shouldComponentUpdate(nextProps) {
    return nextProps.index !== this.props.index || nextProps.item !== this.props.item;
  }
}

class SimpleApp extends React.Component {
  constructor(...args) {
    super(...args);
    const boxes = new Array(1000);
    boxes.fill(0);
    this.state = {
      boxes: boxes
    }
  }

  handleClick(index) {
    const {
      method
    } = this.props.location.query;
    Perf.start();
    this.state.boxes[index]++;
    this.setState({
      boxes: [...this.state.boxes]
    }, ()=> {
      Perf.stop();
      const measurements = Perf.getLastMeasurements();
      console.log(method, measurements[0])
      // Perf.printOperations(measurements);
      // Perf.printInclusive(measurements);
      // Perf.printExclusive(measurements);
      // Perf.printWasted(measurements);
    })
  }

  render() {
    const {
      method
    } = this.props.location.query;

    if (this[method]) {
      return this[method]();
    }

    return (
      <div>
        Choose a rendering method
      </div>
    );
  }

  renderJSX() {
    return (
      <div>
        {
          this.state.boxes.map((item, index) => (
            <div
              className="box"
              key={`${index}-${item}`}
              onClick={ this.handleClick.bind(this,index)}>
              {item}-{Date.now() - start}<sup>{index}</sup>
            </div>
          ))
        }
      </div>
    );
  }

  renderStateless() {
    return (
      <div>
        {
          this.state.boxes.map((item, index) => (
            <CounterDisplayStateless
              item={item}
              index={index}
              key={`${index}-${item}`}
              onClick={ this.handleClick.bind(this,index)}
            />
          ))
        }
      </div>
    );
  }

  renderComponent() {
    return (
      <div>
        {
          this.state.boxes.map((item, index) => (
            <CounterDisplayComponent
              item={item}
              index={index}
              key={`${index}-${item}`}
              onClick={ this.handleClick.bind(this,index)}
            />
          ))
        }
      </div>
    );
  }

  renderComponentWithSCU() {
    return (
      <div>
        {
          this.state.boxes.map((item, index) => (
            <CounterDisplayComponentWithSCU
              item={item}
              index={index}
              key={index}
              onClick={ this.handleClick.bind(this,index)}
            />
          ))
        }
      </div>
    );
  }
}


const RENDER_METHODS = [
  "renderJSX",
  "renderStateless",
  "renderComponent",
  "renderComponentWithSCU"
]

const Entry = props => (
  <div>
    <ol>
      {
        RENDER_METHODS.map(name => (
          <li key={name}>
            <Link activeClassName="active" to={`/?method=${name}`}>
              {name}
            </Link>
          </li>
        ))
      }
    </ol>
    {props.children}
  </div>
);

const element = document.createElement('div');
document.body.appendChild(element);

render(<Router history={hashHistory}>
  <Route component={ Entry }>
    <Route path="/" component={ SimpleApp }/>
  </Route>
</Router>, element);
