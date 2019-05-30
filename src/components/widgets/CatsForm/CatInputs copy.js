import React, { Component } from 'react';
import PropTypes from 'prop-types';

class CatInputs extends Component {

  constructor(props) {
    super(props);

  }

  // -----------------------------------------------------------

  static propTypes = {
    cats: PropTypes.array,
    onInputChange: PropTypes.func
  };

  componentDidMount() {
    console.log('>>>>>>>>>>>>>>>> CatInputs > componentDidMount <<<<<<<<<<<<<<<<<<<<<<');
  }

  componentWillUnmount() {
    console.log('>>>>>>>>>>>>>>>> CatInputs > componentWillUnmount <<<<<<<<<<<<<<<<<<<<<<');
  }

  handleChange = (e) => {
    this.props.onInputChange(e);
  }

  render() {

    // const cats = this.props.cats;
    console.log('>>>>>>>>>>>>>>>> CatInputs > RENDER !!!!!! > PROPS: ', this.props.cats);

    const c = this.props.cats.map((val, idx) => {

      let catId = `cat-${idx}`;
      let ageId = `age-${idx}`;

      return (

        <div className="form-row basic-border-goldenrod-1 mb-2" key={idx}>

          <div className="form-group col-md-6">

            <label htmlFor={`cat-${idx}`}>{`Cat #${idx + 1}`}</label>

            <input
              type="text"
              className="form-control"
              name={catId}
              data-id={idx}
              id={catId}
              value={this.props.cats[idx].name}
              onChange={ this.handleChange }
              placeholder="Name"
            />
          </div>

          <div className="form-group col-md-6">

            <label htmlFor={ageId}>Age</label>

            <input
              type="text"
              className="form-control"
              name={ageId}
              data-id={idx}
              id={ageId}
              value={this.props.cats[idx].age}
              onChange={ this.handleChange }
              placeholder="Age"
            />
          </div>
        </div>
      );
    });

    return (

      <div className="form-group">
        { c }
      </div>

    );
  }
}

export default CatInputs;
