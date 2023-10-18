import { useRef, useState } from "react";
import FacilitatorPopUp from "./FacilitatorPopUp";
import Cookies from "js-cookie";
import axios from "axios";

function Facilitator(cId) {
  const childRef = useRef({});
  const cookies = Cookies.get("accessToken");
  const [allTrainers, setallTrainers] = useState({});
  
  const addTrainer = () => {
    const resp = axios
      .get(`/getTrainers?courseId=${cId.cId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies}`,
        },
      })
      .then((res) => {
        console.log("assigned trainers:", res.data);
        setallTrainers(res.data);
        cId.setTrainers( res.data.length)
      });
  };
  
  const assignFacilitatorHandler = () => {
    fetch("/getTrainersbydep", {
      headers: {
        Authorization: `Bearer ${cookies}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("the trainers", data);
        childRef.current.setState({
          childState: true,
          facilitator: data,
          courseId: cId.cId,
          addTrainers:addTrainer
        });
      });
  };
        
  return (
    <div className="">
      <button
        className="w-fit mt-4 rounded-md p-2 text-sixtyPer bg-tenPer"
        onClick={assignFacilitatorHandler}
      >
        Assign Facilitator
      </button>
      <FacilitatorPopUp ref={childRef}/>
    </div>
  );
}

export default Facilitator;
