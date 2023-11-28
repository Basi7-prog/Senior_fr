import axios from "axios";
import Cookies from "js-cookie";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function UpdateAccount(user) {
  //   const [username, setUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();   
  const cookies = Cookies.get("accessToken");

  //   const handleUsernameChange = (e) => {
  //     setUsername(e.target.value);
  //   };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleCurrentPasswordChange = (e) => {
    setCurrentPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(
      `/changepass?id=${user.isLogedIn.id}&password=${password}`,{},{
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies}`,
          },
      }
    ).then((res)=>{
        if(res.data){
            navigate(`/${user.isLogedIn.userName}/menu/profile`)
        }
    });
    // console.log("Username:", username);
    console.log("Current Password:", currentPassword);
    console.log("Password:", password);
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Account Update</h1>
      <form onSubmit={handleSubmit}>
        {/* <div className="mb-4">
          <label htmlFor="username" className="block mb-2 font-bold">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleUsernameChange}
            className="border border-gray-300 px-4 py-2 rounded-md w-full"
          />
        </div> */}
        {/* <div className="mb-4">
          <label htmlFor="currentPassword" className="block mb-2 font-bold">
            Current Password
          </label>
          <input
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={handleCurrentPasswordChange}
            className="border border-gray-300 px-4 py-2 rounded-md w-full"
          />
        </div> */}
        <div className="mb-4">
          <label htmlFor="password" className="block mb-2 font-bold">
            New Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            className="border border-gray-300 px-4 py-2 rounded-md w-full"
          />
        </div>
        <button
          type="submit"
          className="bg-tenPer hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Update Account
        </button>
      </form>
    </div>
  );
}

export default UpdateAccount;
