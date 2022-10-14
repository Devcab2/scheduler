import React from "react";
import {
  render,
  cleanup,
  waitForElement,
  fireEvent,
  getByText,
  getAllByTestId,
  getByAltText,
  getByPlaceholderText,
  queryByText,
  queryByAltText,
  waitForElementToBeRemoved,
 } from "@testing-library/react";

// import component for testing 

import Application from "components/Application";
import axios from "axios";

afterEach(cleanup);


// A test that renders a React Component

describe("Application", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", () => {
    const { getByText } = render(<Application />);

    return waitForElement(() => getByText("Monday")).then(() => {
      fireEvent.click(getByText("Tuesday"));
      expect(getByText("Leopold Silvers")).toBeInTheDocument();
    });
  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");

    const appointment = getAllByTestId(container, "appointment")[0];

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones"}
    });

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    await waitForElementToBeRemoved(() => getByText(appointment, "Saving"));
    expect(getByText(appointment, "Lydia Miller-Jones")).toBeInTheDocument();

    const day = getAllByTestId(container, "day").find((day) => queryByText(day, "Monday")
    );

    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async() =>{
    //Render the app
    const { container } = render(<Application />);

    // w8 until text " Archie Cohen" is displayed
    await waitForElement(() => getByText(container, "Archie Cohen")
    );

    //click the "Delete" button on selected appointment
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(getByAltText(appointment, "Delete"));

    //check that confirmation msg is shown
    expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();

    //click the "Confirm" button on confirmation
    fireEvent.click(getByText(appointment, "Confirm"));

    //check that the element with the text "Deleting" is displayed
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();

    //w8 until element with "Add" button is displayed
    await waitForElement(() => getByAltText(appointment, "Add"));

    //check that dayListItem w the text "Monday" also has the text "2 spots remaining"
    const day = getAllByTestId(container, "day").find(day => queryByText(day, "Monday")
    );

    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
  });

  it ("loads data, edits an interview and keeps the spots remaining for Monday the same", async () =>{
   
    //render the app
    const { container } = render(<Application/>);

    //wait until the text "Archie Cohen" is displayed
    await waitForElement(() => getByText(container, "Archie Cohen"));

    //click the "Edit" button on the booked appointment
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
    
    fireEvent.click(getByAltText(appointment, "Edit"));

    //change the interviewer
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));

    //check that the element with the text "Saving is displayed"
    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    //check the dayListItem w text "Monday" also has the text "1 spot remaining"
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
 
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();     
  });

  it("shows the save error when failing to save an appointment", async () =>{
    axios.put.mockRejectedValueOnce();

    //render the application
    const {container} = render(<Application/>);

    //wait until the text "Archie Cohen" is displayed
    await waitForElement(() => getByText(container, "Archie Cohen"));
    
    //click the "Edit" button on the booked appointment
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(getByAltText(appointment, "Edit"));

    //change the interviewer
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));

    // check that the element with the text "Saving" is displayed
    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    //wait for "Saving" element to be removed and check that an error was thrown
    await waitForElementToBeRemoved(() => getByText(appointment, "Saving"));
    expect(getByText(appointment, "Could not create appointment")).toBeInTheDocument();
  });

  it("shows the delete error when failing to delete an existing appointment", async() =>{
    axios.delete.mockRejectedValueOnce();

    //render the application
    const {container} = render(<Application/>);

    //wait until the text "Archie Cohen" is displayed
    await waitForElement(() => getByText(container, "Archie Cohen"));

    //click the "Edit" button on the booked appointment
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(getByAltText(appointment, "Delete"));

    //check that the confirmation message is shown
    expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();

    //click the "Confirm" button on the confirmation
    fireEvent.click(getByText(appointment, "Confirm"));

    //check that the element with the text "Deleting" is displayed
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();

    //wait for the "Saving" element to be removed and check that an error was thrown
    await waitForElementToBeRemoved(() => getByText(appointment, "Deleting"));
    expect(getByText(appointment, "Could not cancel appointment")).toBeInTheDocument(); 
  });
}); 