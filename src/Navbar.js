import React from "react";
import "./Navbar.css";


const Navbar = ({ dropdownVisible, setDropdownVisible }) => {
  return (
    <nav className="navbar">
      <h1>Kanban Board</h1>
      <button onClick={() => setDropdownVisible(!dropdownVisible)}>
        {dropdownVisible ? "Hide Options" : "Show Options"}
      </button>
    </nav>
  );
};

export default Navbar;
