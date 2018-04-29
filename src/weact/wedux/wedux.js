const createStore = reducer => {
  let state = reducer();

  const store = {
    dispatch: action => {
      state = reducer(state, action);
      return action;
    },
    getState: () => {
      return state;
    }
  };

  return store;
};

const combineReducers = reducersObj => {
  return (state, action) => {
    const newState = {};
    Object.keys(reducersObj).forEach(reducerName => {
      const reducer = reducersObj[reducerName];
      newState[reducerName] = reducer(state, action);
    });

    return newState;
  };
};
