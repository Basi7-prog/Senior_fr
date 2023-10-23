import { useEffect, useRef, useState } from "react";
import FacilitatorPopUp from "./FacilitatorPopUp";
import Cookies from "js-cookie";
import axios from "axios";

function Facilitator(cId) {
  const childRef = useRef({});
  const cookies = Cookies.get("accessToken");
  const [allFacilitator, setallFacilitator] = useState({});
  const [isLoading,setIsL]=useState(true);

  const addFacilitator = () => {
    const resp = axios
      .get(`/getFacilitator?courseId=${cId.cId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies}`,
        },
      })
      .then((res) => {
        console.log("assigned facilitator:", res.data);
        setallFacilitator(res.data);
        setIsL(false);
        cId.noFacilitators(res.data.length)
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
          addFacilitators:addFacilitator,
          loading:setIsL
        });
      });
  };

  useEffect(()=>{
    addFacilitator();
  },[])

  return (
    <div className="flex flex-col gap-y-5">
      {(cId.isDirector&&(cId.isActive!=false))?
      <button
        className="w-fit mt-4 rounded-md p-2 text-sixtyPer bg-tenPer"
        onClick={assignFacilitatorHandler}
      >
        Assign Facilitator
      </button>:""}
      <FacilitatorPopUp ref={childRef} />
      <h1 className="text-lg font-medium">Facilitator</h1>
      <div className="grid grid-cols-3">
        {isLoading?<span className="text-center text-xl text-thirtyPer">Loading...</span>:allFacilitator.map((fr,i)=>(
          <span className="">{fr.User.firstName} {fr.User.middleName}</span>
        ))}
      </div>
    </div>
  );
}

export default Facilitator;
