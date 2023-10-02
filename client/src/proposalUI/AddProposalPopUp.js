import React, { useState, useEffect } from "react";
import Popup from "reactjs-popup";

class AddPoposalPopUp extends React.Component {
  state = {
    childState: false,
    proposal: {},
    department: "",
  };

  render() {
    const approveRejected = (data) => {
      if (data == null) {
        return "Pending";
      }
      if (data) {
        return (<p className="text-accepted">Approved</p>);
      } else {
        return (<p className="text-rejected">Rejected</p>);
      }
    };
    const extraInfo = () => {
      return (
        <div className="mt-12 text-center flex flex-row gap-x-6 justify-center">
          <div className="flex flex-row gap-2">
            <label className="text-text font-bold">Budget Request:</label>
            <label className="text-text">
              {approveRejected(this.state.proposal.approveBudgetStatus)}
            </label>
          </div>
          <div className="flex flex-row gap-2">
            <label className="text-text font-bold">Budget Approved Date:</label>
            <label className="text-text">
              {this.state.proposal.budgetApprovedRejectedDate
                ? this.state.proposal.budgetApprovedRejectedDate
                : "---"}
            </label>
          </div>
        </div>
      );
    };
    console.log(
      this.state.proposal.endDate?.toString(),
      this.state.proposal.startDate?.toString(),
      this.state.department
    );
    const today = `${new Date().getFullYear()}-${(new Date().getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${new Date().getDay().toString().padStart(2, "0")}`;
    const assignFromForm = (e) => {
      this.setState({ childState: false });
      return {
        topic: e.target[2].value,
        startDate: e.target[3].value,
        endDate: e.target[4].value,
        targetProfession: e.target[5].value,
        numberOfFacilitator: e.target[6].value,
        departmentId: this.state.department.id,
        numberOfTrainee: e.target[7].value,
        budget: e.target[8].value,
        numberOfTrainer: e.target[9].value,
        requestDate: today,
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
        this.state.onSaveNewProposal(newUser);
      }
    };
    const dropDownStyle =
      "border-[1px] border-borderc rounded-lg px-3 py-1 focus:drop-shadow-[0_0px_3px_#0582F5] focus:border-tenPer outline-0";

    return (
      <div className="">
        <button
          onClick={() => this.setState({ childState: true, proposal: 0 })}
          type="submit"
          className="w-fit rounded-md p-2 text-sixtyPer bg-tenPer"
        >
          Add new Proposal
        </button>
        <Popup
          open={this.state.childState}
          onClose={() => this.setState({ childState: false })}
          modal
        >
          <div className="mt-10">
            <div className="w-fit bg-thirtyPer container mx-auto rounded-lg drop-shadow-[0_0px_5px_rgba(0,0,0,.25)]">
              <form onSubmit={handleAdd}>
                <div className="py-2 px-9 flex flex-row justify-between">
                  <h1 className="text-2xl font-bold text-heading">
                    {!this.state.proposal ? (
                      "Initialize Training"
                    ) : (
                      <div>
                        {this.state.proposal.topic}
                        <div className="text-lg">
                          Requested at {this.state.proposal.requestDate}
                        </div>
                      </div>
                    )}
                  </h1>
                  <div className="flex gap-5">
                    {!this.state.proposal && (
                      <button className="rounded-md px-5 text-sixtyPer text-xl bg-tenPer">
                        Save
                      </button>
                    )}
                  </div>
                </div>
                <div className="p-5 py-12 bg-sixtyPer rounded-b-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 place-items-center gap-y-6 text-[15px]">
                    <div className="flex flex-col gap-2 w-3/4">
                      <label className="text-text">Department</label>
                      <select
                        className={dropDownStyle}
                        disabled={this.state.proposal}
                      >
                        <option value={this.state.department.name}>
                          {this.state.department.name}
                        </option>
                      </select>
                    </div>
                    {/* <div className="flex flex-col gap-2 w-3/4">
                      <label className="text-text">Venue</label>
                      <select className={dropDownStyle}>
                        <option defaultValue={`Tirunesh Tr. Center`}>
                          Tirunesh Tr. Center
                        </option>
                      </select>
                    </div> */}
                    {!this.state.proposal && (
                      <div className="flex flex-col gap-2 w-3/4">
                        <label className="text-text">Topic</label>
                        <input
                          type="text"
                          defaultValue={this.state.proposal.topic}
                          className={dropDownStyle}
                          required={true}
                          disabled={this.state.proposal}
                        />
                      </div>
                    )}
                    <div className="w-3/4 flex flex-row justify-between">
                      <div className="flex flex-col gap-2 w-2/5">
                        <label className="text-text">Start Date</label>
                        <input
                          type="date"
                          className={dropDownStyle}
                          required={true}
                          disabled={this.state.proposal}
                          defaultValue={this.state.proposal.startDate?.toString()}
                        />
                      </div>
                      <div className="flex flex-col gap-2 w-2/5">
                        <label className="text-text">End Date</label>
                        <input
                          type="date"
                          className={dropDownStyle}
                          required={true}
                          disabled={this.state.proposal}
                          defaultValue={this.state.proposal.endDate?.toString()}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 w-3/4">
                      <label className="text-text">Profession Requested</label>
                      <input
                        type="text"
                        defaultValue={this.state.proposal.targetProfession}
                        required={true}
                        disabled={this.state.proposal}
                        className={dropDownStyle}
                      />
                    </div>
                    <div className="w-3/4 flex flex-row justify-between">
                      <div className="flex flex-col gap-2 w-2/5">
                        <label className="text-text">No of Facilitator</label>
                        <input
                          type="number"
                          placeholder="1"
                          min={1}
                          disabled={this.state.proposal}
                          required={true}
                          className={dropDownStyle}
                          defaultValue={this.state.proposal.numberOfFacilitator}
                        />
                      </div>
                      <div className="flex flex-col gap-2 w-2/5">
                        <label className="text-text">No of Trainees</label>
                        <input
                          type="number"
                          placeholder="1"
                          min={1}
                          required={true}
                          disabled={this.state.proposal}
                          className={dropDownStyle}
                          defaultValue={this.state.proposal.numberOfTrainee}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 w-3/4">
                      <label className="text-text">Allocated Budget</label>
                      <input
                        type="text"
                        className={dropDownStyle}
                        disabled={this.state.proposal}
                        required={true}
                        defaultValue={this.state.proposal.budget}
                      />
                    </div>
                    <div className="w-3/4 flex flex-row justify-between">
                      <div className="flex flex-col gap-2 w-2/5">
                        <label className="text-text">No of Trainers</label>
                        <input
                          type="number"
                          placeholder="1"
                          min={1}
                          required={true}
                          disabled={this.state.proposal}
                          className={dropDownStyle}
                          defaultValue={this.state.proposal.numberOfTrainer}
                        />
                      </div>
                    </div>
                  </div>
                    {this.state.proposal? extraInfo():""}
                </div>
              </form>
            </div>
          </div>
        </Popup>
      </div>
    );
  }
}

export default AddPoposalPopUp;
