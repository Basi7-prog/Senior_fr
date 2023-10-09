import React, { useState, useEffect } from "react";
import Popup from "reactjs-popup";

class AddEditPopup extends React.Component {
  state = {
    childState: false,
    user: "",
  };
  render() {
    const addHandler = (event) => {
      event.preventDefault();
      this.setState({ childState: false });
    };
    console.log(this.state.user.CPD, this.state.departments);

    const assignFromForm = (e) => {
      this.setState({ childState: false });
      return {
        firstName: e.target[1].value,
        middleName: e.target[2].value,
        lastName: e.target[3].value,
        gender: e.target[6].value,
        cpdId: e.target[8].selectedIndex+1,
        email: e.target[7].value,
        phone: e.target[10].value,
        profession: e.target[9].value,
        Dob: e.target[4].value,
        userName: e.target[5].value,
      };
    };
    const handleAdd = (e) => {
      e.preventDefault();
      const newUser = assignFromForm(e);
      console.log("add form: ", newUser);
      if (Object.values(newUser).includes("")) {
        console.log("one or more field is empty");
        this.setState({ childState: true });
      } else {
        this.state.onSaveNewAction(newUser);
      }
    };
    const handleEdit = (e) => {
      e.preventDefault();
      let editedUser = assignFromForm(e);
      editedUser = { ...editedUser, oldUserName: this.state.user.userName };

      console.log("edit form: ", editedUser);
      if (Object.values(editedUser).includes("")) {
        console.log("one or more field is empty");
        this.setState({ childState: true });
      } else {
        this.state.onSaveEditAction(editedUser);
      }
    };
    const dropDownStyle =
      "border-[1px] border-borderc rounded-lg px-3 py-1 focus:drop-shadow-[0_0px_3px_#0582F5] focus:border-tenPer outline-0";

    return (
      <div className="">
        <button
          onClick={() => this.setState({ childState: true, user: 0 })}
          className="rounded-md p-2 w-28 text-sixtyPer bg-tenPer mt-4"
        >
          Add CPD
        </button>
        <Popup
          open={this.state.childState}
          onClose={() => this.setState({ childState: false })}
          modal
        >
          <div className="w-fit bg-thirtyPer container mx-auto rounded-lg drop-shadow-[0_0px_5px_rgba(0,0,0,.25)]">
            {/* <h1 className="text-center text-2xl font-bold mb-8">
              {this.state.user ? "Edit" : "Add"} Staff
            </h1> */}
            <form onSubmit={this.state.user ? handleEdit : handleAdd}>
              <div className="py-2 px-9 flex flex-row justify-between">
                <h1 className="text-2xl font-bold text-heading">
                  {this.state.user ? "Edit" : "Add"} CPD
                </h1>
                <div className="flex gap-5">
                  <button className="rounded-md px-5 text-sixtyPer text-xl bg-tenPer" type="submit">
                    Save
                  </button>
                </div>
              </div>
              <div className="p-5 py-12 bg-sixtyPer rounded-b-lg grid grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    className={dropDownStyle}
                    required={true}
                    type="text"
                    id="firstName"
                    name="firstName"
                    defaultValue={this.state.user.firstName}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="middleName">Middle Name</label>
                  <input
                    className={dropDownStyle}
                    required={true}
                    type="text"
                    id="middleName"
                    name="middleName"
                    defaultValue={this.state.user.middleName}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    className={dropDownStyle}
                    required={true}
                    type="text"
                    id="lastName"
                    name="lastName"
                    defaultValue={this.state.user.lastName}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="dob">Date of Birth</label>
                  <input
                    className={dropDownStyle}
                    required={true}
                    type="date"
                    id="dob"
                    name="dob"
                    defaultValue={this.state.user.Dob?.toString()}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="userName">Username</label>
                  <input
                    className={dropDownStyle}
                    required={true}
                    type="text"
                    id="userName"
                    name="userName"
                    defaultValue={this.state.user.userName}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="gender">Gender</label>
                  <select className={dropDownStyle} defaultValue={this.state.user.gender} name="gender" id="gender">
                    <option value={"Male"}>Male</option>
                    <option value={"Female"}>Female</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="email">Email</label>
                  <input
                    className={dropDownStyle}
                    required={true}
                    type="email"
                    id="email"
                    name="email"
                    defaultValue={this.state.user.email}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="department">CPD Center</label>
                  <select
                    className={dropDownStyle}
                    name="CPDCenter"
                    id="CPDCenter"
                    defaultValue={
                      this.state.user
                        ? this.state.user.CPD.name
                        : ""
                    }
                  >
                    {this.state.departments?.map((dep, i) => (
                      <option value={dep.name}>{dep.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="profession">Profession</label>
                  <input
                    className={dropDownStyle}
                    required={true}
                    type="text"
                    id="profession"
                    name="profession"
                    defaultValue={this.state.user.profession}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="phone">Phone</label>
                  <input
                    className={dropDownStyle}
                    required={true}
                    type="tel"
                    id="phone"
                    name="phone"
                    defaultValue={this.state.user.phone}
                  />
                </div>
              </div>
              {/* <button
                type="submit"
                className="rounded-md p-2 w-28 text-sixtyPer bg-tenPer mt-4"
              >
                Done
              </button> */}
            </form>
          </div>
        </Popup>
      </div>
    );
  }
}

export default AddEditPopup;
