import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Menus from "../sideBarMenus/Menus";

function Logistics() {
  const params = useParams();
  const [isAutherized, setisAutherized] = useState(null);
  const [clicked, setclicked] = useState(2);
  const cookies = Cookies.get("accessToken");

  useEffect(() => {
    fetch("/getUser/" + params.id, {
      headers: {
        Authorization: `Bearer ${cookies}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("in it ", data);

        data.department.name.toLowerCase() == "logistics"
          ? setisAutherized(data)
          : setisAutherized(null);
        console.log(data.department.name);
      });
  }, []);

  return (
    <div className="">
      {isAutherized != null ? `welcome ${isAutherized.user.userName}` : ""}
      {isAutherized != null ? (
        <div className="">
          <Menus user={isAutherized}/>
        </div>
      ) : (
        "fuck outta here"
      )}
    </div>
  );
}

export default Logistics;
