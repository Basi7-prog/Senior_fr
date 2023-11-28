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

class FacilitatorPopUp extends React.Component {
  state = {
    childState: false,
  };
  render() {
    const headerStyle = "font-bold border-t-4 p-4 text-md";
    const colStyle = "text-centerpy-3 border-t-4 p-2 cursor-pointer";
    const cookies = Cookies.get("accessToken");

    const addFacilitatorHandler = async (e) => {
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
          `/addFacilitator?facilitators=${arr}&courseId=${this.state.courseId}`,
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
          this.state.loading(true);
          this.state.addFacilitators();
        });
    };

    return (
      <div className="">
        <Popup
          open={this.state.childState}
          onClose={() => this.setState({ childState: false })}
          modal
          className=""
        >
          <div className="bg-thirtyPer text-sm rounded-md drop-shadow-xl p-10">
            <div className="">
              <h1 className="font-bold text-2xl text-gray-600 mb-6">
                Select Facilitator
              </h1>
            </div>
            <div className="">
              <form onSubmit={addFacilitatorHandler}>
                <button type="submit" className="w-fit mt-4 rounded-md p-2 text-sixtyPer bg-tenPer">+ Facilitator</button>
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
                      {this.state.facilitator?.map((facili, i) => (
                        <TableRow class={""}>
                          <TableCell class={colStyle}>
                            {facili.firstName} {facili.middleName}
                          </TableCell>
                          <TableCell class={colStyle}>{facili.eduLevel}</TableCell>
                          <TableCell class={colStyle}>
                            {facili.gender}
                          </TableCell>
                          <TableCell class={colStyle}>{facili.Dob}</TableCell>
                          <TableCell class={colStyle}>---</TableCell>
                          <TableCell class={colStyle}>
                            <input
                              type="checkbox"
                              class="checks asd"
                              id={facili.id}
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
      </div>
    );
  }
}

export default FacilitatorPopUp;
