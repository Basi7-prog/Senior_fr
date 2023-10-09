import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import UTable from "./UserTableCpd";
import AdPopup from "./AddEditPopupCpd";
import Axios from "axios";

function DIt(data) {
  const dropDownStyle =
    "border-[1px] border-borderc rounded-lg px-3 py-1 focus:drop-shadow-[0_0px_3px_#0582F5] focus:border-tenPer outline-0";
  const cookies = Cookies.get("accessToken");
  const [allUsers, setallUsers] = useState([{}]);
  const [allUsersF, setallUsersF] = useState([{}]);
  const [editClicked, seteditClicked] = useState("");
  // const [popupDisplay, setpopupDisplay] = useState(false);
  const childRef = useRef({});

  const submitHandler = (event) => {
    event.preventDefault();
    console.log("forms ", event.target[0].value);
    if (event.target[0].value) {
      const filteredUser = allUsers.users.filter((userfound) =>
        `${userfound.firstName} ${userfound.middleName} ${userfound.lastName}`
          .toLowerCase()
          .includes(event.target[0].value.toLowerCase())
      );
      setallUsersF({
        users: filteredUser,
        departments: allUsers.departments,
      });
    } else {
      setallUsersF(allUsers);
    }
  };
  const onSaveNew = async (newSaved) => {
    console.log("add cpd submit", newSaved);
    try {
      const response = await fetch("/addcpd", {
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
    console.log("edit cpd submit", newSaved);
    try {
      const response = await fetch("/editcpd/" + newSaved.oldUserName, {
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
            users: 
              prevData.users.map((sUser) =>
                sUser.userName === newSaved.oldUserName ? { ...sUser=res2 } : sUser
              ),
            
          }));
          console.log("edit cpd successfull", res2);
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
        user: allUsersF.users.find((user) => user.id == id)
      });
    }
    // console.log("edit:",id)
  };
  useEffect(() => {
    setallUsersF(allUsers);
    console.log("th refined ",allUsers)
  }, [allUsers]);

  useEffect(() => {
    fetch("/fetchAllUser_It_cpd", {
      headers: {
        Authorization: `Bearer ${cookies}`,
      },
    })
      .then((response) => response.json())
      .then((users) => {
        console.log("this cpd in ", users);

        setallUsers({ users: users.allUsers });
        setallUsersF({ users: users.allUsers });
        childRef.current.setState({
          departments: users.allDeps,
          onSaveNewAction: onSaveNew,
          onSaveEditAction: onSaveEdit,
        });
        // setallDepartments(users.allDepartments);
      });
  }, []);

  return (
    <div className="w-full overflow-hidden text-md text-[14px]">
      <div className="container mx-auto w-9/12 p-2 overflow-hidden">
        <div className="">
          <form onSubmit={submitHandler} className="grid grid-cols-4 gap-3">
            <input
              type="text"
              value={null}
              placeholder="Name"
              className={dropDownStyle}
            />
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
          <AdPopup ref={childRef} />
        </div>
        <div className="">
          <div className="pt-4">
            <UTable usersForTable={allUsersF} onAction={editHandler} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DIt;
