import React from "react";
import { render } from "@testing-library/react";
import Application from "components/Application";

// a test to render a react component
describe("Application", () => {
  it("renders without crashing", () => {
    render(<Application />);
  });
});