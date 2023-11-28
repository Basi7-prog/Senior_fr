import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import TRate from "./TrainerRate";
import CourseRate from "./CourseRate";

function TraineeInfo(user) {
  const cookies = Cookies.get("accessToken");
  const [trainee, setTrainee] = useState(null);
  const [courseNo, setCourseNo] = useState(null);
  useEffect(() => {
    axios
      .get(`/gettraineeinfo/${user.theU.theU.user.id}`, {
        headers: {
          Authorization: `Bearer ${cookies}`,
        },
      })
      .then((resp) => {
        setTrainee(resp.data);
        console.log(resp.data);
      });
  }, []);
  return (
    <div className="">
      {trainee && (
        <div className="">
          {trainee.length > 0 && (
            <div className="bg-tenPer p-2 rounded-sm w-full">
              <h1 className="text-white text-lg">
                Courses taken {trainee.length}
              </h1>
            </div>
          )}
          <div className={"grid grid-cols-2 mt-2 gap-3 w-fit"}>
            {trainee?.map((tData) => (
              <div className="bg-black rounded-lg h-fit">
                <div className="flex text-sixtyPer px-7 py-2">
                  <span className="text-lg font-bold">
                    {tData.Course.Proposal.topic}
                  </span>
                  {tData.Course.courseStatus && (
                    <div className="w-2 h-2 bg-accepted rounded-full"></div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm bg-white py-3 px-2 border-2 rounded-b-md">
                  <div className="flex gap-x-2">
                    <label className="">Pre-Test</label>
                    <label className="text-accepted">
                      {tData.preTest == null
                        ? "--"
                        : tData.preTest
                        ? "Passed"
                        : "Failed"}
                    </label>
                  </div>
                  <div className="flex gap-x-2">
                    <label className="">Post-Test</label>
                    <label className="">
                      {tData.postTest == null
                        ? "--"
                        : tData.postTest
                        ? "Passed"
                        : "Failed"}
                    </label>
                  </div>
                  {tData.Course.allowRating &&tData.Course.courseStatus&&
                  (!tData.trainerRate || !tData.courseRate) ? (
                    <div className="">
                      <button
                        className="border-2 border-tenPer rounded-md text-tenPer text-sm px-2"
                        onClick={() => {
                          setCourseNo({cId:tData.Course.id,topic:tData.Course.Proposal.topic});
                        }}
                      >
                        Open for rating
                      </button>
                    </div>
                  ) : null}
                  <div className="text-gray-300">
                    {/* <label className="">Post-Test</label> */}
                    <label className="">
                      {tData.certified == null
                        ? "---"
                        : tData.certified
                        ? "Certified"
                        : "Not Certified"}
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="">
        {courseNo && (
          <>
            <TRate theU={user} theC={courseNo} />
            <CourseRate theU={user} theC={courseNo} />
          </>
        )}
      </div>
    </div>
  );
}

export default TraineeInfo;
