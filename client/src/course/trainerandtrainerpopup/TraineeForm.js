import React from "react";
import Popup from "reactjs-popup";
import Select from "react-select";
import Cookies from "js-cookie";
import axios from "axios";

class TraineeForm extends React.Component {
  state = {
    childState: false,
    user: "",
    allUser: [],
    isLoading: false,
    options: [],
    inputValue: "",
  };
  render() {
    const cookies = Cookies.get("accessToken");
    const dropDownStyle =
      "border-[1px] border-borderc rounded-lg px-3 py-1 focus:drop-shadow-[0_0px_3px_#0582F5] focus:border-tenPer outline-0";

    // Function to handle input change
    const handleInputChange = (value) => {
      this.setState({ inputValue: value });
      fetchData(value);
    };
    const registerHandler = async (e) => {
      e.preventDefault();
      try {
        let uId=null;
        let userData={};
        if(this.state.user==""){          
          userData=assignFromForm(e);
          console.log("trainee",userData);
        }
        else{
          uId=this.state.user.id;
          console.log("trainee id",uId);
        }
        const response = await axios
          .post(
            `/registertrainee?uid=${uId}&courseid=${this.state.courseId}`,userData,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${cookies}`,
              },
            }
          )
          .then((resp) => {
            console.log("the resgister trainee", resp);
            this.setState({ childState: false });
            this.state.addAction();
          });
      } catch (err) {console.log("the error",err)}
    };
    // Function to fetch data from the backend
    const fetchData = async (value) => {
      this.setState({ IsLoading: true });
      try {
        const response = await axios
          .get(`/searchuser?query=${this.state.inputValue}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${cookies}`,
            },
          })
          .then((getval) => {
            console.log(
              "searched name",
              getval,
              "course id:",
              this.state.courseId
            );
            const getNames = [];
            this.setState({ allUser: getval.data });
            getval.data.forEach((val) => {
              getNames.push({
                label: `${val.firstName} ${val.middleName} ${val.lastName}`,
                value: `${val.firstName} ${val.middleName} ${val.lastName}`,
                id: val.id,
              });
            });
            this.setState({ options: getNames });
            console.log("searched name 2", this.state.options);
          });
      } catch (error) {
        console.error(error);
      }
      this.setState({ IsLoading: false });
    };

    const assignFromForm = (e) => {
      this.setState({ childState: false });
      return {
        firstName: e.target[3].value,
        middleName: e.target[4].value,
        lastName: e.target[5].value,
        gender: e.target[8].value,
        email: e.target[9].value,
        phone: e.target[11].value,
        profession: e.target[10].value,
        Dob: e.target[6].value,
        userName: e.target[7].value,
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
    const submitHandle = (e) => {
      console.log("selected vva", e);
      if (e != null) {
        this.setState({
          user: this.state.allUser.find((use) => use.id == e.id),
        });
      } else {
        this.setState({ user: "" });
      }
      this.setState({ options: [] });
    };

    return (
      <Popup
        open={this.state.childState}
        onClose={() => this.setState({ childState: false, user: "" })}
        modal
      >
        <div className="w-fit bg-thirtyPer container mx-auto rounded-lg drop-shadow-[0_0px_5px_rgba(0,0,0,.25)]">
          {/* <h1 className="text-center text-2xl font-bold mb-8">
          {this.state.user ? "Edit" : "Add"} Staff
        </h1> */}
          <form onSubmit={this.state.user ? registerHandler : registerHandler}>
            <div className="py-2 px-9 flex flex-row justify-between">
              <h1 className="text-2xl font-bold text-heading">
                Select Trainee
              </h1>
              <div className="flex gap-5">
                <button
                  className="rounded-md px-3 text-sixtyPer text-md bg-tenPer"
                  type="submit"
                >
                  Change and Register
                </button>
                <button
                  className="rounded-md px-3 text-sixtyPer text-md bg-tenPer"
                  type="submit"
                >
                  Register
                </button>
              </div>
            </div>
            <div className=" bg-sixtyPer">
              <Select
                className={`${dropDownStyle} w-1/2`}
                inputValue={this.state.inputValue}
                onInputChange={handleInputChange}
                options={this.state.options}
                isLoading={this.state.isLoading}
                onChange={submitHandle}
                isClearable
              />
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
                <select
                  className={dropDownStyle}
                  name="gender"
                  id="gender"
                  defaultValue={this.state.user.gender}
                >
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
    );
  }
}

export default TraineeForm;
