import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import UTable from "./UserTable";
import AdPopup from "./AddEditPopup";
import Axios from "axios";
import AddDepartment from "./AddDepartment";
import axios from "axios";

function DIt(data) {
  const dropDownStyle =
    "border-[1px] border-borderc rounded-lg px-3 py-1 focus:drop-shadow-[0_0px_3px_#0582F5] focus:border-tenPer outline-0";
  const cookies = Cookies.get("accessToken");
  const [allUsers, setallUsers] = useState([{}]);
  const [allUsersF, setallUsersF] = useState([{}]);
  const [editClicked, seteditClicked] = useState("");
  const [userCount, setUserCount] = useState(0);
  const [depCount, setDepCount] = useState(0);
  // const [popupDisplay, setpopupDisplay] = useState(false);
  const childRef = useRef({});
  const childDep = useRef({});

  const submitHandler = (event) => {
    event.preventDefault();
    console.log("forms ", event.target[1].value);
    let filteredDep=[]
    if (event.target[1].value>0) {
      filteredDep = allUsers.users.filter(
        (deps) => deps.departmentId == event.target[1].value
      );
      console.log("soooo",filteredDep)
      setallUsersF({ users: filteredDep, departments: allUsers.departments });
    }else {
      filteredDep=allUsers.users
      setallUsersF(allUsers);
    }
    if (event.target[0].value) {
      const filteredUser = filteredDep.filter((userfound) =>
        `${userfound.firstName} ${userfound.middleName} ${userfound.lastName}`
          .toLowerCase()
          .includes(event.target[0].value.toLowerCase())
      );
      setallUsersF({
        users: filteredUser,
        departments: allUsers.departments,
      });
    }
  };
  const onSaveNew = async (newSaved) => {
    console.log("add submit", newSaved);
    try {
      const response = await fetch("/addstaff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies}`,
        },
        body: JSON.stringify(newSaved),
      })
        .then((res) => res.json())
        .then((res2) => {
          setallUsers((prevData) => ({
            departments: [...prevData.departments],
            users: [...prevData.users, res2],
          }));
          console.log("post successfull");
        });
      if (response.ok) {
        // setallUsers((prevData)=>{return {...prevData,users:newAllUsers}})
        // setallUsersF(allUsers)
      } else {
        console.log("post not successfull");
      }
    } catch (err) {
      console.log(err);
    }
  };
  const onSaveEdit = async (newSaved) => {
    console.log("edit submit", newSaved.oldUserName);
    try {
      const response = await fetch("/editstaff/" + newSaved.oldUserName, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies}`,
        },
        body: JSON.stringify(newSaved),
      })
        .then((res) => res.json())
        .then((res2) => {
          setallUsers((prevData) => ({
            departments: [...prevData.departments],
            users: prevData.users.map((sUser) =>
              sUser.userName === newSaved.oldUserName
                ? { ...(sUser = res2) }
                : sUser
            ),
          }));
          console.log("edit successfull", res2);
        });
      if (response.ok) {
        // setallUsers((prevData)=>{return {...prevData,users:newAllUsers}})
        // setallUsersF(allUsers)
      } else {
        console.log("post not successfull");
      }
    } catch (err) {
      console.log(err);
    }
  };
  const editHandler = (id) => {
    seteditClicked("");
    // setpopupDisplay(true);
    if (childRef.current) {
      childRef.current.setState({
        childState: true,
        user: allUsersF.users.find((user) => user.id == id),
        departments: allUsersF.departments,
      });
    }
    // console.log("edit:",id)
  };
  const addDepartment = async () => {
    await axios
      .get("/getdepartment", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies}`,
        },
      })
      .then((resp) => {
        console.log("dep", resp);
        childRef.current.setState({ departments: resp.data });
        setallUsers((prevData) => ({
          users: [...prevData.users],
          departments: resp.data,
        }));
        setDepCount(resp.data?.length);
      });
  };
  useEffect(() => {
    setallUsersF(allUsers);
    setUserCount(allUsersF.users?.length);
    console.log("th refined ", allUsers);
  }, [allUsers]);

  useEffect(() => {
    fetch("/fetchAllUser_It", {
      headers: {
        Authorization: `Bearer ${cookies}`,
      },
    })
      .then((response) => response.json())
      .then((users) => {
        console.log("this in ", users);

        setallUsers({ users: users.users, departments: users.allDepartments });
        setallUsersF({ users: users.users, departments: users.allDepartments });
        childRef.current.setState({
          departments: users.allDepartments,
          onSaveNewAction: onSaveNew,
          onSaveEditAction: onSaveEdit,
        });
        childDep.current.setState({ setDeps: addDepartment });
        setDepCount(users.allDepartments?.length);
        // setallDepartments(users.allDepartments);
      });
  }, []);
  const divCard =
    "w-fit flex px-10 py-3 rounded-lg gap-y-2 flex-col border-2 text-text border-tenPer";
  const buttonS = "rounded-md text-md w-fit px-4 text-sixtyPer bg-tenPer";
  return (
    <div className="w-full overflow-hidden text-md text-[14px]">
      <div className="container mx-auto flex flex-col items-center p-2 overflow-hidden">
        <div className="mb-16 text-lg flex gap-x-7 place-content-center">
          <div className={` ${divCard}`}>
            <div className="flex gap-x-4">
              <span className=" font-semibold">Staff</span>
              <span className="">{userCount}</span>
            </div>
            {data.theU.user.userType != "" && (
              <button
                onClick={() =>
                  childRef.current.setState({ childState: true, user: 0 })
                }
                className={`${buttonS}`}
              >
                +
              </button>
            )}
          </div>
          <div className={`${divCard}`}>
            <div className="flex gap-x-4">
              <span className=" font-semibold">Departments</span>
              <span className="">{depCount}</span>
            </div>
            {data.theU.user.userType != "" && (
              <button
                onClick={() => childDep.current.setState({ childState: true })}
                className={`${buttonS}`}
              >
                +
              </button>
            )}
          </div>
        </div>
        <div className="">
          <form onSubmit={submitHandler} className="flex gap-3">
            <input
              type="text"
              value={null}
              placeholder="Name"
              className={dropDownStyle}
            />
            <select className={dropDownStyle}>
              <option value={"Any"}>Any</option>
              {allUsersF.departments?.map((dep, i) => (
                <option value={dep.id}>{dep.name}</option>
              ))}
            </select>
            {/* <select className={dropDownStyle}>
              <option value={"Any"}>Any</option>
              {allUsersF.users?.map((user, i) => (
                <option value={user.profession}>{user.profession}</option>
              ))}
            </select> */}
            <button
              type="submit"
              className="w-fit rounded-md p-2 text-sixtyPer bg-tenPer"
            >
              Search
            </button>
          </form>
          {<AdPopup ref={childRef} />}
          <AddDepartment ref={childDep} />
        </div>
        <div className="w-full">
          <div className="pt-4">
            <UTable usersForTable={allUsersF} onAction={editHandler} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DIt;
