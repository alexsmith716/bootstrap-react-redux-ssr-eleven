import React from 'react';


const PromiseTimeoutDelay = (delay) => (

);

export default PromiseTimeoutDelay;

// ===================================================================

// const PromiseTimeoutDelay = milliseconds => value => new Promise (resolve =>
//   setTimeout(() => resolve(value), milliseconds)
// )
// 
// const log => msg => console.log(msg)
// 
// PromiseTimeoutDelay(1000)
//   =>  fn = value => new Promise (resolve =>
//   setTimeout(() => resolve(value), 1000)
// 
// PromiseTimeoutDelay(1000)('Hello World').then(log)

// ================

// Higher Order Functions
// HOF: functions that expect other functions as arguments
// Array.map, array.filter, array.reduce:  take functions as arguments

// HOF that return other functions help handle with asynchronicity
// HOF can help create functions that can be used or reused

// Currying is a functional technique that involves usage of HOF
// Currying is holding of values needed to complete an operation until the rest can be supplied at a later point in time
// This is achieved through the use of a function that returns another function, the curried function

// Currying is a process of converting a function with n number of arguments into a nested unary function

// SIMPLE FUNCTION: "const add = (x,y) => x + y;"

// =======================================================

// function doFilter(query) {
//   return function (user) {
//     return query === user.name;
//   }
// }
// -------------------------
// const doFilter = query => user => query === user.name;
// -------------------------
// fn = user => 'foo' === user.name;
// -------------------------
// const doFilter = query => user => {
//   return query === user.name;
// }
// -------------------------
// <ul>
//   {users
//     .filter(doFilter(this.state.query))
//     .map(user => <li>{user.name}</li>)
//   }
// </ul>

// CURRIED FUNCTION: "const addCurried = x => y => x + y;"

//    addCurried(4)
//      => fn = y => 4 + y // >>> returns a function where 'x' value is captured via closure <<<

//    addCurried(4)(4)
//      => 8

// curried function: 'const addCurried = x => y => x + y;'
// 'addCurried(4)' >>>> returns a function ('fn = y => 4 + y'))
// so, 'addCurried(4)(4)' >>>> returns '8' (8 = 4 + 4)
