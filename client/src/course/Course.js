import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import CourseTable from "./CourseTable";
import CourseDetails from "./CourseDetail";

function Courses(user) {
  const cookies = Cookies.get("accessToken");
  const [allCourse, setallCourse] = useState();
  const [courseDetails, setcourseDetails] = useState();
  const [flagClick, setflagClick] = useState(false);
  useEffect(() => {
    fetch("/fetchAllCourse", {
      headers: {
        Authorization: `Bearer ${cookies}`,
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log("this are the courses  ", data);
        setallCourse(data);
      });
  }, []);
  
  const clickedCourseHandler = (event) => {
    console.log("clicked", event);
    setflagClick(true);
    setcourseDetails(event);
  };
  return (
    <div className="w-full text-sm ">
       {!flagClick ? (
        <CourseTable
          courseTable={allCourse}
          clickHandler={clickedCourseHandler}
        />
      ) : typeof allCourse === "undefined" ? (
        "Loading..."
      ) : courseDetails ? (
        <CourseDetails courseD={allCourse[courseDetails]} setTheFlag={setflagClick} theU={user.theU}/>
      ) : (
        ""
      )}

    </div>
  );
}

export default Courses;
