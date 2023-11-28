import axios from "axios";
import Cookies from "js-cookie";
import React from "react";
import Popup from "reactjs-popup";

class AddDepartment extends React.Component {
  state = {
    childState: false,
  };
  render() {
    const cookies = Cookies.get("accessToken");
    let newDep = { depName: "", privilage: "" };
    const assignFromForm = (e) => {
      for (let i = 0; i < e.target.length; i++) {
        const element = e.target[i];
        if (element.id == "depName") {
          newDep.depName = element.value;
        } 
        // else if (element.id == "privilage") {
        //   newDep.privilage = element.value;
        // }
      }
      return newDep;
    };
    const handleAdd = (e) => {
      e.preventDefault();
      const newDep=assignFromForm(e);
      console.log(newDep);
        axios.post("/adddepartment",{newDep},{
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies}`,
          },
        }).then((res)=>{
            this.setState({ childState: false });
            this.state.setDeps();
        })
    };
    const dropDownStyle =
      "border-[1px] border-borderc rounded-lg px-3 py-1 focus:drop-shadow-[0_0px_3px_#0582F5] focus:border-tenPer outline-0";

    return (
      <div className="">
        <Popup
          open={this.state.childState}
          onClose={() => this.setState({ childState: false })}
          modal
        >
          <div className="w-fit bg-thirtyPer container mx-auto rounded-lg drop-shadow-[0_0px_5px_rgba(0,0,0,.25)]">
            <form onSubmit={handleAdd}>
              <div className="py-2 px-9 flex flex-row gap-x-12">
                <h1 className="text-2xl font-bold text-heading">
                  New Department
                </h1>
                <div className="flex gap-5">
                  <button
                    className="rounded-md px-5 text-sixtyPer text-xl bg-tenPer"
                    type="submit"
                  >
                    Save
                  </button>
                </div>
              </div>
              <div className="p-5 py-12 bg-sixtyPer rounded-b-lg grid grid-cols-1 gap-4">
                <div className="flex flex-col">
                  <label htmlFor="depName">Department Name</label>
                  <input
                    className={dropDownStyle}
                    required={true}
                    type="text"
                    id="depName"
                    name="depName"
                  />
                </div>

                {/* <div className="flex flex-col">
                  <label htmlFor="privilage">Privilage</label>
                  <select
                    className={dropDownStyle}
                    name="privilage"
                    id="privilage"
                    defaultValue="false"
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div> */}
              </div>
            </form>
          </div>
        </Popup>
      </div>
    );
  }
}

export default AddDepartment;
