function createThunkMiddleware(extraArgument) {
  return ({ dispatch, getState }) => next => action => {
    if (typeof action === 'function') {
        // 如果redux-thunk中间件检测到action不是一个object，那么不会触发dispatch，而是将dispatch方法传到action方法里，并执行action,由action决定在何时触发dispatch
      return action(dispatch, getState, extraArgument);
    }

    return next(action);
  };
}

const thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

export default thunk;
