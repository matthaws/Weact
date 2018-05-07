import Weact from "../weact.js";

export const configureConnect = store => (
  mapStateToProps,
  mapDispatchToProps
) => Component => ownProps => {
  const { state, dispatch } = store;
  let mappedState;
  let mappedDispatch;

  const subscriptionFunc = state => {
    mappedState = mapStateToProps ? mapStateToProps(state, ownProps) : {};
    mappedDispatch = mapDispatchToProps
      ? mapDispatchToProps(dispatch, ownProps)
      : {};
  };

  store.subscribe(subscriptionFunc);

  const combinedProps = Object.assign(
    {},
    mappedState,
    mappedDispatch,
    ownProps
  );

  return <Component {...combinedProps} />;
};
