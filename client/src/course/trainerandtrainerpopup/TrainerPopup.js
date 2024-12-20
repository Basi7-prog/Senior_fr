import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import React from "react";
import Popup from "reactjs-popup";

class TrainerPopup extends React.Component {
  state = {
    childState: false,
  };
  render() {
    const headerStyle = "font-bold border-t-4 p-4 text-md";
    const colStyle = "text-centerpy-3 border-t-4 p-2 cursor-pointer";
    const cookies = Cookies.get("accessToken");

    const addTrainerHandler = async (e) => {
      e.preventDefault();
      const arr = [];
      console.log("checks are", e.target[1]);
      for (let i = 0; i < e.target.length; i++) {
        if (e.target[i].classList.contains("checks")) {
          if (e.target[i].checked) {
            arr.push(e.target[i].id);
          }
        }
      }
      console.log(arr);

      await axios
        .post(
          `/addTrainers?trainers=${arr}&courseId=${this.state.courseId}`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${cookies}`,
            },
          }
        )
        .then(() => {
          this.setState({ childState: false });
          this.state.addTrainers();
        });
    };
    return (
      <Popup
        open={this.state.childState}
        onClose={() => this.setState({ childState: false })}
        modal
        className=""
      >
        <div className="bg-thirtyPer text-sm rounded-md drop-shadow-xl p-10">
          <div className="">
            <h1 className="font-bold text-2xl text-gray-600 mb-6">
              Select Trainer
            </h1>
          </div>
          <div className="">
            <form onSubmit={addTrainerHandler}>
              <button type="submit">Add Trainers</button>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell class={headerStyle}>Name</TableCell>
                      <TableCell class={headerStyle}>Edu.Level</TableCell>
                      <TableCell class={headerStyle}>Gender</TableCell>
                      <TableCell class={headerStyle}>Age</TableCell>
                      <TableCell class={headerStyle}>Rating</TableCell>
                      <TableCell class={headerStyle}>Add</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.trainers?.map((trainer, i) => (
                      <TableRow class={""}>
                        <TableCell class={colStyle}>
                          {trainer.firstName} {trainer.middleName}
                        </TableCell>
                        <TableCell class={colStyle}>{trainer.eduLevel}</TableCell>
                        <TableCell class={colStyle}>{trainer.gender}</TableCell>
                        <TableCell class={colStyle}>{trainer.Dob}</TableCell>
                        <TableCell class={colStyle}>---</TableCell>
                        <TableCell class={colStyle}>
                          <input
                            type="checkbox"
                            class="checks asd"
                            id={trainer.id}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </form>
          </div>
        </div>
      </Popup>
    );
  }
}

export default TrainerPopup;
