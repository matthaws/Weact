import { createElement } from "./elements/weactElements";
import { Component } from "./component/weactComponent";
import { render } from "./fiber/1-fiberLoop";

const Weact = {
  createElement,
  Component,
  render
};

export default Weact;
