import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { load } from '../../redux/modules/info';

@connect(
  state => ({ info: state.info.data }),
  { load }
)

class InfoBar extends Component {

  static propTypes = {
    info: PropTypes.shape({
      message: PropTypes.string,
      time: PropTypes.number
    }),
    load: PropTypes.func.isRequired
  };

  static defaultProps = {
    info: null
  };

  render() {

    const { info, load } = this.props;
    const styles = require('./scss/InfoBar.scss');

    // console.log('>>>>>>>>>>>>>>>> InfoBar > render() > info:', info);
    // console.log('>>>>>>>>>>>>>>>> InfoBar > render() > load:', load);

    return (

      <div className="container">

        <div className={`${styles.infoBar} card text-center`}>

          <div className="card-body bg-light">

            <h5 className="card-title">InfoBar message: '<span className={styles.message}>{info ? info.message : 'no info!'}</span>'</h5>

            <p className="card-text">{info && new Date(info.time).toString()}</p>
            <p>{info && info.time}</p>

            <button type="button" className="btn btn-primary" onClick={load}>
              Reload from server
            </button>

          </div>
        </div>
      </div>
    );
  }
}

export default InfoBar;
