import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import CourseTable from "./CourseTable";
import CourseDetails from "./CourseDetail";

function Courses() {
  const cookies = Cookies.get("accessToken");
  const [allCourse, setallCourse] = useState();
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
  return (
    <div className="w-full">
      {(typeof allCourse==='undefined')?"Loading...":<CourseDetails courseD={allCourse[0]} />}
      {/* <CourseTable courseTable={allCourse} /> */}
    </div>
  );
}

export default Courses;
