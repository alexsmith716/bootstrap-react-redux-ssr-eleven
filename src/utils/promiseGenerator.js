
function taskA() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(100);
      // reject('reject');
    }, 1000);
  });
}

function taskB(r) {
  console.log(r);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(200);
      // reject('reject');
    }, 1000);
  });
}

const p = taskA();
const p2 = taskB();

Promise.all([p, p2]).then(result => console.log(result));

p.then(result => taskB(result))
  .then(r => console.log(r))
  .catch(err => console.log(err));

// -----------------------------------------------

function interruptingTask1() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('################### promiseGenerator() > interruptingTask1() > Promise resolved');
      resolve(interruptingTask2());
    }, 1000);
  });
}

function interruptingTask2() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('################### promiseGenerator() > interruptingTask2() > Promise resolved');
      resolve(interruptingTask3());
    }, 1000);
  });
}

function interruptingTask3() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('################### promiseGenerator() > interruptingTask3() > Promise resolved');
      resolve('Finally Resolved startingTask() !!');
    }, 1000);
  });
}

// export default function* promiseGenerator() {
//   let num = 0;
// 
//   yield* [1, 2, 3];
// 
//   while (true) {
//     const r = yield ++num;
//     console.log(r);
//   }
// }

// { "value": 1, "done": false }


function startingTask() {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('################### promiseGenerator() > startingTask() > Promise resolved');
      resolve(interruptingTask1());
    }, 1000);
  });
}

// Generators are async functions that can be paused and started while keeping context
// A function is a generator if it contains one or more 'yield' expressions and if it uses the 'function*' syntax
export default function* promiseGenerator() {
  // function is paused by executing a 'yield' keyword
  // function 'startingTask' is momentarily 'paused/setTimeout()' by the 3 above 'interruptingTasks'
  const result = yield startingTask();
  console.log('################### promiseGenerator() > yield startingTask() > result: ', result);
}
