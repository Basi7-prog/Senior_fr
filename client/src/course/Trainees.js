import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import Traineepop from "./trainerandtrainerpopup/TraineeForm";
import Cookies from "js-cookie";

function Trainees(courseId) {
  const childRef = useRef({});
  const [alltrainees, setalltrainees] = useState({});
  const cookies = Cookies.get("accessToken");

  const assignTraineeHandler = () => {
    childRef.current.setState({
      childState: true,
      courseId: courseId.cId,
      addAction: addTrainee,
    });
  };

  const addTrainee = (trainee) => {
    console.log("sent added trainee", trainee);
    fetch(`/getTrainees?courseId=${courseId.cId}`, {
      headers: { Authorization: `Bearer ${cookies}` },
    })
      .then((res) => res.json())
      .then((res) => {
        setalltrainees(res);
        courseId.setEnrolledT(res.length)
        console.log(alltrainees);
      });
    // setalltrainees((prev) => ({ ...prev, trainee }));
    // console.log("sent added trainee",alltrainees);
  };
  const remove=(e)=>{
    fetch(`/removetrainee?traineeId=${e.target.id}`, {
      headers: { Authorization: `Bearer ${cookies}` },
    })
      .then((res) => 
      addTrainee())
  }

  useEffect(() => {
    addTrainee();
  }, []);
  return (
    <div className="flex flex-col gap-y-3">
      <button
        className="w-fit rounded-md p-2 text-sixtyPer bg-tenPer"
        onClick={assignTraineeHandler}
      >
        New Trainees
      </button>
      <Traineepop ref={childRef} />
      <TableView getTrainees={alltrainees} setTrainees={setalltrainees} removeT={remove} />
    </div>
  );
}

function TableView(trainees) {
  const headerStyle = "font-bold p-4 text-sm border-b-[1px]";
  const colStyle = "text-center py-3 px-2 cursor-pointer border-b-[1px] text-[12px]";
  console.log(trainees.getTrainees.length);
  return (
    <div>
      {trainees.getTrainees.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell class={headerStyle}>Name</TableCell>
                <TableCell class={headerStyle}>Edu.Level</TableCell>
                <TableCell class={headerStyle}>Attendance%</TableCell>
                <TableCell class={headerStyle}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {trainees.getTrainees?.map((trainee, i) => (
                <TableRow>
                  <TableCell class={colStyle}>
                    {trainee.User.firstName} {trainee.User.middleName}
                  </TableCell>
                  <TableCell class={colStyle}>{trainee.User.gender}</TableCell>
                  <TableCell class={colStyle}>
                    {trainee.attendance ? trainee.attendance : 0}%
                  </TableCell>
                  <TableCell class={`${colStyle} text-rejected`} id={trainee.id} onClick={trainees.removeT}>Remove</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        "no trainees"
      )}
    </div>
  );
}
export default Trainees;
export { TableView };
