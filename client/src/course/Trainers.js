import Cookies from "js-cookie";
import { useEffect, useState, useRef, Children } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import Trainerpop from "./trainerandtrainerpopup/TrainerPopup";
import axios from "axios";

function Trainers(cId) {
  const [assignClick, setassignClick] = useState(false);
  const [allTrainers, setallTrainers] = useState({});
  const childRef = useRef({});
  const cookies = Cookies.get("accessToken");

  const addTrainer = () => {
    const resp = axios
      .get(`/getTrainers?courseId=${cId.cId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies}`,
        },
      })
      .then((res) => {
        console.log("assigned trainers:", res.data);
        setallTrainers(res.data);
        cId.setTrainers(res.data.length);
      });
  };

  useEffect(() => {
    setallTrainers({});
    addTrainer();
  }, [cId.cId]);

  const remove = (e) => {
    fetch(`/removetrainer?trainerId=${e.target.id}`, {
      headers: { Authorization: `Bearer ${cookies}` },
    }).then((res) => {
      addTrainer();
    });
  };
  const assignTrainerHandler = () => {
    fetch(`/getTrainersbydep?courseId=${cId.cId}`, {
      headers: {
        Authorization: `Bearer ${cookies}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("the trainers", data);
        childRef.current.setState({
          childState: true,
          trainers: data,
          courseId: cId.cId,
          addTrainers: addTrainer,
        });
      });
  };

  return (
    <div
      className="flex flex-col gap-y-3"
      onClick={() => {
        setassignClick(true);
      }}
    >
      {cId.userId && cId.isActive != false ? (
        <button
          className="w-fit rounded-md p-2 text-sixtyPer bg-tenPer"
          onClick={assignTrainerHandler}
        >
          Assign Trainers
        </button>
      ) : (
        <h1 className="text-lg font-medium">Trainers</h1>
      )}
      <Trainerpop ref={childRef} />
      <TableView
        trainers={allTrainers}
        removeT={remove}
        isFacil={cId.userId}
        isActive={cId.isActive}
      />
    </div>
  );
}

function TableView(allTrainers) {
  const headerStyle = "font-bold p-4 text-sm border-b-[1px]";
  const colStyle =
    "text-center py-3 px-2 cursor-pointer border-b-[1px] text-[12px]";

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell class={headerStyle}>Name</TableCell>
            {/* <TableCell class={headerStyle}>Edu.Level</TableCell> */}
            <TableCell class={headerStyle}>Approval Rate%</TableCell>
            {allTrainers.isFacil && allTrainers.isActive != false ? (
              <TableCell class={headerStyle}>Action</TableCell>
            ) : null}
          </TableRow>
        </TableHead>
        <TableBody>
          {allTrainers.trainers.length
            ? allTrainers.trainers?.map((trainer) => (
                <TableRow>
                  <TableCell class={colStyle}>
                    {trainer.User.firstName} {trainer.User.middleName}
                  </TableCell>
                  {/* <TableCell class={colStyle}>{trainer.User.gender}</TableCell> */}
                  <TableCell class={colStyle}>
                    {trainer.rating ? trainer.rating : 0}%
                  </TableCell>
                  {allTrainers.isFacil && allTrainers.isActive != false ? (
                    <TableCell
                      class={`${colStyle} text-rejected`}
                      id={trainer.id}
                      onClick={allTrainers.removeT}
                    >
                      Remove
                    </TableCell>
                  ) : null}
                </TableRow>
              ))
            : ""}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default Trainers;
export { TableView };
