import Weact from "../weact.js";

export const configureConnect = store => (
  mapStateToProps,
  mapDispatchToProps
) => Component => ownProps => {
  const { state, dispatch } = store;
  const mappedState = mapStateToProps ? mapStateToProps(state, ownProps) : {};
  const mappedDispatch = mapDispatchToProps
    ? mapDispatchToProps(dispatch, ownProps)
    : {};

  const combinedProps = Object.assign(
    {},
    mappedState,
    mappedDispatch,
    ownProps
  );

  return <Component {...combinedProps} />;
};
