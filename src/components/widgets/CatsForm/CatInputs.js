import React from 'react';

const CatInputs = ({ cats, onChange }) => {

  return (

    cats.map((val, idx)=> {

      let catId = `cat-${idx}`;
      let ageId = `age-${idx}`;

      return (

        <div className="form-row basic-border-goldenrod-1 mb-3" key={idx}>

          <div className="form-group col-md-6">

            <label htmlFor={`cat-${idx}`}>{`Cat #${idx + 1}`}</label>

            <input
              type="text"
              className="form-control"
              name={catId}
              data-id={idx}
              id={catId}
              value={cats[idx].name}
              onChange={ onChange }
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
              value={cats[idx].age}
              onChange={ onChange }
              placeholder="Age"
            />
          </div>
        </div>
      )
    })
  );
};

export default CatInputs;
