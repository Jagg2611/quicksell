import React from "react";
import Ticket from "./Ticket";
import "./KanbanBoard.css";


const KanbanBoard = ({ tickets, users, grouping, sorting }) => {
  // Function to group and sort tickets
  const processTickets = () => {
    // Grouping logic
    const groupedTickets = tickets.reduce((acc, ticket) => {
      const key = ticket[grouping] || "Unassigned";
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(ticket);
      return acc;
    }, {});

    // Sorting logic
    const sortedGroups = Object.keys(groupedTickets).map((groupKey) => {
      return {
        group: groupKey,
        tickets: groupedTickets[groupKey].sort((a, b) => {
          if (sorting === "priority") {
            return a.priority - b.priority; // Assuming priority is a number
          } else if (sorting === "dueDate") {
            return new Date(a.dueDate) - new Date(b.dueDate);
          }
          return 0;
        }),
      };
    });

    return sortedGroups;
  };

  const processedTickets = processTickets();

  return (
    <div className="kanban-board">
      {processedTickets.map((group) => (
        <div key={group.group} className="kanban-column">
          <h2>{group.group}</h2>
          {group.tickets.map((ticket) => (
            <Ticket key={ticket.id} ticket={ticket} users={users} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;
