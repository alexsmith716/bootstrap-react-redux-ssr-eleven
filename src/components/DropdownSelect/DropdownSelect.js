import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

// Fragments:
//    A common pattern in React is for a component to return multiple elements. 
//    Fragments let you group a list of children without adding extra nodes to the DOM.
//    "If a parent div was used inside the render() of <Columns />, then the resulting HTML will be invalid"
//    >>>>>>>>>>>>>>>>>>> To Render a list of child components <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
// -----------------------------------------

// {optionsArray.map((option, index) => (
//   <Fragment key={index}>
//     <option value={option}>{option}</option>
//   </Fragment>
// ))}

const DropdownSelect = props => {

  const { title, optionsArray, dropDownOptionSelected, onChange } = props;

  return (

    <form>

      <div className="form-group mb-0">

        <label htmlFor="exampleFormControlSelect1">{ title }</label>

        <select
          className="custom-select custom-select-sm"
          id="exampleFormControlSelect1"
          value={dropDownOptionSelected}
          onChange={ onChange }
        >

          <option value="">{ title }...</option>

          {optionsArray.map((value, index) => (
            <option value={value} key={index}>{value}</option>
          ))}

        </select>

      </div>
    </form>
  );
};

DropdownSelect.propTypes = {
  title: PropTypes.string,
  optionsArray: PropTypes.array.isRequired,
  dropDownOptionSelected: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

export default DropdownSelect;
