import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import * as d3 from 'd3';


class Planets extends Component {

  constructor(props) {
    super(props);

    this.state = {
      error: false,
      isLoading: true,
      externalData: null,
    };
  }

  static propTypes = {
    height: PropTypes.number,
    columnWidth: PropTypes.number,
    scale: PropTypes.number,
  };

  static defaultProps = {
    height: 600,
    columnWidth: 95,
    scale: 0,
  };

  showChart = (planets) => {

    const { height, columnWidth, scale } = this.props;

    // document.getElementById('chart').innerHTML = null;

    // const scale = d3.scaleLinear()
    //   .domain([0, d3.max(planets.reduce((acc, curr) => {
    //     acc.push(curr.moons.length);
    //     return acc;
    //   }, []))])
    //   .range([0, 0.05]);

    const fillColors = i => {
      return `rgb(${Array(3).fill(150 + i * 40).join(', ')})`;
    };

    const chart = d3.select(this.refs.wavePath)
      .attr('width', planets.length * columnWidth)
      .attr('height', height);

    // const planet = chart.selectAll('g')
    //   .data(planets)
    //   .enter().append('g')
    //   .attr('transform', (_, i) => `translate(${i * columnWidth + 40}, 320)`);

    // planet.append('circle')
    //   .attr('cx', 15)
    //   .attr('cy', -160)
    //   .attr('r', _ => scale(_.diameter))
    //   .style('fill', (_, i) => fillColors(i % 3));

    // planet.append('text')
    //   .attr('class', 'label')
    //   .attr('y', -20)
    //   .attr('x', 0)
    //   .attr('dy', '.35em')
    //   .text(_ => _.name);
  }

  setTimeoutCallback = (d) => this.setState({ error: null, isLoading: null, externalData: d });

  // D3 >> uses .select && .selectAll operations
  // .select && .selectAll means D3 not usable until after elements have been rendered
  // componentDidMount() >> allows selecting and operating on elements after they have been rendered
  componentDidMount() {
    console.log('>>>>>>>>>>>>>>>> Planets > componentDidMount() <<<<<<<<<<<<<<<<<<<<<<');
    axios.get('/json-data/planets.json')
      .then(response => {
        console.log('>>>>>>>>>>>>>>>> Planets > componentDidMount() > JSON >>>>>> response1: ', response);
        console.log('>>>>>>>>>>>>>>>> Planets > componentDidMount() > JSON > response.data2: ', response.data);
        this.setState({ error: null, isLoading: null, externalData: response.data })
        // this.showChart(response.planets)
      })
  }

  componentDidUpdate(prevProps, prevState) {
    const { error, isLoading, externalData } = this.state;
    this.showChart(externalData);
    console.log('>>>>>>>>>>>>>>>> Planets > componentDidUpdate()1 <<<<<<<<<<<<<<', externalData);
    // if (externalData === null && !error && isLoading) {
    //   console.log('>>>>>>>>>>>>>>>> Planets > componentDidUpdate()2 <<<<<<<<<<<<<<');
    //   // this.requestDataPromise(`${dropDownOptionSelected}`);
    // }
  }

  componentWillUnmount() {
    console.log('>>>>>>>>>>>>>>>> Planets > componentWillUnmount() <<<<<<<<<<<<<<<<<<<<<<');
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   console.log('>>>>>>>>>>>>>>>> Planets > shouldComponentUpdate <<<<<<<<<<<<<<<<<<<<<<');
  // };

  // static getDerivedStateFromProps(props, state) {
  //   console.log('>>>>>>>>>>>>>>>> Planets > getDerivedStateFromProps <<<<<<<<<<<<<<<<<<<<<<');
  // };

  render() {

    // const styles = require('./scss/Planets.scss');
    const { height, columnWidth, scale } = this.props;

    console.log('>>>>>>>>>>>>>>>> Planets > render() <<<<<<<<<<<<<<<<<<<');

    return (

      <div className="row justify-content-md-center">
        <div className="col-md-auto">

          <div className="container-flex bg-color-ivory container-padding-border-radius-2">
            <div className="width-400">

              <p>The planets, dwarf planets and moons of the Solar System</p>

              <svg id="planets" ref="wavePath"></svg>

            </div>
          </div>

        </div>
      </div>
    );
  }
};

export default Planets;
