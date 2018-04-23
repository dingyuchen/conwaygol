import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

function Box(props) {
  if (props.value) {
    return (
      <div className="box on" onClick={props.onClick}></div>
    );
  } else {
    return (
      <div className="box off" onClick={props.onClick}></div>
    );
  }
}

class Grid extends Component {

  renderBoxes(arr) {
    //returns an arr of Box components
    const boxArr = arr.map((row, x) => row.map((col, y) => {
      return <Box
        key={[x, y]}
        value={col}
        onClick={() => this.props.onClick(x, y)}
      />
    }));
    return boxArr;
  }

  render() {
    const boxArr = this.props.grid;

    return (
      <div className="grid">
        {this.renderBoxes(boxArr)}
      </div>
    );
  }
}

class Main extends Component {
  constructor() {
    super();
    this.cols = 50;
    this.rows = 30;
    this.session = null;
    this.state = {
      generations: 0,
      grid: [...Array(this.rows).fill(null).map(row => [...Array(this.cols).fill(null).map(col => false)])],
    }
  }

  handleClick(row, col) {
    let { grid } = this.state;
    grid[row][col] = !grid[row][col];
    this.setState({ grid });
  }

  seed() {
    const { grid } = this.state;

    const newGrid = grid.map(row => row.map(col => {
      return Math.random() * 4 > 3;
    }));

    this.setState({
      grid: newGrid,
    });
  }

  step() {
    let { generations, grid, session } = this.state;

    if(!session) {
      clearInterval(session);
    }

    const neighbours = (row, col) => {
      let ctr = 0;
      for (let i = row - 1; i <= row + 1; i++) {
        for (let j = col - 1; j <= col + 1; j++) {
          if (i < 0 || i >= this.rows || j < 0 || j >= this.cols) {
            continue;
          }
          if (grid[i][j]) {
            ctr++;
          }
        }
      }
      return ctr;
    };

    let nextStep = grid.map((row, i) => row.map((col, j) => {
      // each col with index [i][j] == true || false;
      // if 3 neighbours, center must always be true
      // if 4 neighbours, center remains same
      // else always false
      return neighbours(i, j) === 3 ? true : neighbours(i, j) === 4 ? col : false;
    }));

    this.setState({
      generations: generations += 1,
      grid: nextStep
    });

  }

  play() {
    this.session = setInterval(() => this.step(), 200);
  }

  stop() {
    clearInterval(this.session);
  }

  clear() {
    clearInterval(this.session);

    this.setState({
      generations: 0,
      grid: [...Array(this.rows).fill(null).map(row => [...Array(this.cols).fill(null).map(col => false)])],
    });
  }

  render() {
    const { generations } = this.state;
    // const gridTemplate = {
    //   gridTemplateColumns: `repeat(${this.cols}, 1fr)`
    // }

    return (
      <div className="container">
        <div className="title">Conway's Game of Life in React</div>
        <Grid
          grid={this.state.grid}
          rows={this.rows}
          cols={this.cols}
          onClick={(row, col) => this.handleClick(row, col)}
        // style={gridTemplate}
        />
        <div className="info">Generations: {generations}</div>
        <button onClick={() => this.play()}>Play</button>
        <button onClick={() => this.step()}>Step</button>
        <button onClick={() => this.stop()}>Stop</button>
        <button onClick={() => this.seed()}>Seed</button>
        <button onClick={() => this.clear()}>Clear</button>
      </div>
    );
  }
}

ReactDOM.render(<Main />, document.getElementById('root'));
registerServiceWorker();
