# bootstrap-react-redux-ssr-eleven

## Overview:

App builds off 'bootstrap-react-redux-webpack-ssr-ten'. This app utilizes custom async middleware for response to Redux actions.

=============================================================
=============================================================

Asynchronous Iterators in JavaScript
-------------------------------------------------------------

The iterator interface brought by ECMAScript 2015 is designed to iterate over sequential data sources.

An iterator object has the property next() with returns properties { value, done }. The property value contains the next value in the collection. As for done, that contains the boolean value indicating whether the iteration has ended or not.

Since both values value and done need to be known at the time the iterator method returns, iterators are only suitable to iterator over synchronous data sources.

However, many data sources are asynchronous. Examples are I/O access and fetch. To these asynchronous data sources, iterator are not applicable.

For this, JavaScript introduces the AsyncIterator interface.

AsyncIterator is much like an iterator, except that the next() property returns a promise with the tuple { value, done } instead of the direct value of { value, done }.

`const { value, done } = syncIterator.next();`

`asyncIterator.next().then(({ value, done }) => /* ... */);`

In order to allow to build a customize asyncIterable, it introduces the new symbol Symbol.asyncIterator. An object can become an asyncIterable by adding this property and implementing its async iterator behavior.

`const asyncIterable = {
    [Symbol.asyncIterator]: /* asyncIterator */
};`

The asyncIterable introduce a variation of for-of iteration statement, mainly for-wait-of. This statement is able to iterate over async iterable objects.

`for await (const line of readLines(filePath)) {
  console.log(line);
}`

Async generator function allows us to iterate over an async data sources without worry about managing the iterator state.

As for async iterators, it returns a promise with the value { value, done } and await expression and for-await-of statements are allowed. The yield statement support delegation to async iterables.


=============================================================
=============================================================

Redux > Data Flow
https://redux.js.org/basics/data-flow

* Redux architecture revolves around a strict unidirectional data flow

* This means that all data in an application follows the same lifecycle pattern


The data lifecycle in any Redux app follows these 4 steps:

  1. You call `store.dispatch(action)`
  
  2. The Redux store calls the reducer function you gave it
  
  3. The root reducer may combine the output of multiple reducers into a single state tree
  
  4. The Redux store saves the complete state tree returned by the root reducer


* The new tree is now the next state of the app

* Every listener registered with `store.subscribe(listener)` will now be invoked; 
  listeners may call `store.getState()` to get the current state.

* Now, the UI can be updated to reflect the new state. 
  If using bindings like React Redux, this is the point at which `component.setState(newState)` is called.


=============================================================
=============================================================

Redux Saga vs Async/Await
--------------------------------------------

https://thecodebarbarian.com/redux-saga-vs-async-await
https://thecodebarbarian.com/the-difference-between-async-await-and-generators

https://github.com/tj/co

https://thecodebarbarian.com/for-vs-for-each-vs-for-in-vs-for-of-in-javascript
https://thecodebarbarian.com/introducing-await-js-express-async-support-for-express-apps
http://thecodebarbarian.com/common-async-await-design-patterns-in-node.js.html
https://thecodebarbarian.com/the-80-20-guide-to-promises-in-node-js.html

=============================================================
=============================================================

Task (Redux-Saga):
-------------------------------------------------------------
A task is like a process running in background. 
In a redux-saga based application there can be multiple tasks running in parallel. 
You create tasks by using the fork function:

`import {fork} from 'redux-saga/effects'`

`function* saga() {
  ...
  const task = yield fork(otherSaga, ...args)
  ...
}`

=============================================================
=============================================================

A generator function is PAUSED by executing a `yield` keyword in the body of the function

A yield keyword can be used any number of times in the function body

=============================================================
=============================================================

A Generator executes just like any other function and you can pass arguments in it. 
The only difference being that executing a generator doesn't really run the code inside it. 
It simply produces an iterator that can be used to execute the code inside it.


`function *generator() {
    yield 'Hello';
    yield 'from';
    yield 'generator';
}`


Now if we call the generator function, 
  it will not be executed; instead it returns an iterator that will be used to execute the code inside it.


`let obj = generator();`


In the generator above, 
  the operations in the beginning would run and then the yield statement would pause the execution of the generator 
  until the `next()` method is called. 
The method `obj.next()` continues the execution of `generator`, until the next yield expression:


`console.log( obj.next() );   // { value: 'Hello', done: false}
console.log( obj.next() );    // { value: 'from', done: false}
console.log( obj.next() );    // { value: 'generator', done: false}
console.log( obj.next() );    // { value: undefined, done: true}`

=============================================================
=============================================================

Generators & Promises >>> How Babel transforms async code to ES2016 code <<<

Redux-Saga utilizes Generators to Asychonously control Redux (application side effects)

Redux-Saga is a Redux middleware

Redux-Saga is like a separate 'Thred' in a javascript app (opposed to the real 'Thread')

That 'Thred' can be started, paused and cancelled from the main application with normal redux actions

=============================================================
=============================================================

Generators are functions which can be exited and later re-entered

Generator-functions can yield promises

