import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSliders,
  faCaretDown,
  faUser,
} from "@fortawesome/free-solid-svg-icons"; // Importing FontAwesome icons
import "./App.css";

// API endpoint
const API_URL = "https://api.quicksell.co/v1/internal/frontend-assignment";

function App() {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [grouping, setGrouping] = useState(
    localStorage.getItem("grouping") || "status"
  );
  const [sorting, setSorting] = useState(
    localStorage.getItem("sorting") || "priority"
  );
  const [dropdownVisible, setDropdownVisible] = useState(false);

  // Load tickets from API
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setTickets(data.tickets);
        setUsers(data.users);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchTickets();
  }, []);

  // Save grouping and sorting settings to localStorage
  useEffect(() => {
    localStorage.setItem("grouping", grouping);
  }, [grouping]);

  useEffect(() => {
    localStorage.setItem("sorting", sorting);
  }, [sorting]);

  // Group tickets by criteria
  const groupTicketsBy = (criteria) => {
    setGrouping(criteria);
  };

  // Sort tickets by criteria
  const sortTicketsBy = (criteria) => {
    setSorting(criteria);
  };

  // Get user name by userId
  const getUserName = (userId) => {
    const user = users.find((user) => user.id === userId);
    return user ? user.name : "Unknown User";
  };

  // Sort tickets based on selected sorting criteria
  const sortedTickets = [...tickets].sort((a, b) => {
    if (sorting === "priority") {
      return b.priority - a.priority;
    }
    if (sorting === "title") {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  // Group tickets based on selected grouping criteria
  const groupedTickets = sortedTickets.reduce((acc, ticket) => {
    let key;
    if (grouping === "status") {
      key = ticket.status;
    } else if (grouping === "user") {
      key = getUserName(ticket.userId);
    } else if (grouping === "priority") {
      switch (ticket.priority) {
        case 0:
          key = "No Priority";
          break;
        case 4:
          key = "Urgent";
          break;
        case 3:
          key = "High";
          break;
        case 2:
          key = "Medium";
          break;
        case 1:
          key = "Low";
          break;
        default:
          key = "Unknown Priority";
      }
    }

    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(ticket);
    return acc;
  }, {});

  // Define the desired order of priority categories
  const priorityOrder = ["No Priority", "Urgent", "High", "Medium", "Low"];

  // Mapping of priority levels to image paths
  const priorityImages = {
    0: "/images/No-priority.png",
    1: "/images/Low.png",
    2: "/images/Medium.png",
    3: "/images/high.png",
    4: "/images/UrgentOrange.png",
  };

  // Mapping of status levels to image paths
  const statusImages = {
    Todo: "/images/To-do.png",
    "In progress": "/images/inProgress.png",
    Backlog: "/images/Backlog.png",
    Done: "/images/done.png",
    Cancelled: "/images/cancelled.png",
  };

  // Helper function to get the keys in the right order
  const getGroupedKeys = () => {
    if (grouping === "user") {
      return users.slice(0, 5).map((user) => getUserName(user.id));
    }
    return grouping === "priority"
      ? priorityOrder
      : [
          "Todo",
          "In progress",
          "Backlog",
          "Done",
          "Cancelled",
          ...Object.keys(groupedTickets).filter(
            (key) =>
              !["Todo", "In progress", "Backlog", "Done", "Cancelled"].includes(
                key
              )
          ),
        ];
  };

  return (
    <div className="App">
      <nav className="navbar">
        <div className="navbar-left">
          <button
            className={`nav-btn ${dropdownVisible ? "active" : ""}`}
            onClick={() => setDropdownVisible(!dropdownVisible)}
          >
            <FontAwesomeIcon icon={faSliders} style={{ marginRight: "8px" }} />
            <span>Display</span>
            <FontAwesomeIcon icon={faCaretDown} style={{ marginLeft: "8px" }} />
          </button>
        </div>
      </nav>

      {/* Dropdown menu */}
      {dropdownVisible && (
        <div className="dropdown">
          <div className="dropdown-row">
            <div className="dropdown-section">
              <label htmlFor="grouping">Grouping</label>
              <select
                id="grouping"
                onChange={(e) => groupTicketsBy(e.target.value)}
                value={grouping}
              >
                <option value="status">Status</option>
                <option value="user">User</option>
                <option value="priority">Priority</option>
              </select>
            </div>

            <div className="dropdown-section">
              <label htmlFor="ordering">Ordering</label>
              <select
                id="ordering"
                onChange={(e) => sortTicketsBy(e.target.value)}
                value={sorting}
              >
                <option value="priority">Priority</option>
                <option value="title">Title</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Kanban Board */}
      <div className="kanban-board">
        {getGroupedKeys().map((group) => (
          <div key={group} className="kanban-column">
            <h3 className={grouping === "user" ? "group-by-user" : ""}>
              <div className="heading-left">
                {grouping === "priority" && (
                  <img
                    src={priorityImages[priorityOrder.indexOf(group)]}
                    alt={`${group} icon`}
                  />
                )}
                {grouping === "status" && statusImages[group] && (
                  <img src={statusImages[group]} alt={`${group} icon`} />
                )}
                {grouping === "user" && (
                  <FontAwesomeIcon icon={faUser} className="user-icon" />
                )}
                <span>
                  {group}{" "}
                  <span style={{ color: "#A9A9A9", marginLeft: "4px" }}>
                    {groupedTickets[group] ? groupedTickets[group].length : 0}
                  </span>
                </span>
              </div>
              {group !== "Done" && group !== "Cancelled" && (
                <div className="heading-right">
                  <img src="/images/add.png" alt="Add icon" />
                  <img src="/images/More.png" alt="More icon" />
                </div>
              )}
            </h3>

            {groupedTickets[group] && groupedTickets[group].length === 0 ? (
              <p>No tickets in this category</p>
            ) : (
              groupedTickets[group] &&
              groupedTickets[group].map((ticket) => (
                <div key={ticket.id} className="kanban-card">
                  <div className="card-header">
                    {grouping !== "user" && (
                      <FontAwesomeIcon icon={faUser} className="user-icon" />
                    )}
                  </div>
                  <p className="cam-id">{ticket.id}</p>
                  <h4 className="ticket-title">
                    <div className="ticket-header">
                      {grouping !== "status" && (
                        <img
                          src={statusImages[ticket.status]}
                          alt={`${ticket.status} icon`}
                        />
                      )}
                      <span className="ticket-title-text">
                        {ticket.title.length > 50
                          ? `${ticket.title.substring(0, 50)}...`
                          : ticket.title}
                      </span>
                    </div>
                  </h4>
                  <div className="ticket-footer">
                    {grouping !== "priority" && (
                      <img
                        src={priorityImages[ticket.priority]}
                        alt={`Priority ${ticket.priority}`}
                      />
                    )}
                    <span className="footer-label">Feature Request:</span>{" "}
                    {ticket.body}
                  </div>
                </div>
              ))
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
