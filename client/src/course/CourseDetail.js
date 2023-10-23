import { useState, useEffect, useRef } from "react";
import TraineesTable from "./Trainees";
import TrainersTable from "./Trainers";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import FacilitatorPopUp from "./facilitator/Facilitator";

function CourseDetails(course) {
  console.log("the course detail is", course);
  const [enrolledTrainees, setEnrolledTrainees] = useState(0);
  const [trainers, setTrainers] = useState(0);
  const [facilitators, setFacilitators] = useState(0);
  const [days, setDays] = useState(0);
  const [daysLeft, setDaysLeft] = useState(0);
  const [isFacil, setisFacil] = useState(false);

  console.log("got it",isFacil)

  useEffect(() => {
    setFacilitators(course.courseD.Course?.Facilitators?.length)
    calculateDaysLeft(
      new Date().toDateString(),
      course.courseD.startDate,
      course.courseD.endDate
    );
  for (let i = 0; i < course.courseD.Course?.Facilitators?.length; i++) {
    if (course.courseD.Course?.Facilitators[i].UserId == course.theU.user.id) {
        setisFacil( true);
        break;
      }
    
  }
  }, []);

  function calculateDaysLeft(currnentDate, startDate, endDate) {
    const current = new Date(currnentDate);
    const start = new Date(startDate);
    const end = new Date(endDate);
    const differenceInMs = end - current;
    if (differenceInMs > 0) {
      if (start <= current) {
        // Calculate the difference in milliseconds
        const differenceInMs = end - current;
        const differenceInMs2 = current - start;
        const differenceInMsAll = end - start;

        // Convert milliseconds to days
        const daysLeft = Math.ceil(differenceInMs / (1000 * 60 * 60 * 24));
        const daysStarted = Math.ceil(differenceInMs2 / (1000 * 60 * 60 * 24));
        const allDays =
          Math.ceil(differenceInMsAll / (1000 * 60 * 60 * 24)) + 1;
        setDays(Math.floor((daysStarted / allDays) * 100));
        setDaysLeft(`${daysLeft} day`);
        //return Math.floor(((daysStarted)/allDays)*100);
      } else if (start > current) {
        setDaysLeft(`Not started`);
        setDays(0);
        // return 0;
      }
    } else {
      setDaysLeft(`Done`);
      setDays(100);
      //return 100;
    }
  }

  return (
    <div className="text-sm">
      <span
        className="text-tenPer cursor-pointer"
        onClick={() => course.setTheFlag(false)}
      >
        {`<`} back
      </span>
      <div className="flex flex-col gap-y-12 mt-4">
        <div className="grid grid-cols-2 gap-y-14 gap-x-5 overflow-hidden">
          <div className="flex flex-col">
            <span className="text-accepted">
              {course.courseD.Course?.courseStatus
                ? "On-Training"
                : course.courseD.Course?.courseStatus == null
                ? "Not Started"
                : "Finished"}
            </span>
            <h1 className="text-2xl font-bold">{course.courseD.topic}</h1>
            <span className="">
              <span className="pr-3">{course.courseD.startDate}</span>{" "}
              <span className="">{course.courseD.endDate}</span>
            </span>
          </div>
          <div className=" justify-self-end">
            <span className="font-bold">Today</span>{" "}
            {`${new Date().toDateString()}`}
          </div>
          <div className="overflow-hidden">
            <TraineesTable
              cId={course.courseD.Course?.id}
              userId={isFacil}
              isActive={course.courseD.Course?.courseStatus}
              setEnrolledT={setEnrolledTrainees}
            />
          </div>
          <div className="">
            <div className="flex flex-col gap-y-5">
              <TrainersTable
                cId={course.courseD.Course?.id}
                userId={isFacil}
                isActive={course.courseD.Course?.courseStatus}
                setTrainers={setTrainers}
              />
              <FacilitatorPopUp
                cId={course.courseD.Course?.id}
                isDirector={
                  course.theU.user.userType.toLowerCase() == "director"
                }
                isActive={course.courseD.Course?.courseStatus}
                noFacilitators={setFacilitators}
              />
            </div>
          </div>
        </div>
        <hr />
        <div className="grid grid-cols-3 w-full gap-y-4 w-fit">
          <div className="grid grid-cols-2 gap-x-4 gap-y-4 w-fit">
            <span className="font-bold">Expected Trainees</span>
            <span className="">{course.courseD.numberOfTrainee}</span>
            <span className="font-bold">Trainers</span>
            <span className="">{trainers}</span>
            <span className="font-bold">Facilitor</span>
            <span className="">{facilitators}</span>
            <span className="font-bold">Venue</span>
            <span className="">{course.courseD.CPD.name}</span>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-4 w-fit">
            <span className="font-bold">Enrolled Trainees</span>
            <span className="">{enrolledTrainees}</span>
          </div>
          <div className="w-48 font-bold justify-center">
            <CircularProgressbar
              value={days}
              text={`${daysLeft}`}
              styles={buildStyles({
                pathColor: `#0FA958`,
                textColor: "",
                trailColor: "#d6d6d6",
                backgroundColor: "#0FA958",
              })}
            />
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetails;
