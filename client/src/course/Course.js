import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import CourseTable from "./CourseTable";
import CourseDetails from "./CourseDetail";
import Attendance from "./attendance/Attendance";
import { Route, Routes, Link } from "react-router-dom";
import CourseTab from "./CourseTab";
import CourseSummary from "./TraineeSummary";

function Courses(user) {
  const cookies = Cookies.get("accessToken");
  const [allCourse, setallCourse] = useState();
  const [courseDetails, setcourseDetails] = useState();
  const [flagClick, setflagClick] = useState(false);
  const [atte, setatte] = useState("c");
  // useEffect(() => {
  //   fetch("/fetchAllCourse", {
  //     headers: {
  //       Authorization: `Bearer ${cookies}`,
  //     },
  //   })
  //     .then((resp) => resp.json())
  //     .then((data) => {
  //       console.log("this are the courses  ", data);
  //       setallCourse(data);
  //     });
  // }, []);

  const clickedCourseHandler = (event) => {
    console.log("clicked", event);
    setflagClick(true);
    setcourseDetails(event);
  };
  return (
    <div className="w-full text-sm">
      <CourseTab theU={user.theU} />
    </div>
  );
}

export default Courses;
