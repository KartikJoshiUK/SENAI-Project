// IMPORTS
const express = require("express");

// Constants
const app = express();
const PORT = 3000;

// Middlewares
app.use(express.json());

// InitialValues
const people = [
  { id: "#1", name: "Person 1", tickets: [] },
  { id: "#2", name: "Person 2", tickets: [] },
  { id: "#3", name: "Person 3", tickets: [] },
  { id: "#4", name: "Person 4", tickets: [] },
  { id: "#5", name: "Person 5", tickets: [] },
];
let ticketCounter = 1;
let currentAssigneeIndex = 0;

// Create a new ticket
app.post("/tickets", (req, res) => {
  try {
    const { user_id, issue } = req.body;
    if (!user_id || !issue) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    // Assigning Person acccording to the Round Robin Algorithm
    const assignedPerson = people[currentAssigneeIndex];
    currentAssigneeIndex = (currentAssigneeIndex + 1) % people.length;

    // Generating new unique id
    ticketCounter++;

    // Ticket
    const ticket = {
      ticket_id: ticketCounter,
      issue,
      raisedBy: user_id,
    };
    // Response Data
    const data = {
      ticket_id: ticketCounter,
      assigned_to: assignedPerson.id,
    };

    if (assignedPerson) {
      assignedPerson.tickets.push(ticket);
      console.log(assignedPerson);
      return res
        .status(201)
        .json({ message: "Ticket created successfully", success: true, data });
    } else {
      return res
        .status(404)
        .json({ message: "Assigned person not found", success: false });
    }
  } catch {
    res.status(500).json({ message: "Something went wrong", success: false });
  }
});

// EXTRA FUNCTIONALITIES
app.get("/", (req, res) => {
  res.status(200).send("Server Running Properly => [POST on /tickets]");
});
app.get("/reset", (req, res) => {
  // Resetting values
  ticketCounter = 1;
  currentAssigneeIndex = 0;
  people = people.map((person) => {
    person.tickets = [];
  });
  res.status(200).send("All tickets are reset");
});
app.get("/tickets", (req, res) => {
  res.status(200).json(people);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
