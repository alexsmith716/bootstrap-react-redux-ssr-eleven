import React, { Component } from 'react';
import PropTypes from 'prop-types';

// https://goshakkk.name/array-form-inputs/
// Making dynamic form inputs with React


class IncorporationForm extends Component {

  constructor() {
    super();

    this.state = {
      name: "",
      shareholders: [{ name: "" }]
    };
  }

  handleShareholderNameChange = idx => evt => {
    const newShareholders = this.state.shareholders.map((shareholder, sidx) => {
      if (idx !== sidx) return shareholder;
      return { ...shareholder, name: evt.target.value };
    });

    this.setState({ shareholders: newShareholders });
  };

  handleSubmit = evt => {
    const { name, shareholders } = this.state;
    alert(`Incorporated: ${name} with ${shareholders.length} shareholders`);
  };

  handleAddShareholder = () => {
    this.setState({
      shareholders: this.state.shareholders.concat([{ name: "" }])
    });
  };

  handleRemoveShareholder = idx => () => {
    this.setState({
      shareholders: this.state.shareholders.filter((s, sidx) => idx !== sidx)
    });
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>

        <h4>Shareholders</h4>

        {this.state.shareholders.map((shareholder, idx) => (

          <div className="shareholder" key={idx}>

            <input
              type="text"
              placeholder={`Shareholder #${idx + 1} name`}
              value={shareholder.name}
              onChange={this.handleShareholderNameChange(idx)}
            />

            <button
              type="button"
              onClick={this.handleRemoveShareholder(idx)}
              className="small"
            >delete</button>

          </div>

        ))}

        <button type="button" onClick={this.handleAddShareholder} className="small">Add Shareholder</button>

        <button>Incorporate</button>

      </form>
    );
  }
}

export default IncorporationForm;
