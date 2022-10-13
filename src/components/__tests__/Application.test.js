import React from "react";
import { render } from "@testing-library/react";

// import component for testing 

import Application from "components/Application";


// A test that renders a React Component

describe("Application", () => {
  it("renders without crashing", () => {
    render(<Application />);
  });
}); 