// applyMiddleware方法是用来增强dispatch方法的，用户可以在dispatch前后执行自己想要的代码，并在合适的时候执行dispatch




var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import compose from './compose';

/**
 * Creates a store enhancer that applies middleware to the dispatch method
 * of the Redux store. This is handy for a variety of tasks, such as expressing
 * asynchronous actions in a concise manner, or logging every action payload.
 *
 * See `redux-thunk` package as an example of the Redux middleware.
 *
 * Because middleware is potentially asynchronous, this should be the first
 * store enhancer in the composition chain.
 *
 * Note that each middleware will be given the `dispatch` and `getState` functions
 * as named arguments.
 *
 * @param {...Function} middlewares The middleware chain to be applied.
 * @returns {Function} A store enhancer applying the middleware.
 */
export default function applyMiddleware() {
  for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
    middlewares[_key] = arguments[_key];
  }

  return function (createStore) {
    return function (reducer, preloadedState, enhancer) {
      var store = createStore(reducer, preloadedState, enhancer);
      var _dispatch = store.dispatch;
      var chain = [];

    //   这个变量就是就是store
      var middlewareAPI = {
        getState: store.getState,
        dispatch: function dispatch(action) {
          return _dispatch(action);
        }
        // dispatch: store.dispatch   // 这样也可以，因为store.dispatch是个function类型，不会因为store.dispatch = 别的而改变
      };
      chain = middlewares.map(function (middleware) {
          // 此处middleware处于闭包中，所以middleware.dispatch保存的一直都是最原始的store.dispatch方法。也就是说不论是异步还是同步的action,都只能触发原始的store.dispatch,并且会重新执行一遍所有的中间件
        return middleware(middlewareAPI);
      });

    //   第一种
      // chain.reverse()
      // chain.forEach(middleware =>{
      //     _dispatch = middleware(_dispatch)   // 第一次传入的_dispatch等于store.dispatch,第二次等于第一个中间件return 的 (action)=>{...}方法，....一次类推。
      // })
    //   第二种
    //   先是timeDelay,再是logger，与中间件添加的顺序相同
      _dispatch = compose.apply(undefined, chain)(store.dispatch);

      return _extends({}, store, {
        dispatch: _dispatch   // 新 dispatch 覆盖原 dispatch，往后调用 dispatch 就会依次触发 chain 内的中间件链式串联执行，最后必定会执行最原始的dispatch(action)
      });
    };
  };
}
