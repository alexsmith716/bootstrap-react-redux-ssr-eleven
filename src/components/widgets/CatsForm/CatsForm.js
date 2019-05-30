import React, { Component } from 'react';

import CatInputs from './CatInputs';


class CatsForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      cats: [{name:'', age:''}],
      owner: '',
      description: ''
    }
  }

  // --------------------------------------------------------------------------

  // e.target.value.charAt(0).toUpperCase()+e.target.value.slice(1)
  // Handling Multiple Inputs
  // When you need to handle multiple controlled input elements, 
  //  you can add a name attribute to each element 
  //  and let the handler function choose what to do based on the value of 'event.target.name'
  handleChange = (e) => {

    console.log('>>>>>>>>>>>>>>>> CatsForm > handleChange > 000 > e.target: ', e.target);
    console.log('>>>>>>>>>>>>>>>> CatsForm > handleChange > 000 > e.target.name: ', e.target.name);
    console.log('>>>>>>>>>>>>>>>> CatsForm > handleChange > 000 > e.target.className: ', e.target.className);
    console.log('>>>>>>>>>>>>>>>> CatsForm > handleChange > 000 > e.target.value: ', e.target.value);
    console.log('>>>>>>>>>>>>>>>> CatsForm > handleChange > 000 > e.target.dataset.id: ', e.target.dataset.id);

    if ( e.target.name.indexOf('cat') === 0 || e.target.name.indexOf('age') === 0 ) {

      console.log('>>>>>>>>>>>>>>>> CatsForm > handleChange > 111 > e.target.className: ', e.target.className);
      console.log('>>>>>>>>>>>>>>>> CatsForm > handleChange > 111 > e.target.value: ', e.target.value);

      let cats = [...this.state.cats];
      let nameAttribute = 'name';

      e.target.name.indexOf('age') === 0 ? nameAttribute = 'age' : null;

      cats[e.target.dataset.id][`${nameAttribute}`] = e.target.value;

      this.setState({ cats })

    } else {
      console.log('>>>>>>>>>>>>>>>> CatsForm > handleChange > 222 > e.target.name: ', e.target.name);
      console.log('>>>>>>>>>>>>>>>> CatsForm > handleChange > 222 > e.target.value: ', e.target.value);

      this.setState({ [e.target.name]: e.target.value });
    }
  };

  // handleCatStateArrayInputChange = (e) => {
  //   console.log('>>>>>>>>>>>>>>>> CatsForm > handleCatStateArrayInputChange > e.target: ', e.target);
  // };

  // --------------------------------------------------------------------------

  handleSubmit = (e) => {

    console.log('>>>>>>>>>>>>>>>> CatsForm > handleSubmit > this.state.cats: ', this.state.cats);
    console.log('>>>>>>>>>>>>>>>> CatsForm > handleSubmit > this.state.owner: ', this.state.owner);
    console.log('>>>>>>>>>>>>>>>> CatsForm > handleSubmit > this.state.description: ', this.state.description);

    e.preventDefault();
  }

  // --------------------------------------------------------------------------

  // A form element becomes 'controlled' if you set its value via a prop

  // State and Lifecycle
  // ============================== State Updates May Be Asynchronous =====================================
  // * React may batch multiple 'setState()' calls into a single update for performance.
  // * Because 'this.props' and 'this.state' may be updated asynchronously, 
  //    you should not rely on their values for calculating the next state.
  // * To fix it, use a second form of 'setState()' that accepts a function rather than an object. 
  //   That function will receive the previous state as the first argument, 
  //    and the props at the time the update is applied as the second argument

  //  ============================= Correct ===============================================================
  //  this.setState((state, props) => ({
  //    counter: state.counter + props.increment
  //  }));

  addCat = (e) => {
    console.log('>>>>>>>>>>>>>>>> CatsForm > addCat >>>>>>>>>>>>>>>>>>>>>>>');
    this.setState((prevState) => ({
      cats: [...prevState.cats, {name:'', age:''}],
    }));
  }

  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------

  render() {

    console.log('>>>>>>>>>>>>>>>> CatsForm > render() > this.state.cats:', this.state.cats);
    console.log('>>>>>>>>>>>>>>>> CatsForm > render() > this.state.owner:', this.state.owner);
    console.log('>>>>>>>>>>>>>>>> CatsForm > render() > this.state.description:', this.state.description);

    let {cats, owner, description} = this.state;

    return (

      <div className="row justify-content-md-center">
        <div className="col-md-auto">

          <div className="d-flex bg-color-ivory container-padding-border-radius-2">
            <div className="width-600">

                <form onSubmit={this.handleSubmit} >

                  <div className="form-row mb-2">

                    <div className="form-group col-md-6">
                      <label htmlFor="owner">Owner</label>
                      <input type="text" className="form-control" name="owner" id="owner" value={owner} onChange={this.handleChange} placeholder="Owner" />
                    </div>

                    <div className="form-group col-md-6">
                      <label htmlFor="description">Description</label>
                      <input type="text" className="form-control" name="description" id="description" value={description} onChange={this.handleChange} placeholder="Description" />
                    </div>

                  </div>

                  <CatInputs cats={cats} onChange={ this.handleChange } />

                  <div className="row text-center">
                    <div className="col-lg-6 col-md-6 col-sm-12 mb-lg-0 mb-md-0 mb-sm-2 mb-2">
                      <button onClick={this.addCat} className="btn btn-primary">Add new cat</button>
                    </div>

                    <div className="col-lg-6 col-md-6 col-sm-12">
                      <button type="submit" className="btn btn-success">Submit</button>
                    </div>
                  </div>

                </form>

            </div>
          </div>

        </div>
      </div>
    )
  }
}

export default CatsForm;
