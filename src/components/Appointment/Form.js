import React, { useState } from "react";
import InterviewerList from "components/InterviewerList";
import Button from "components/Button";

export default function Form(props) {
  const [student, setStudent] = useState(props.student || "");
  const [interviewer, setInterviewer] = useState(props.interviewer || null);
  const [error, setError] = useState("");

  // reset form function
  const reset = () => {
    setStudent("");
    // setError("");
    setInterviewer(null);
  };

  // cancel form function
  const cancel = () => {
    reset();
    props.onCancel();
  };

  // empty student name and unselected interviewer should not save
  function saveError() {
    if (student === "") {
      setError("Name can't be blank.");
      return;
    }
    if (interviewer === null) {
      setError("Interviewer can't be unselected.");
      return;
    }
    props.onSave(student, interviewer);
    setError("");
  }
  
  return (
      <main className="appointment__card appointment__card--create">
        <section className="appointment__card-left">
          <form autoComplete="off" onSubmit={(event) => event.preventDefault}>
            <input
              value={student}
              className="appointment__create-input text--semi-bold"
              name="name"
              type="text"
              placeholder="Enter Student Name"
              data-testid="student-name-input"
              onChange={(event) => setStudent(event.target.value)}
            />
          </form>
          <section className="appointment__validation">{error}</section>
          <InterviewerList
            interviewers={props.interviewers}
            value={interviewer}
            onChange={setInterviewer}
          />
        </section>
        <section className="appointment__card-right">
          <section className="appointment__actions">
            <Button danger onClick={() => cancel(student)}>
              Cancel
            </Button>
            <Button confirm onClick={saveError}>
              Save
            </Button>
          </section>
        </section>
      </main>
    );
  }