import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NProgress from 'nprogress';

// https://github.com/danilowoz/react-content-loader

class Loading extends Component {

  static propTypes = {
    text: PropTypes.string,
  };

  static defaultProps = {
    text: 'Fetching Requested Data ...'
  };

  componentDidMount() {
    console.log('>>>>>>>>>>>>>>>> Loading > componentDidMount() <<<<<<<<<<<<<<');
    NProgress.configure({ trickleSpeed: 200 });
    NProgress.start();
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('>>>>>>>>>>>>>>>> Loading > componentDidUpdate() <<<<<<<<<<<<<<');
  }

  componentWillUnmount() {
    console.log('>>>>>>>>>>>>>>>> Loading > componentWillUnmount() <<<<<<<<<<<<<<');
    NProgress.done();
  }

  render() {

    const { text } = this.props;

    return (

      <div className="alert alert-warning text-center mb-0" role="alert">{ text }</div>

    );
  }
}

export default Loading;
