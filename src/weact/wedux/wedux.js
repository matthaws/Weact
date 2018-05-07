export const createStore = reducer => {
  let state = reducer();
  const subscriptions = [];

  const store = {
    dispatch: action => {
      state = reducer(state, action);
      subscriptions.forEach(sub => sub(state));
      return action;
    },
    getState: () => {
      return state;
    },

    subscribe: subscriptionFunc => {
      subscriptions.push(subscriptionFunc);
    }
  };

  return store;
};

export const combineReducers = reducersObj => {
  return (state, action) => {
    const newState = {};
    Object.keys(reducersObj).forEach(reducerName => {
      const reducer = reducersObj[reducerName];
      newState[reducerName] = reducer(state, action);
    });

    return newState;
  };
};
