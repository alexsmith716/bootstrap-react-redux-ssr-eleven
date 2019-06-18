 // import { connectedReduxRedirect } from 'redux-auth-wrapper/history4/redirect';
import { App, Home, NotFound } from './containers';
import About from './containers/About/Loadable';
import AboutOne from './containers/AboutOne/Loadable';
import AboutTwo from './containers/AboutTwo/Loadable';
import AboutThree from './containers/AboutThree/Loadable';
import AboutFour from './containers/AboutFour/Loadable';
import StickyFooter from './containers/StickyFooter/Loadable';
import BoardGames from './containers/games/BoardGames/Loadable';
import Login from './containers/Login/Loadable';
import Register from './containers/Register/Loadable';
// import LoginSuccess from './containers/LoginSuccess/Loadable';

import './theme/scss/bootstrap/bootstrap.global.scss';

// const isAuthenticated = connectedReduxRedirect({
//   redirectPath: '/login',
//   authenticatedSelector: state => {
//     const a = state.auth.user;
//     return a !== null;
//   },       
//   wrapperDisplayName: 'UserIsAuthenticated'
// });

// const isNotAuthenticated = connectedReduxRedirect({
//   redirectPath: '/',
//   authenticatedSelector: state => {
//     const a = state.auth.user;
//     return a === null;
//   },
//   wrapperDisplayName: 'UserIsAuthenticated',
//   allowRedirectBack: false
// });

const routes = [{
  component: App,
  routes: [
    { path: '/', exact: true, component: Home },
    { path: '/about', component: About },
    { path: '/aboutone', component: AboutOne },
    { path: '/abouttwo', component: AboutTwo },
    { path: '/aboutthree', component: AboutThree },
    { path: '/aboutfour', component: AboutFour },
    { path: '/stickyfooter', component: StickyFooter },
    { path: '/boardgames', component: BoardGames },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    // { path: '/login-success', component: isAuthenticated(LoginSuccess) },
    // { path: '/register', component: isNotAuthenticated(Register) },
    { component: NotFound }
  ]
}];

export default routes;
