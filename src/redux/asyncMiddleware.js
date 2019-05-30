export default function asyncMiddleware(helpers) {

  return ({ dispatch, getState }) => next => action => {

    if (typeof action === 'function') {
      return action(dispatch, getState);
    }

    const { promise, types, ...rest } = action;
    
    if (!promise) {
      return next(action);
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
// 
//   if (action.payload == null || action.payload.constructor.name !== 'AsyncFunction') {
//     // If `action.payload` isn't a function, we can't really cancel this action, and
//     // if this function isn't async then assume it is sync
//     return next(action);
//   }
// 
//   if (inflight[action.type]) {
//     // Ignore if there's an action with this type already in progress
//     return;
//   }
// 
//   inflight[action.type] = true;
// 
//   action.payload(action).then(
//     () => { inflight[action.type] = false; },
//     () => { inflight[action.type] = false; }
//   );
//   
//   next(action);
// };