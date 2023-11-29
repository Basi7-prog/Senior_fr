import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

function TrainerInfo(user) {
  const cookies = Cookies.get("accessToken");
  const [trainer, setTrainer] = useState(null);
  useEffect(() => {
    axios
      .get(`/gettrainerinfo/${user.theU.theU.user.id}`, {
        headers: {
          Authorization: `Bearer ${cookies}`,
        },
      })
      .then((resp) => {
        setTrainer(resp.data);
        console.log(resp.data);
      });
  }, []);
  return (
    <div className="">
      {trainer && (
        <div className="">
          {trainer.length > 0 && (
            <div className="bg-tenPer p-2 rounded-md w-full">
              <h1 className="text-white text-lg">
                Courses you have Trained {trainer.length}
              </h1>
            </div>
          )}
          <div className={"grid grid-cols-2 gap-3 mt-2 w-fit"}>
            {trainer?.map((tData) => (
              <div className="bg-black rounded-lg">
                <div className="flex text-sixtyPer px-7 py-2">
                  <span className="text-lg font-bold">
                    {tData.Course.Proposal.topic}
                  </span>
                  {tData.Course.courseStatus && (
                    <div className="w-2 h-2 bg-accepted rounded-full"></div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm bg-white pt-3 px-2">
                  <div className="flex gap-x-2 border-r-2">
                    <label className="">Assigned by</label>
                    <label className="text-accepted">{tData.assignedBy}</label>
                  </div>
                  <div className="flex gap-x-2">
                    <label className="">Ratings</label>
                    <label className="">{tData.rating}%</label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default TrainerInfo;
