import React from 'react';
import PropTypes from 'prop-types';


const BoilingVerdict = props => {

  const { celsius } = props;
  const v = <div className="text-center"><h6>{`Will the water boil? ${celsius >= 100 ? 'Yes!' : 'No'}`}</h6></div>;

  return v;
}

BoilingVerdict.propTypes = {
  celsius: PropTypes.number.isRequired
};

export default BoilingVerdict;
