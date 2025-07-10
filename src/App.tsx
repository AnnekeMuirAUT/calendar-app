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

function createData(
  date: string,
  start: string,
  end: string,
  eventName: string
) {
  return { date, start, end, eventName };
}

function App() {
  const rows = [
    createData("2023-10-01", "10:00", "11:00", "Meeting with team"),
    createData("2023-10-02", "12:00", "13:00", "Doctor appointment"),
  ];

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
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell>
                  <input type="date" />
                </TableCell>
                <TableCell>
                  <input type="time" />
                </TableCell>
                <TableCell>
                  <input type="time" />
                </TableCell>
                <TableCell>
                  <input type="text" placeholder="Event name" />
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="success"
                    startIcon={<AddCircleOutlineIcon />}
                  >
                    Add
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <br />
        <Button variant="contained" startIcon={<EditCalendarIcon />}>
          Create events
        </Button>
      </div>
    </>
  );
}

export default App;
