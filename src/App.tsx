import * as React from "react";
import "./App.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";

interface EventData {
  id: number;
  date: string;
  start: string;
  end: string;
  eventName: string;
}

function createEvent(
  id: number,
  date: string,
  start: string,
  end: string,
  eventName: string
) {
  return { id, date, start, end, eventName } as EventData;
}

function App() {
  const [rows, setRows] = React.useState<EventData[]>([
    createEvent(1, "2025-07-11", "10:00", "11:00", "Meeting with team"),
    createEvent(2, "2025-07-12", "12:00", "13:00", "Doctor appointment"),
  ]);
  const nextId = React.useRef(3); // start at 3 as test data has 2 events
  const [date, setDate] = React.useState<string>("");
  const [startTime, setStartTime] = React.useState<string>("");
  const [endTime, setEndTime] = React.useState<string>("");
  const [eventName, setEventName] = React.useState<string>("");

  function handleDeleteEvent(id: number) {
    setRows((prev) => prev.filter((row) => row.id !== id));
  }

  function handleAddEvent() {
    const newEvent: EventData = {
      id: nextId.current,
      date: date,
      start: startTime,
      end: endTime,
      eventName: eventName,
    };
    // reset input fields after adding the event
    setDate("");
    setStartTime("");
    setEndTime("");
    setEventName("");
    setRows((prev) => [...prev, newEvent]);
    nextId.current += 1; // increment the id counter
  }

  async function handleCreateEvents() {
    const response = await fetch("http://localhost:5000/create-events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        events: rows,
      }),
    });

    if (!response.ok) {
      console.error("Failed to create events");
      return;
    }

    setRows([]); // clear the table after creating events
    const htmlMessage = await response.text();
    // display the response message in the result div
    document.getElementById("result")!.innerHTML = htmlMessage;
  }
  return (
    <>
      <div className="content">
        <h1>Calendar App</h1>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Start</TableCell>
                <TableCell>End</TableCell>
                <TableCell>Event name</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, key) => (
                <TableRow key={key}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.start}</TableCell>
                  <TableCell>{row.end}</TableCell>
                  <TableCell>{row.eventName}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteEvent(row.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <input
                    type="text"
                    placeholder="Event name"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="success"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={() => handleAddEvent()}
                  >
                    Add
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <br />
        <Button
          variant="contained"
          startIcon={<EditCalendarIcon />}
          onClick={handleCreateEvents}
        >
          Create events
        </Button>
        <div id="result"></div>
      </div>
    </>
  );
}

export default App;
