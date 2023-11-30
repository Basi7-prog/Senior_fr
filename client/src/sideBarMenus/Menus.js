import ProposalForm from "../proposalUI/ProposalForm";
import NullSP from "../finance/NullStatusProposal";
import ItDash from "../it_dashboard/ItDashboard";
import { useEffect, useState } from "react";
import Courses from "../course/Course";
import ItDashCpd from "../it_dashboard/cpd/ItDashboardCpd";
import Cookies from "js-cookie";
import { Link, Route, Routes, useParams } from "react-router-dom";
import Profile from "../profile/Profile";
import Reports from "../reports/Reports";
import Summary from "../course/ttCourse/summary/Summary";

function Menus() {
  const humanResource="human resource"
  const logistic="logistics"
  const finance="finance"
  const checkUserAuth = () => {
    return false;
  };
  const params = useParams();
  const [clicked, setclicked] = useState(0);
  const [user, setUser] = useState(null);
  const [depName, setDepName] = useState();
  const [visible, setVisisble] = useState(true);
  const cookies = Cookies.get("accessToken");
  useEffect(() => {
    fetch("/getUser/" + params.id, {
      headers: {
        Authorization: `Bearer ${cookies}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("it is in the menu ", data);
        setUser(data);
        setDepName(data.department.name.toLowerCase());
        console.log(data.department.name);
      });
  }, []);
  const classcss =
    "cursor-pointer focus-within:font-bold focus-within:text-tenPer";
  return (
    <div className="w-full">
      {user != null && (
        <div className="flex flex-row">
          <div className="w-60 h-screen">
            <div className="group flex flex-col justify-center text-center gap-12 text-lg p-12">
              <Link to="profile" className={classcss} onClick={() => setclicked(0)}>
                Profile
              </Link>
              {(depName == finance || depName == logistic) && (
                <Link to="reques_proposals" className={classcss} onClick={() => setclicked(1)}>
                  Requests
                </Link>
              )}
              <Link to="proposals" className={classcss} onClick={() => setclicked(2)}>
                Proposal
              </Link>
              {depName == "system administrator" && (
                <Link to="staff" className={classcss} onClick={() => setclicked(3)}>
                  Staff
                </Link>
              )}
              {depName == "system administrator" && (
                <Link to="cpd" className={classcss} onClick={() => setclicked(4)}>
                  CPD
                </Link>
              )}
              <Link
                className={classcss}
                to={`/${params.id}/menu/course`}
                onClick={()=>{ setVisisble(false) }}
              >
                Courses
              </Link>
              {depName==humanResource&&<Link
                className={classcss}
                to={`/${params.id}/menu/summary`}
                onClick={()=>{ setVisisble(false) }}
              >
                Summary
              </Link>}
              <Link
                className={classcss}
                to={`/${params.id}/menu/reports`}
                onClick={()=>{ setVisisble(false) }}
              >
                Reports
              </Link>
            </div>
          </div>
            <div className=" border-l-2 w-full overflow-hidden pt-8">
          <div className="overflow-hidden p-3">
          {/* {clicked == 0 && visible && <Profile theU={user} />} */}
          {/* {clicked == 1 && visible && <NullSP />} */}
          {/* {clicked == 2 && visible && <ProposalForm />} */}
          {/* {clicked == 3 && visible && <ItDash />} */}
          {/* {clicked == 4 && <ItDashCpd />} */}
            <Routes>
              <Route path="/course/*" element={<Courses theU={user} />} />
              <Route path="/cpd" element={<ItDashCpd theU={user}/>} />
              <Route path="/staff" element={<ItDash theU={user}/>} />
              <Route path="/proposals" element={<ProposalForm theU={user}/>} />
              <Route path="/reques_proposals" element={<NullSP theU={user}/>} />
              <Route path="/profile" element={<Profile  theU={user}/>} />
              {depName==humanResource&&<Route path="/summary/*" element={<Summary  theU={user}/>} />}
              <Route path="/reports" element={<Reports  theU={user}/>} />
            </Routes>
          </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Menus;
