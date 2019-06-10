
export function getRandomInt() {
  return Math.floor(Math.random() * (100 - 1)) + 1
}

export function getDateNow(){
  return Date.now()
}

export function mockAPI(doWhat, delay) {
  return new Promise(( resolve ) => {
    setTimeout( () => resolve( doWhat() ), delay);
  });
}