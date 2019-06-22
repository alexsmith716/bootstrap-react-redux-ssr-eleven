
// requestAnimationFrame

function setTimeoutPromise(delay) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), delay);
  });
}

// setImmediate:
// releases after I/O events and is called before 'setTimeout' and 'setInterval'
// run after any upcoming I/O events but before 'setTimeout' and 'setInterval'
function setImmediatePromise() {
  return new Promise((resolve) => {
    setImmediate(() => resolve());
  });
}

function nextTickPromise() {
  return new Promise((resolve) => {
    process.nextTick(() => resolve());
  });
}

const asyncForEach = async(array, cb) => {
  for (let i = 0; i < array.length; i++) {
    await cb(array[i], i, array)
  }
}

// enumerating objects >>> a potentially long-running task
// async always returns a promise, which can be resolved to a value
// await suspends the execution until the promise is settled
const enumerateObjectValues = async (obj, i, z) => {
  // await setTimeoutPromise(4000);
  // await setImmediatePromise();
  await nextTickPromise();
  return obj;
};

export default enumerateObjectValues;

// ===================================================================================
// ===================================================================================
// ===================================================================================

// setTimeoutPromise = (delay) => new Promise(resolve => setTimeout(resolve, delay))
// 
// setTimeoutPromise(delay) {
//   return new Promise((resolve) => {
//     setTimeout(() => resolve(), delay);
//   });
// }
// 
// setImmediatePromise() {
//   return new Promise((resolve) => {
//     setImmediate(() => resolve());
//   });
// }
// 
// nextTickPromise() {
//   return new Promise((resolve) => {
//     process.nextTick(() => resolve());
//   });
// }
// 
// asyncForEach = async(array, cb) => {
//   for (let i = 0; i < array.length; i++) {
//     await cb(array[i], i, array)
//   }
// }
// 
// async enumerateObjectValuesAsync(obj, i, z) {
//   let isArray = obj instanceof Array;
//   console.log('1&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& obj > isArray: ', isArray);
//   console.log('1&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& obj: ', JSON.stringify(obj));
// 
//   if (i) {
//     console.log('2&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&: ', i);
//   }
//   if (z === 1) {
//     console.log('3------------------------------------');
//   }
// 
//   let keys = Object.keys(obj);
//   //console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>. Object.keys(obj)!!!!: ', keys);
//   
//   // await this.asyncForEach(obj, async (prop, index, a) => {
//   await this.asyncForEach(keys, async (prop, index, a) => {
//     // ------------------------------------
//     // await this.setTimeoutPromise(0);
//     // await this.setImmediatePromise();
//     await this.nextTickPromise();
//     // ------------------------------------
// 
//     // console.log('################### 000000 ################### index: ', index);
//     // console.log('################### 000000 ################### obj[prop]: ', obj[prop]);
//     // console.log('################### 000000 ################### isArray: ', isArray);
//     // console.log('################### 000000 ################### prop: ', prop);
// 
//     if (typeof(obj[prop]) === 'object') {
// 
//       // found an object "{}"
//       console.log('4------------------- 00000000 -----------------: ', obj[prop]);
// 
//       if (isArray) {
//         // found an object "{}" and an instanceof Array and NULL or not
//         console.log('5------------------- 00000000 YA -----------------: ', obj[prop], ' :: ', obj[prop].length);
//       } else {
//         // console.log('------------------- 00000000 NA -----------------: ', obj[prop]);
//         index === 1 ? console.log('6----------------XXXXXXXXXXXXXXXXXXXXXXXXXXXX--------------') : null;
//       }
// 
//       if (!isArray) {
// 
//         // index === 1 ? console.log('------------------------------') : null;
// 
//         if (obj[prop] !== null) {
//           console.log('7################### OBJECT ###################: ', index, ' :: ', prop + ':');
//         }
// 
//         if (obj[prop] === null) {
//           console.log('8======= NULL =============: ', prop + ': ' + obj[prop]);
//         }
//       }
// 
//       if (obj[prop] !== null) {
// 
//         console.log('9>>>>>>>>>>>>>>>>>>>>>>> vvvv00000 <<<<<<<<<<<<<<<<<<<<<<: ', obj[prop]);
// 
//         if (isArray) {
//           console.log('10>>>>>>>>>>>>>>>>>>>>>>> vvvv11111 YA <<<<<<<<<<<<<<<<<<<<<<: ', obj[prop], ' :: ', obj[prop].length);
//           this.enumerateObjectValues(obj[prop], index, undefined);
// 
//         } else {
//           console.log('11>>>>>>>>>>>>>>>>>>>>>>> vvvv2222  <<<<<<<<<<<<<<<<<<<<<<: ', obj[prop]);
//           this.enumerateObjectValues(obj[prop], undefined, index);
//         }
//       }
// 
//     } else if (!isArray) {
// 
//       console.log('12======= NON-OBJECT =======: ', index, ' :: ', prop + ': ' + obj[prop]);
// 
//       if (z === 1 && index === 1) {
//         console.log('------------------------------------');
//       }
// 
//     }
//   })
//   console.log('13>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Done !')
// };
// 
// // ===================================================================================
// // ===================================================================================
// // ===================================================================================
// 
// enumerateObjectValues(obj, i, z) {
// 
//   let isArray = obj instanceof Array;
// 
//   if (i) {
//     console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&: ', i);
//   }
//   if (z === 1) {
//     console.log('------------------------------------');
//   }
// 
//   Object.keys(obj).forEach((prop, index) => {
// 
//     // ---------------------------------------------
// 
//     if (typeof(obj[prop]) === 'object') {
// 
//       // ---------------------------------------------
// 
//       if (!isArray) {
// 
//         index === 1 ? console.log('------------------------------') : null;
// 
//         if (obj[prop] !== null) {
//           console.log('################### OBJECT ###################: ', index, ' :: ', prop + ':');
//         }
// 
//         if (obj[prop] === null) {
//           console.log('======= NULL =============: ', prop + ': ' + obj[prop]);
//         }
//       }
// 
//       // ---------------------------------------------
// 
//       if (obj[prop] !== null && isArray) {
// 
//         console.log('>>>>>>>>>>>>>>>>>>>>>>> REAL ARRAY! <<<<<<<<<<<<<<<<<<<<<<');
//         this.enumerateObjectValues(obj[prop], index, undefined);
// 
//       } else if (obj[prop] !== null) {
// 
//         this.enumerateObjectValues(obj[prop], undefined, index);
// 
//       }
// 
//     // ---------------------------------------------
// 
//     } else if (!isArray) {
// 
//       console.log('======= NON-OBJECT =======: ', index, ' :: ', prop + ': ' + obj[prop]);
// 
//       if (z === 1 && index === 1) {
//         console.log('------------------------------------');
//       }
// 
//     }
//   })
// };

