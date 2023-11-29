import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Certification(datas) {
  const cookies = Cookies.get("accessToken");
  const [trainees, setTrainees] = useState();
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState();
  const params = useParams();

//   const getFinishedTrainees=()=>{

//   }
  useEffect(() => {
    axios
      .get(`/getTrainees?courseId=${params.id}`, {
        headers: {
          Authorization: `Bearer ${cookies}`,
        },
      })
      .then((resp) => {
        if (resp.data.length > 0) {
          setTrainees(resp.data);
          setTopic(resp.data[0].Course.Proposal.topic)
        }
      });
  }, [loading]);

  const generateCertification=(tId)=>{
    setLoading(true);
    axios
    .get(`/generateCertification?cId=${params.id}&tId=${tId}`, {
      headers: {
        Authorization: `Bearer ${cookies}`,
      },
    })
    .then((resp) => {
      if (resp.data) {
        setLoading(false);
      }
    });
  }
  return (
    <div className="mx-auto w-fit">
        <h1 className="font-bold text-xl mb-7 bg-tenPer py-1 pl-2 rounded-md text-white">{topic}</h1>
      <div className="flex flex-col gap-3 pt-3">
        <div className="grid grid-cols-4 gap-3 font-semibold">
          <span className="">Names</span>
          <span className="">Pre-Test</span>
          <span className="">Post-Test</span>
          <span className="">Certification</span>
        </div>
        {trainees?.map((trainee, i) => (
          <div className="grid grid-cols-4 gap-3 border-t-2 pt-2">
            <span className="">
              {trainee.User.firstName} {trainee.User.middleName}{" "}
              {trainee.User.lastName}
            </span>
            <span className="">
              {trainee.preTest == null ? (
                <p className="text-rejected">NOT REGISTERED</p>
              ) : trainee.preTest ? (
                "passed"
              ) : (
                "failed"
              )}
            </span>
            <span className="">
              {trainee.postTest == null ? (
                <p className="text-rejected">NOT REGISTERED</p>
              ) : trainee.postTest ? (
                "passed"
              ) : (
                "failed"
              )}
            </span>
            <div className="flex gap-2">
              <span className="">
                {trainee.certified == null ? (
                  <p className="text-rejected">NOT REGISTERED</p>
                ) : trainee.certified ? (
                  "certified"
                ) : (
                  "not certified"
                )}
              </span>
              {(datas.theU.user.CPDId==trainee.Course.Proposal.CPDID)&&<button
                onClick={()=>{generateCertification(trainee.id)}}
                disabled={loading}
                className={`${loading?"bg-thirtyPer":"bg-tenPer"} px-2 text-white rounded-md py-1`}
              >
                Generate
              </button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Certification;
