import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useEffect, useState } from "react";

function ProposalTable(proposal) {
  console.log("all proposals ", proposal);
  const headerStyle = "font-bold p-4";

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell class={headerStyle}>Proposal Name</TableCell>
            <TableCell class={headerStyle}>Requested Date</TableCell>
            <TableCell class={headerStyle}>Status</TableCell>
            {/* Add more table header cells as needed */}
          </TableRow>
        </TableHead>
        <Populate
          proposal={proposal}
        />
        {/* <TableCell>Row 1, Cell 1</TableCell>
              <TableCell>Row 1, Cell 2</TableCell> */}

        {/* Add more table cells as needed */}
      </Table>
    </TableContainer>
  );
}

function Populate({ proposal }) {
  const colStyle = "text-center py-3 px-2 cursor-pointer";
  const clicked = (event) => {
    console.log("clicked ", event.target.id);
    proposal.onAction(event.target.id);
  };

  const isApprove = (bStatus, vStatus) => {
    if (bStatus != null && bStatus == false) {
      return ["text-rejected", "Rejected"];
    }
    if ((bStatus != null && bStatus && vStatus == null)||bStatus==null) {
      return ["text-tenPer", "Pending..."];
    } else {
      return ["text-accepted", "Accepted"];
    }
  };
  //   const buttonStyle = "w-fit rounded-md p-2 text-sixtyPer bg-tenPer";
  return (
    <TableBody>
      {proposal.proposalForTable?.map((props, i) => (
        <TableRow>
          <TableCell onClick={clicked} class={colStyle} id={props.id}>
            {props.topic}
          </TableCell>
          <TableCell onClick={clicked} class={colStyle} id={props.id}>
            {props.requestDate}
          </TableCell>
          <TableCell onClick={clicked}
            class={`${colStyle} ${
              isApprove(props.approveBudgetStatus, props.trainingTypeId)[0]
            }`}
            id={props.id}
          >
            {isApprove(props.approveBudgetStatus, props.trainingTypeId)[1]}
          </TableCell>
            <button id={props.id} className="rounded-md p-2 text-sixtyPer bg-tenPer">See Course</button>
        </TableRow>
      ))}
    </TableBody>
  );
}
export default ProposalTable;
export { Populate };
