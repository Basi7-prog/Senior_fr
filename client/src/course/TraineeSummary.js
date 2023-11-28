import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
function TraineeSummary(user) {
  const params = useParams();
  const [alltrainees, setalltrainees] = useState({});
  const cookies = Cookies.get("accessToken");
  useEffect((user) => {
    fetch(`/getTrainees?courseId=${params.id}`, {
      headers: { Authorization: `Bearer ${cookies}` },
    })
      .then((res) => res.json())
      .then((res) => {
        setalltrainees(res);
        console.log("course summary", alltrainees);
      });
  }, []);
  return (
    <div className=" overflow-hidden text-md text-[14px] flex-col">
      <h1 className="text-xl font-semibold ">Trainee Summerized data</h1>
      <ParticipantTable data={alltrainees} />
    </div>
  );
}
function ParticipantTable(data) {
  const headerStyle = "font-semibold text-sm p-2";
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell class={headerStyle}>Full name of Participant</TableCell>
            <TableCell class={headerStyle}>S. No</TableCell>
            <TableCell class={headerStyle}>Sex</TableCell>
            <TableCell class={headerStyle}>Full name of Profession</TableCell>
            <TableCell class={headerStyle}>
              Full name of Educational level
            </TableCell>
            <TableCell class={headerStyle}>Responsibility</TableCell>
            <TableCell class={headerStyle}>
              Full Name of Working (employed) facility /organization/
            </TableCell>
            <TableCell class={headerStyle}>
              Working (employed) facility /organization/ Category
            </TableCell>
            <TableCell class={headerStyle}>Telephone number</TableCell>
            <TableCell class={headerStyle}>Full name of organizer</TableCell>
            <TableCell class={headerStyle}>Training (course) Title</TableCell>
            <TableCell class={headerStyle}>Month of event organized</TableCell>
            <TableCell class={headerStyle}>
              Training Starting & end date
            </TableCell>
            <TableCell class={headerStyle}>Lasting days</TableCell>
            <TableCell class={headerStyle}>Pre test result</TableCell>
            <TableCell class={headerStyle}>Post test result</TableCell>
            <TableCell class={headerStyle}>Certified</TableCell>
            <TableCell class={headerStyle}>CEU Given</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow class={""}>
            <TableCell className={""}>{data.data[0]?.User.firstName}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TraineeSummary;
export { ParticipantTable };
