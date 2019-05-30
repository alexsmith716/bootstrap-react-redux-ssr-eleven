// import Progress from 'react-progress-2';
import NProgress from 'nprogress';
import actions from './actions';

const notifyProgressShow = caller => (dispatch) => {
  if (__CLIENT__ && NProgress && !caller.inBackground) NProgress.start();
  dispatch(actions.notifyProgressShow);
};

const notifyProgressHide = caller => (dispatch) => {
  if (__CLIENT__ && NProgress && !caller.inBackground) NProgress.done();
  dispatch(actions.notifyProgressHide());
};

export default {
  notifyProgressShow,
  notifyProgressHide,
};
