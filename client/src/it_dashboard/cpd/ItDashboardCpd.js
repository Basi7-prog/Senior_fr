import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import UTable from "./UserTableCpd";
import AdPopup from "./AddEditPopupCpd";
import Axios from "axios";
import AddOrganizers from "./AddOrganizers";

function DIt(data) {
  const dropDownStyle =
    "border-[1px] border-borderc rounded-lg px-3 py-1 focus:drop-shadow-[0_0px_3px_#0582F5] focus:border-tenPer outline-0";
  const cookies = Cookies.get("accessToken");
  const [allUsers, setallUsers] = useState([{}]);
  const [allUsersF, setallUsersF] = useState([{}]);
  const [editClicked, seteditClicked] = useState("");
  const [cpdCount, setCpdCount] = useState(0);
  // const [popupDisplay, setpopupDisplay] = useState(false);
  const childRef = useRef({});
  const childOrg = useRef({});

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
            users: prevData.users.map((sUser) =>
              sUser.userName === newSaved.oldUserName
                ? { ...(sUser = res2) }
                : sUser
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
        user: allUsersF.users.find((user) => user.id == id),
      });
    }
    // console.log("edit:",id)
  };

  const getCpds = () => {
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
          isDirector:data.theU.user.userType != ""
        });
        setCpdCount(users.allDeps?.length);
        // setallDepartments(users.allDepartments);
      });
  };
  useEffect(() => {
    setallUsersF(allUsers);
    console.log("th refined ", allUsers);
  }, [allUsers]);

  useEffect(() => {
    getCpds();
    childOrg.current.setState({getOrg:getCpds})
  }, []);
  const divCard =
    "w-fit flex px-10 py-3 rounded-lg gap-y-2 flex-col border-2 text-text border-tenPer";
  const buttonS = "rounded-md text-md w-fit px-4 text-sixtyPer bg-tenPer";

  return (
    <div className="w-full overflow-hidden text-md text-[14px]">
      <div className="container mx-auto flex flex-col items-center p-2 overflow-hidden">
        <div className="mb-16 text-lg flex gap-x-7">
          <div className={` ${divCard}`}>
            <div className="flex gap-x-4">
              <span className=" font-semibold">Organizers</span>
              <span className="">{cpdCount}</span>
            </div>{data.theU.user.userType != "" &&
            <button
              onClick={() => childOrg.current.setState({ childState: true })}
              className={`${buttonS}`}
            >
              +
            </button>}
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
          <AddOrganizers ref={childOrg} />
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
