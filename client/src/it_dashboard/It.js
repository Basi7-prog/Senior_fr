import { useParams } from "react-router-dom";
import { Switch } from "react-router";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Menus from "../sideBarMenus/Menus";

function It() {
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

        data.department.name.toLowerCase() == "system administrator"
          ? setisAutherized(data)
          : setisAutherized(null);
        console.log(data.department.name);
      });
  }, []);
  return (
    <div>
      {/* <Routes>
      <Route
        path="/it/users/"
        component={<ItDash data={isAutherized} />}
      >
      </Route>
    </Routes> */}
      {isAutherized != null ? `welcome ${isAutherized.user.userName}` : ""}
      {isAutherized != null ? (
        <div className="">
          <Menus user={isAutherized}/>
        </div>
      ) : (
        "Loading..."
      )}
    </div>
  );
}

export default It;
