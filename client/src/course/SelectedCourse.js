import { useState, useEffect, useRef } from "react";
import TraineesTable from "./Trainees";
import TrainersTable from "./Trainers";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import FacilitatorPopUp from "./facilitator/Facilitator";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import TraineeSummary from "./ttCourse/summary/Summary";
import axios from "axios";

function SelectedCourse(user) {
  const cookies = Cookies.get("accessToken");
  const params = useParams();
  const [enrolledTrainees, setEnrolledTrainees] = useState(0);
  const [course, setCourse] = useState();
  const [trainers, setTrainers] = useState(0);
  const [facilitators, setFacilitators] = useState(0);
  const [days, setDays] = useState(0);
  const [daysLeft, setDaysLeft] = useState(0);
  const [isFacil, setisFacil] = useState(false);
  const [selectedUi, setSelectedUi] = useState(0);
  const [refreshed, setrefreshed] = useState(false);

  console.log("got it", isFacil);
  useEffect(() => {
    fetchOneCourse();
  }, [refreshed]);

  const fetchOneCourse = () => {
    fetch(`/fetchOneCourse/${params.id}`, {
      headers: {
        Authorization: `Bearer ${cookies}`,
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        setCourse(data);
        setrefreshed(true);
        console.log("this is the course for coursedetails ", data);
        setFacilitators(data?.Facilitators?.length);
        for (let i = 0; i < data?.Facilitators?.length; i++) {
          if (data?.Facilitators[i].UserId == user.theU.user.id) {
            setisFacil(true);
            break;
          }
        }
        calculateDaysLeft(
          new Date().toDateString(),
          data?.Proposal.startDate,
          data?.Proposal.endDate
        );
      });
  };

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
  const requestHandler=()=>{
    axios.put(`/requestconductor/${params.id}`,{},{
      headers: {
        Authorization: `Bearer ${cookies}`,
      },
    }).then((resp)=>{

    })
  }
  return (
    <div className="text-sm">
      {course != null && (
        <div className="flex flex-col gap-y-12 mt-4">
          <div className="grid grid-cols-2 gap-y-14 gap-x-5 overflow-hidden">
            <div className="flex flex-col">
              <span className="text-accepted">
                {course?.courseStatus
                  ? "On-Training"
                  : course?.courseStatus == null
                  ? "Not Started"
                  : "Finished"}
              </span>
              <h1 className="text-2xl font-bold">{course?.Proposal.topic}</h1>
              <span className="">
                <span className="pr-3">{course?.Proposal.startDate}</span>{" "}
                <span className="">{course?.Proposal.endDate}</span>
              </span>
            </div>
            <div className=" justify-self-end">
              <span className="font-bold">Today</span>{" "}
              {`${new Date().toDateString()}`}
            </div>
            <div className="overflow-hidden">
              <TraineesTable
                cId={course?.id}
                userId={isFacil}
                isActive={course?.courseStatus}
                setUi={setSelectedUi}
                setEnrolledT={setEnrolledTrainees}
              />
            </div>
            <div className="">
              <div className="flex flex-col gap-y-5">
                <TrainersTable
                  cId={course?.id}
                  userId={isFacil}
                  isActive={course?.courseStatus}
                  setTrainers={setTrainers}
                  setUi={setSelectedUi}
                />
                <FacilitatorPopUp
                  cId={course?.id}
                  isDirector={
                    user.theU.user.userType.toLowerCase() == "director" &&
                    (course?.Proposal.CPDId?user.theU.user.cpdId==course?.Proposal.CPDId:true)
                  }
                  isActive={course?.courseStatus}
                  noFacilitators={setFacilitators}
                />
                {/* {!user.theU.user.CPDId&&!course?.Proposal.CPDId && (
                  <button
                    onClick={requestHandler}
                    className="mt-2 place-self-start text-md border-2 border-tenPer text-tenPer py-2 px-6 rounded-md"
                  >
                    Request for Conductor
                  </button>
                )} */}
              </div>
            </div>
          </div>
          <hr />
          <div className="grid grid-cols-3 w-full gap-y-4 w-fit">
            <div className="grid grid-cols-2 gap-x-4 gap-y-4 w-fit">
              <span className="font-bold">Expected Trainees</span>
              <span className="">{course?.Proposal.numberOfTrainee}</span>
              <span className="font-bold">Trainers</span>
              <span className="">{trainers}</span>
              <span className="font-bold">Facilitor</span>
              <span className="">{facilitators}</span>
              <span className="font-bold">Venue</span>
              <span className="">{course?.Proposal.CPD?.name}</span>
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
      )}
    </div>
  );
}

export default SelectedCourse;
