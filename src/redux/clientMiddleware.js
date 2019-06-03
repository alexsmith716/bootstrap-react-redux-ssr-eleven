
// how to use "synchronous" action creators together with "async" network requests?
// action creator can return a function instead of an action object
// This way, the action creator becomes a 'thunk'
// When an action creator returns a function, that function will get executed by the Redux Thunk middleware. 
// This function doesn't need to be pure; 
//   it is thus allowed to have side effects, including executing asynchronous API calls.

// The nice thing about thunks is that they can dispatch results of each other:

// Async action creators are especially convenient for server rendering. 
// You can create a store, 
//  dispatch a single async action creator that dispatches other async action creators to fetch data for a whole section of your app, 
//  and only render after the Promise it returns, completes. 
//  Then your store will already be hydrated with the state you need before rendering.

// Every time an action is dispatched, the new state is computed and saved

// https://redux.js.org/advanced/middleware
// https://redux.js.org/api/applymiddleware

// "custom middleware" to describe calls to API
// "custom middleware" between dispatching an action, and the moment it reaches the reducer
// "custom middleware" for talking to an asynchronous API

// Each middleware receives Store's 'dispatch' and 'getState' functions as named arguments, and returns a function.
// That function will be given the next middleware's dispatch method, 
//  and is expected to return a function of 'action' calling 'next(action)' with a potentially different argument, 
//  or at a different time, or maybe not calling it at all. 
// The last middleware in the chain will receive the real store's 'dispatch' method as the 'next' parameter, thus ending the chain

// the middleware signature is '({ getState, dispatch }) => next => action'

// The dispatcher's role in a Flux application is to:
//  accept actions, one at a time, and hand them off to the stores

// provide a point between dispatching an action, and the moment it reaches the reducer
// like handling the actions of an asynchronous API
export default function clientMiddleware(helpers) {

  return ({ dispatch, getState }) => next => action => {

    if (typeof action === 'function') {
      console.log('>>>>>>>>>> clientMiddleware <<<<<<<<<<<<<<<<< > RETURNING typeof action === function: ', typeof action);
      return action(dispatch, getState);
    }

    const { promise, types, ...rest } = action;
    
    if (!promise) {
      // {
      //   "type": "redux-example/filterableTable/SELECTED_OPTION",
      //   "option": "https://api.github.com/emojis",
      //   "meta": {
      //     "__multireducerKey": "AboutOneMultireducerFilterableTable1"
      //   }
      // }
      console.log('>>>>>>>>>> clientMiddleware <<<<<<<<<<<<<<<<< > NO promise: ', action);
      return next(action);
    } else {
      console.log('>>>>>>>>>> clientMiddleware <<<<<<<<<<<<<<<<< > YES promise: ', action);
    }

    const [REQUEST, SUCCESS, FAILURE] = types;

    next({ ...rest, type: REQUEST });

    const actionPromise = promise(helpers, dispatch);

    actionPromise
      .then( result => next({ ...rest, result, type: SUCCESS }), error => next({ ...rest, error, type: FAILURE }) )
      .catch(error => {
        console.error('MIDDLEWARE ERROR:', error);
        next({ ...rest, error, type: FAILURE });
      });

    console.log('>>>>>>>>>> clientMiddleware <<<<<<<<<<<<<<<<< > actionPromise: ', actionPromise);
    // returning "Promise"
    return actionPromise;
  };
}

// // Middleware
// export default function promiseMiddleware() {

//   return (next) => (action) => {

//     const { promise, types, ...rest } = action;

//     if (!promise) {
//       return next(action);
//     }
// 
//     const [REQUEST, SUCCESS, FAILURE] = types;

//     next({ ...rest, type: REQUEST });

//     return promise.then(
//       (result) => next({ ...rest, result, type: SUCCESS }),
//       (error) => next({ ...rest, error, type: FAILURE })
//     );

//   };
// }
// 
// // Usage
// function doSomethingAsync(userId) {
//   return {
//     types: [SOMETHING_REQUEST, SOMETHING_SUCCESS, SOMETHING_FAILURE],
//     promise: requestSomething(userId),
//     userId
//   };
// }
