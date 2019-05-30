
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
