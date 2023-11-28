import { Switch } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import Modal from "react-modal";

function Settings(course) {
  const [switchChange, setSwitchChange] = useState(false);
  const [showPrompt, setShowprompt] = useState(false);
  const [rating, setRating] = useState();
  const [loading, setLoading] = useState(false);
  const [incompletes, setIncompletes] = useState();
  const cookies = Cookies.get("accessToken");

  const checkTraineeTests = () => {
    axios
      .get(`/checktraineetests/${course.courseT.Course.id}`, {
        headers: {
          Authorization: `Bearer ${cookies}`,
        },
      })
      .then((resp) => {
        console.log("incomplete trainees", resp.data);
        if (resp.data.length > 0) {
          setIncompletes(resp.data);
        }
      });
  };

  const handlChange = (checked) => {
    setIncompletes();
    setShowprompt(true);
  };
  const rateChangeHandler = (checked) => {
    if (rating) {
      setRating(false);
    } else {
      setRating(true);
    }
  };

  useEffect(() => {
    if (rating != null) {
      setLoading(true);
      axios
        .put(
          `/allowrate?cId=${course.courseT.Course.id}&allow=${rating}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${cookies}`,
            },
          }
        )
        .then((resp) => {
          console.log("is in allowed rating setting", resp.data);
          setLoading(false);
        })
        .catch((err) => {
          console.log("error is in changing allowed rating setting", err);
        });
    }
  }, [rating]);
  useEffect(() => {
    axios
      .get(`/fetchOneCourse/${course.courseT.Course.id}`, {
        headers: {
          Authorization: `Bearer ${cookies}`,
        },
      })
      .then((resp) => {
        setRating(resp.data.allowRating);
      })
      .catch((err) => {
        console.log("the error is in allowed rating setting", err);
      });
  }, []);
  const handlCancel = (checked, e) => {
    if (checked) {
      if (switchChange) {
        setSwitchChange(false);
      } else {
        axios
          .post(`/endcourse/${course.courseT.Course.id}`,{}, {
            headers: {
              Authorization: `Bearer ${cookies}`,
            },
          })
          .then((resp) => {
            if (resp.data) {
              setSwitchChange(true);
              window.location.reload();
            }
          });
      }
    } else {
    }
    setShowprompt(false);
  };
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col">
        <div className="font-bold text-xl mb-5">{course.courseT.topic}</div>
        <div>
          <label>
            <span className="">
              Grant permission to rate trainers and course.
            </span>
            <Switch
              checked={rating}
              onChange={rateChangeHandler}
              disabled={loading}
              onColor="#844AE7"
              offColor="#DDDDDD"
            />
          </label>
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-rejected">
          *Please avoid deactivating the course until the course is fully
          completed and all trainees have rated the course and the trainer
          <span className="font-bold">
            . Once deactivated, it cannot be activated
          </span>
          *
        </span>

        <div>
          <label>
            <span className="">End Course</span>
            <Switch
              checked={switchChange}
              onChange={handlChange}
              onColor="#844AE7"
              offColor="#DDDDDD"
            />
          </label>
        </div>
        <Modal
          isOpen={showPrompt}
          onRequestClose={(e) => handlChange(null, e)}
          contentLabel="Confirmation Modal"
          title="End Course"
          className={"w-fit mx-auto mt-5"}
        >
          <p className="rounded-t-md px-28 bg-tenPer py-4 text-white text-lg">
            Are you sure you want to end this course?
          </p>
          <div className="">
            {
              <Renders
                getIncTrainees={checkTraineeTests}
                trainees={incompletes}
              />
            }
          </div>
          <div className="flex gap-x-5 mt-2">
            <button
              className="rounded-md border-rejected text-rejected border-2 px-2"
              onClick={(e) => handlCancel(false, e)}
            >
              No
            </button>
            <button
              className="rounded-md border-accepted text-accepted border-2 px-2"
              onClick={(e) => handlCancel(true, e)}
            >
              Yes
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
}

function Renders(incompletes) {
  console.log("this is from console", incompletes.trainees);
  let incTrainees = null;
  if (incompletes.trainees?.length > 0) {
    incTrainees = incompletes.trainees;
  } else {
    incompletes.getIncTrainees();
  }
  return (
    <>
      {incTrainees && (
        <div className="bg-white border-tenPer border-2 p-2">
          <p className="text-lg">
            There are Trainees with <b>unregistered Tests</b>
          </p>
          <div className="flex flex-col gap-3 pt-3">
            <div className="grid grid-cols-3 gap-3 font-semibold">
              <span className="">Names</span>
              <span className="">Pre-Test</span>
              <span className="">Post-Test</span>
            </div>
            {incTrainees.map((trainee, i) => (
              <div className="grid grid-cols-3 gap-3 border-t-2">
                <span className="">{trainee.name}</span>
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
              </div>
            ))}
          </div>
        </div>
      )}
      {/* <p className="pt-3">Would you like to register these</p> */}
    </>
  );
}

export default Settings;
