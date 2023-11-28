import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useState } from "react";

function CourseTable(course) {
  console.log("all course ", course.courseTable);
  const headerStyle = "font-bold p-4";
  const colStyle = "cursor-pointer";
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell class={headerStyle}>Topic</TableCell>
            <TableCell class={headerStyle}>Organizer</TableCell>
            <TableCell class={headerStyle}>Ratings</TableCell>
            <TableCell class={headerStyle}>Status</TableCell>
            {/* Add more table header cells as needed */}
          </TableRow>
        </TableHead>
        {populate(course)}
        {/* <TableCell>Row 1, Cell 1</TableCell>
              <TableCell>Row 1, Cell 2</TableCell> */}

        {/* Add more table cells as needed */}
      </Table>
    </TableContainer>
  );
}

const populate = (course) => {
  const colStyle = "text-center py-3 px-2 cursor-pointer";
  const clicked = (event) => {
    console.log("clicked inside ", event);
    course.clickHandler(event);
  };
  const buttonStyle = "w-fit rounded-md p-2 text-sixtyPer bg-tenPer";
  return (
    <TableBody>
      {course.courseTable?.map((crs, i) => (
        <TableRow onClick={()=>{clicked(i)}}>
          <TableCell class={colStyle}>
            {crs.topic}
          </TableCell>
          <TableCell class={colStyle}>
            {crs.CPD?.name?crs.CPD?.name:"Self"}
          </TableCell>
          <TableCell class={colStyle}>
            {crs.Course?.courseRating ? crs.Course?.courseRating:"---"}
          </TableCell>
          <TableCell class={colStyle}>
            {crs.Course?.courseStatus === null
              ? "Not Started"
              : crs.Course?.courseStatus
              ? "Active"
              : "Done"}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};
export default CourseTable;
