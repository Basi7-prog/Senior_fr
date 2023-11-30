import { Route, Routes, useNavigate } from "react-router-dom";
import CourseSummary from "./CourseSummary";
import ListCourse from "./ListCourse";
import { useEffect } from "react";
function Summary(user) {
const nav=useNavigate();
const navList=()=>{
nav(`listcourse`)
}
const navCrs=(id)=>{
  if(id){
nav(`coursesummary/${id}`)}
}
useEffect(()=>{
  navList()},[])
  return (
    <div className=" overflow-hidden text-md text-[14px] flex-col">
      <Routes>
        <Route
          path="/coursesummary/:id"
          element={<CourseSummary theU={user} back={navList} />}
        />
        <Route
          path="/listcourse"
          element={<ListCourse theU={user} selectedC={navCrs} />}
        />
      </Routes>
    </div>
  );
}

export default Summary;
