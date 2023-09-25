import {
  BrowserRouter as Router,
  Route,Routes,
  useParams,
  Link,
} from "react-router-dom";
import { Switch } from "react-router";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import ItDash from "./ItDashboard";

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
          ? setisAutherized(data.user)
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
      {isAutherized != null ? `welcome ${isAutherized.userName}` : ""}
      {isAutherized != null ? (
        <div className="flex flex-row">
          <div className="w-60">
            <div className="fixed flex flex-col justify-center text-center gap-12 text-xl p-12 mt-14">
              <div className="cursor-pointer" onClick={()=>setclicked(1)}>Proposal</div>
              <div className="cursor-pointer" onClick={()=>setclicked(2)}>User</div>
              {/* <Link to={`it/users`}>users</Link> */}

            </div>
          </div>
          {clicked==1&&"proposal"}{clicked==2&&<ItDash data={isAutherized} />}
          
        </div>
      ) : (
        "fuck outta here"
      )}
    </div>
  );
}

export default It;
