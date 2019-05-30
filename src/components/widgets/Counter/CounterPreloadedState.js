import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// actionCreators
import { incrementPreloadedState, decrementPreloadedState  } from '../../../redux/modules/counter';

// UI bindings
@connect(
  (state) => ({ count: state.counter.countPreloadedState }),
  (dispatch) => bindActionCreators({ incrementPreloadedState, decrementPreloadedState }, dispatch)
)

class CounterPreloadedState extends Component {

  static propTypes = {
    count: PropTypes.number.isRequired,
    incrementPreloadedState: PropTypes.func.isRequired,
    decrementPreloadedState: PropTypes.func.isRequired,
  };

  componentDidMount() {
    console.log('>>>>>>>>>>>>>>>> CounterPreloadedState > componentDidMount <<<<<<<<<<<<<<<<<<<<<<');
    console.log('>>>>>>>>>>>>>>>> CounterPreloadedState > componentDidMount > this.props.count: ', this.props.count);
  }

  componentWillUnmount() {
    console.log('>>>>>>>>>>>>>>>> CounterPreloadedState > componentWillUnmount <<<<<<<<<<<<<<<<<<<<<<');
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   console.log('>>>>>>>>>>>>>>>> CounterPreloadedState > shouldComponentUpdate <<<<<<<<<<<<<<<<<<<<<<');
  // };

  // static getDerivedStateFromProps(props, state) {
  //   console.log('>>>>>>>>>>>>>>>> CounterPreloadedState > getDerivedStateFromProps <<<<<<<<<<<<<<<<<<<<<<');
  // };

  render() {

    // const styles = require('./scss/CounterPreloadedState.scss');
    const { count, incrementPreloadedState, decrementPreloadedState } = this.props;

    console.log('>>>>>>>>>>>>>>>> CounterPreloadedState > render() > this.props.count: ', this.props.count);

    return (

      <div className="row justify-content-center">
        <div className="col-md-auto">

          <div className="d-flex bg-color-ivory container-padding-border-radius-2">

            <div className="width-400 text-center">

              <div className="row">

                <div className="col mb-3">
                  Counter Preloaded State Clicked: {count} times
                </div>

              </div>

              <div className="row">

                <div className="col-lg-6 col-md-6 col-sm-12 mb-lg-0 mb-md-0 mb-sm-2 mb-2">
                  <button onClick={decrementPreloadedState} className="btn btn-primary">decrement counter</button>
                </div>

                <div className="col-lg-6 col-md-6 col-sm-12">
                  <button onClick={incrementPreloadedState} className="btn btn-primary">increment counter</button>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    );
  }
};

export default CounterPreloadedState;
