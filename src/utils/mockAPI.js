
export function getRandomInt() {
  return Math.floor(Math.random() * (100 - 1)) + 1
}

export function getDateNow(){
  return Date.now()
}

function interruptingTask1() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('################### mockAPI() > interruptingTask1() > Promise resolved');
      resolve(interruptingTask2());
    }, 1000);
  });
}

function startingTask() {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('################### mockAPI() > startingTask() > Promise resolved');
      resolve(interruptingTask1());
    }, 1000);
  });
}

// export function mockAPI(delay) {
//   return new Promise(( resolve ) => {
//     setTimeout( () => resolve(), delay);
//   });
// }

export function mockAPI(doWhat, delay) {
  return new Promise(( resolve ) => {
    setTimeout( () => resolve( doWhat() ), delay);
  });
}