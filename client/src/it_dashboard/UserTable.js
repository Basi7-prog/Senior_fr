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

function UserTable(users) {
  console.log("all user ", users);
  const headerStyle = "font-bold p-4";
  const colStyle = "cursor-pointer";

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell class={headerStyle}>Name</TableCell>
            <TableCell class={headerStyle}>Department</TableCell>
            <TableCell class={headerStyle}>Profession</TableCell>
            <TableCell class={headerStyle}>Position</TableCell>
            {/* Add more table header cells as needed */}
          </TableRow>
        </TableHead>
        {populate(users)}
        {/* <TableCell>Row 1, Cell 1</TableCell>
            <TableCell>Row 1, Cell 2</TableCell> */}

        {/* Add more table cells as needed */}
      </Table>
    </TableContainer>
  );
}

const populate = (users) => {
  const colStyle = "text-center py-3 px-2 cursor-pointer";
  const clicked = (event) => {
    console.log("clicked ",event.target.id);
    users.onAction(event.target.id);
  };
  const buttonStyle ="w-fit rounded-md p-2 text-sixtyPer bg-tenPer";
  return (
    <TableBody>
      {users.usersForTable.users?.map((user, i) => (
        <TableRow onClick={clicked}>
          <TableCell
            class={colStyle} id={user.id}
          >{`${user.firstName} ${user.middleName}`}</TableCell>
          <TableCell class={colStyle} id={user.id}>
            {
              users.usersForTable.departments?.find(
                (dpName) => user.departmentId == dpName.id
              ).name
            }
          </TableCell>
          <TableCell class={colStyle} id={user.id}>{user.profession}</TableCell>
          <TableCell class={colStyle} id={user.id}>{user.userType}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};
export default UserTable;
