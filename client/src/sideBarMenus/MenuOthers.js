import { useState, useEffect, useRef } from "react";
import "react-circular-progressbar/dist/styles.css";
import { Link, Route, Routes, useParams } from "react-router-dom";
import Courses from "../course/Course";
import Cookies from "js-cookie";
import TtCourse from "../course/ttCourse/TtCourse";
import Profile from "../profile/Profile";

function MenuOthers() {
  const params = useParams();
  const [user, setUser] = useState(null);
  const [cpdName, setCpdName] = useState();
  const cookies = Cookies.get("accessToken");

  useEffect(() => {
    fetch("/getUser/" + params.id, {
      headers: {
        Authorization: `Bearer ${cookies}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("it is in the menu ", data);
        setUser(data);
        // setCpdName(data.cpd.name.toLowerCase());
      });
  }, []);
  return (
    <div className="w-full">
      <div className="flex">
        <div className="w-60 h-screen">
          <div className="group flex flex-col justify-center text-center gap-12 text-lg p-12">
            {user != null &&<Link className={""} to={`/${params.id}/menuothers/profile`}>
              Profile
            </Link>}
            {user != null &&<Link className={""} to={`/${params.id}/menuothers/course`}>
              Courses
            </Link>}
          </div>
        </div>
        <Routes>
          {user != null && (
            <Route path="/profile" element={<Profile theU={user} />} />
          )}
          {user != null && (
            <Route path="/course/*" element={<TtCourse theU={user} />} />
          )}
        </Routes>
      </div>
    </div>
  );
}

export default MenuOthers;
