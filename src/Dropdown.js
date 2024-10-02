import React from "react";
import "./Dropdown.css";


const Dropdown = ({ grouping, sorting, groupTicketsBy, sortTicketsBy }) => {
  return (
    <div className="dropdown">
      <h3>Group By</h3>
      <button onClick={() => groupTicketsBy("status")}>Status</button>
      <button onClick={() => groupTicketsBy("assignee")}>Assignee</button>

      <h3>Sort By</h3>
      <button onClick={() => sortTicketsBy("priority")}>Priority</button>
      <button onClick={() => sortTicketsBy("dueDate")}>Due Date</button>
    </div>
  );
};

export default Dropdown;