function* gen() {

  const a = yield 1;
  const b = yield true;
  const c = yield 'foo';

  console.log(a, b, c);

}

When a generator function is called, its body is not executed right away. 
Instead it returns an 'iterator-object' which adheres to the 'iterator protocol' (i.e. it has a 'next' method).

The only way to execute the body of 'gen' is by calling the 'next' method on its 'iterator-object'. 
Every time the 'next' method is called, its body is executed until the next 'yield' expression. 
The value of this expression is returned from the iterator.

This 'next' method also accepts an argument. 
Calling it with an argument replaces the current 'yield' expression with the argument and resumes the execution till the next 'yield' expression.

// ------------------------------------

* A generator-function gets executed "yield-by-yield" (i.e. one yield-expression at a time), by its iterator (the 'next' method).

* Every 'yield' has a 'give' >>> 'halt' >>> 'take' behavior, so to say.

* It gives out the value of the current yield-expression, to the iterator.

* It then 'halts' at this point, until the iterator's 'next' method is called again.

* When the 'next' method is called again, it takes the argument from it and replaces the currently halted yield-expression with it. 
  It then moves to the next 'yield'.

// ------------------------------------

how do the generator functions help? 
When applied to a asynchronous flow (waiting for certain tasks to finish before proceeding)


// >>>>>>>>>>> A generator function <<<<<<<<<<<<<<

function* generatorFunction() {

  // >>>>>>>>>>>>> yields a promise for task1 <<<<<<<<<<<<<<<
  const res1 = yield doTask1();

  // >>>>>>>>>>>>> yields a promise for task2 <<<<<<<<<<<<<<<
  const res2 = yield doTask2(res1);

  // >>>>>>>>>>>>> yields a promise for task3 <<<<<<<<<<<<<<<
  const res3 = yield doTask3(res2);

  return res3;
}


// >>>>>>>>>>> A function that executes a generator function <<<<<<<<<<<<<<

function executeGeneratorFunction() {

  const itr = genFn();

  function run(arg) {

    const result = itr.next(arg);

    if (90) {
      return result.value;

    } else {
      return Promise.resolve(result.value).then(run);

    }

  }
  return run();
}


// >>>>>>>>>>> Execute generator function <<<<<<<<<<<<<<

executeGeneratorFunction(generatorFunction);


=============================================================
=============================================================

Manifest Generator for Webpack, with auto icon resizing and fingerprinting support
https://github.com/arthurbergmz/webpack-pwa-manifest

=============================================================
=============================================================

‘access-control-allow-origin'

‘Access-Control-Allow-Headers'

Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at https://api.com/feeds. 
(Reason: missing token ‘access-control-allow-origin' in CORS header ‘Access-Control-Allow-Headers' from CORS preflight channel).

Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at https://api.com/feeds. (Reason: CORS request did not succeed).

{
  "current_user_url": "https://api.github.com/user",
  "current_user_authorizations_html_url": "https://github.com/settings/connections/applications{/client_id}",
  "authorizations_url": "https://api.github.com/authorizations",
  "code_search_url": "https://api.github.com/search/code?q={query}{&page,per_page,sort,order}",
  "commit_search_url": "https://api.github.com/search/commits?q={query}{&page,per_page,sort,order}",
  "emails_url": "https://api.github.com/user/emails",
  "emojis_url": "https://api.github.com/emojis",
  "events_url": "https://api.github.com/events",
  "feeds_url": "https://api.github.com/feeds",
  "followers_url": "https://api.github.com/user/followers",
  "following_url": "https://api.github.com/user/following{/target}",
  "gists_url": "https://api.github.com/gists{/gist_id}",
  "hub_url": "https://api.github.com/hub",
  "issue_search_url": "https://api.github.com/search/issues?q={query}{&page,per_page,sort,order}",
  "issues_url": "https://api.github.com/issues",
  "keys_url": "https://api.github.com/user/keys",
  "notifications_url": "https://api.github.com/notifications",
  "organization_repositories_url": "https://api.github.com/orgs/{org}/repos{?type,page,per_page,sort}",
  "organization_url": "https://api.github.com/orgs/{org}",
  "public_gists_url": "https://api.github.com/gists/public",
  "rate_limit_url": "https://api.github.com/rate_limit",
  "repository_url": "https://api.github.com/repos/{owner}/{repo}",
  "repository_search_url": "https://api.github.com/search/repositories?q={query}{&page,per_page,sort,order}",
  "current_user_repositories_url": "https://api.github.com/user/repos{?type,page,per_page,sort}",
  "starred_url": "https://api.github.com/user/starred{/owner}{/repo}",
  "starred_gists_url": "https://api.github.com/gists/starred",
  "team_url": "https://api.github.com/teams",
  "user_url": "https://api.github.com/users/{user}",
  "user_organizations_url": "https://api.github.com/user/orgs",
  "user_repositories_url": "https://api.github.com/users/{user}/repos{?type,page,per_page,sort}",
  "user_search_url": "https://api.github.com/search/users?q={query}{&page,per_page,sort,order}"
}
