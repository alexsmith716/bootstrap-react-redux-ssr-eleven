import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NProgress from 'nprogress';


class LoadingTwo extends Component {

  constructor(props) {
    super(props);

    // this.state = {};
  }

  static propTypes = {
    // text: PropTypes.string.isRequired
  };

  // static defaultProps = {};

  componentDidMount() {
    console.log('>>>>>>>>>>>>>>>> LoadingTwo > componentDidMount() <<<<<<<<<<<<<<');
    NProgress.configure({ trickleSpeed: 200 });
    NProgress.start();
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('>>>>>>>>>>>>>>>> LoadingTwo > componentDidUpdate() <<<<<<<<<<<<<<');
    if (this.props.text === '') {
      console.log('>>>>>>>>>>>>>>>> LoadingTwo > componentDidUpdate() > this.props.text 1');
    } else {
      console.log('>>>>>>>>>>>>>>>> LoadingTwo > componentDidUpdate() > this.props.text 2');
    }
  }

  componentWillUnmount() {
    console.log('>>>>>>>>>>>>>>>> LoadingTwo > componentWillUnmount() <<<<<<<<<<<<<<');
    NProgress.done();
  }

  render() {

    const t = this.props.text;

    return (

      <div className="alert alert-warning text-center" role="alert">{ t }</div>

    );
  }
}

export default LoadingTwo;
