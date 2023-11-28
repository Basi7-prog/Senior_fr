import { useState, useEffect, useRef } from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import CourseSummary from "./TraineeSummary";
import Attendance from "./attendance/Attendance";
import Grade from "./grade/Grade";
import SelectedCourse from "./SelectedCourse";
import Settings from "../courseSettings/Settings";
import TraineeSummary from "./TraineeSummary";
import Certification from "./certification/Certifcation";

function CourseDetails(course) {
  const [isFacil, setIsFacil] = useState(false);
  const navigate = useNavigate();
  console.log("the course detail is", course);
  useEffect(() => {
    // console.log("i have the user",course.courseD.Course.Facilitators[0])
    course.courseD.Course.Facilitators.forEach((element) => {
      if (element.UserId == course.theU.user.id) {
        console.log("i have the user", element, course.theU.user.id);
        return setIsFacil(true);
      }
    });

    navigate(`coursedetails/${course.courseD.Course?.id}`);
  }, []);
  console.log("i have the user from here", isFacil);
  return (
    <div className="w-full text-sm">
      <span
        className="text-tenPer cursor-pointer"
        onClick={() => course.setTheFlag(false)}
      >
        {`<`} back
      </span>
      <div className="flex gap-x-3 place-content-center first:pt-0 last:pb-0 mb-16">
        <Link
          to={`coursedetails/${course.courseD.Course?.id}`}
          className="focus:font-semibold focus:underline focus:underline-offset-8"
        >
          Course Details
        </Link>
        {course.courseD.Course?.courseStatus && (
          <Link
            to="attendance"
            className="focus:font-semibold focus:underline focus:underline-offset-8"
          >
            Attendance
          </Link>
        )}
        {course.courseD.Course?.courseStatus && (
          <Link
            to={`${course.courseD.Course?.id}/grade`}
            className={
              "focus:font-semibold focus:underline focus:underline-offset-8"
            }
          >
            Grades
          </Link>
        )}
        {isFacil && course.courseD.Course?.courseStatus && (
          <Link
            to={`${course.courseD.Course?.id}/settings`}
            className={
              "focus:font-semibold focus:underline focus:underline-offset-8"
            }
          >
            Settings
          </Link>
        )}
        {!course.courseD.Course?.courseStatus && (
          <Link
            to={`${course.courseD.Course?.id}/summary`}
            className={
              "focus:font-semibold focus:underline focus:underline-offset-8"
            }
          >
            Summary
          </Link>
        )}
        {!course.courseD.Course?.courseStatus && (course.theU.user.userType.toLowerCase()=='director')&& (
          <Link
            to={`${course.courseD.Course?.id}/certifcation`}
            className={
              "focus:font-semibold focus:underline focus:underline-offset-8"
            }
          >
            Certifcation
          </Link>
        )}
      </div>
      {/* <SelectedCourse theU={course.theU} /> */}
      <Routes>
        <Route
          path="/coursedetails/:id/*"
          element={<SelectedCourse theU={course.theU} />}
        />
        {course.courseD.Course?.courseStatus && (
          <Route
            path="/attendance"
            element={
              <Attendance
                theU={course.theU}
                course={course.courseD.Course.id}
              />
            }
          />
        )}
        {course.courseD.Course?.courseStatus && (
          <Route
            path=":id/grade"
            element={
              <Grade theU={course.theU} courseT={course.courseD.topic} />
            }
          />
        )}
        {isFacil && course.courseD.Course?.courseStatus && (
          <Route
            path=":id/settings"
            element={<Settings theU={course.theU} courseT={course.courseD} />}
          />
        )}
        {!course.courseD.Course?.courseStatus && (
          <Route
            path=":id/summary"
            element={<TraineeSummary theU={course.theU} courseT={course.courseD} />}
          />
        )}
        {!course.courseD.Course?.courseStatus && (course.theU.user.userType.toLowerCase()=='director')&& (
          <Route
            path=":id/certifcation"
            element={<Certification theU={course.theU} courseT={course.courseD} />}
          />
        )}
      </Routes>
    </div>
  );
}

export default CourseDetails;
