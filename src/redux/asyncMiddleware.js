
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
export default function asyncMiddleware(helpers) {

  return ({ dispatch, getState }) => next => action => {

    if (typeof action === 'function') {
      console.log('>>>>>>>>>> asyncMiddleware <<<<<<<<<<<<<<<<< > RETURNING NO ASYNC: ', typeof action)
      return action(dispatch, getState);
    }

    console.log('>>>>>>>>>> asyncMiddleware <<<<<<<<<<<<<<<<< > action: ', action)

    const { promise, types, ...rest } = action;
    
    if (!promise) {
      // {
      //   "type": "redux-example/filterableTable/SELECTED_OPTION",
      //   "option": "https://api.github.com/emojis",
      //   "meta": {
      //     "__multireducerKey": "AboutOneMultireducerFilterableTable1"
      //   }
      // }
      console.log('>>>>>>>>>> asyncMiddleware <<<<<<<<<<<<<<<<< > NO promise')
      return next(action);
    } else {
      console.log('>>>>>>>>>> asyncMiddleware <<<<<<<<<<<<<<<<< > YES promise')
    }

    const [REQUEST, SUCCESS, FAILURE] = types;

    next({ ...rest, type: REQUEST });

    const actionPromise = promise(helpers, dispatch);

    actionPromise
      .then(result => next({ ...rest, result, type: SUCCESS }), error => next({ ...rest, error, type: FAILURE }))
      .catch(error => {
        console.error('MIDDLEWARE ERROR:', error);
        next({ ...rest, error, type: FAILURE });
      });

    console.log('>>>>>>>>>> asyncMiddleware <<<<<<<<<<<<<<<<< > actionPromise: ', actionPromise)
    // returning "Promise"
    return actionPromise;
  };
}

// const isPromise = (obj) => obj && typeof obj.then === 'function';
// 
// export default () => {
// 
//   return (next) => (action) => {
// 
//     console.log('>>>>>>>>>> asyncMiddleware <<<<<<<<<<<<<<<<< > action: ', action)
// 
//     const { type, payload } = action;
// 
//     console.log('>>>>>>>>>> asyncMiddleware <<<<<<<<<<<<<<<<< > action.type: ', type)
//     console.log('>>>>>>>>>> asyncMiddleware <<<<<<<<<<<<<<<<< > action.payload: ', payload)
// 
//     if (!isPromise(payload)) {
//       console.log('>>>>>>>>>> asyncMiddleware > !isPromise(payload) <<<<<<<<<< > next(action):', next(action))
//       return next(action);
//     } else {
//       console.log('>>>>>>>>>> asyncMiddleware > isPromise(payload) <<<<<<<<<<<<<<<<<')
//     }
// 
//     const PENDING = `${type}_PENDING`;
//     const SUCCESS = type;
//     const FAILURE = `${type}_FAILURE`;
// 
//     next({ type: PENDING });
// 
//     return payload
//       .then((result) => {
//         next({ type: SUCCESS, payload: result });
//         return true;
//       })
//       .catch((error) => {
//         next({ type: FAILURE, error: true, payload: error });
//         console.error(error);
//         return false;
//       });
//   };
// };

// const inflight = {};
// 
// const dedupeMiddleware = store => next => action => {
//   if (action.payload == null || action.payload.constructor.name !== 'AsyncFunction') {
//     // If `action.payload` isn't a function, we can't really cancel this action, and
//     // if this function isn't async then assume it is sync
//     return next(action);
//   }
//   if (inflight[action.type]) {
//     // Ignore if there's an action with this type already in progress
//     return;
//   }
// 
//   inflight[action.type] = true;
//   action.payload(action).then(
//     () => { inflight[action.type] = false; },
//     () => { inflight[action.type] = false; }
//   );
//   next(action);
// };
