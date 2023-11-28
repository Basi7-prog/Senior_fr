import { useState, useEffect, useRef } from "react";
import "react-circular-progressbar/dist/styles.css";
import { Link, Route, Routes, useParams } from "react-router-dom";
import Cookies from "js-cookie";

function TtCourse(user) {
  const params = useParams();
//   const [user, setUser] = useState(null);
  const [cpdName, setCpdName] = useState();
  const cookies = Cookies.get("accessToken");

  useEffect(() => {
    // fetch("/getUser/" + params.id, {
    //   headers: {
    //     Authorization: `Bearer ${cookies}`,
    //   },
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log("it is in the menu ", data);
    //     setUser(data);
    //     // setCpdName(data.cpd.name.toLowerCase());
    //   });
  }, []);
  return (
    <div className="">
      <div className="flex">
        the trainee and trainers {user.theU.user.firstName}
      </div>
    </div>
  );
}

export default TtCourse;
