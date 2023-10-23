import ProposalForm from "../proposalUI/ProposalForm";
import NullSP from "../finance/NullStatusProposal";
import ItDash from "../it_dashboard/ItDashboard";
import { useEffect, useState } from "react";
import Courses from "../course/Course";
import ItDashCpd from "../it_dashboard/cpd/ItDashboardCpd";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import Profile from "../profile/Profile";

function Menus() {
  const checkUserAuth = () => {
    return false;
  };
  const params = useParams();
  const [clicked, setclicked] = useState(0);
  const [user, setUser] = useState(null);
  const [depName, setDepName] = useState();
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

  return (
    <div>
      {user!=null && (
        <div className="flex flex-row">
          <div className="w-60">
            <div className="fixed flex flex-col justify-center text-center gap-12 text-lg p-12 mt-14">
              <div className="cursor-pointer" onClick={() => setclicked(0)}>
                Profile
              </div>
              {(depName == "finance" || depName == "logistics") && (
                <div className="cursor-pointer" onClick={() => setclicked(1)}>
                  Requests
                </div>
              )}
              <div className="cursor-pointer" onClick={() => setclicked(2)}>
                Proposal
              </div>
              {depName == "system administrator" && (
                <div className="cursor-pointer" onClick={() => setclicked(3)}>
                  Users
                </div>
              )}
              {depName == "system administrator" && (
                <div className="cursor-pointer" onClick={() => setclicked(4)}>
                  CPD
                </div>
              )}
              <div className="cursor-pointer" onClick={() => setclicked(5)}>
                Courses
              </div>
            </div>
          </div>
          {clicked == 0 && <Profile theU={user} />}
          {clicked == 1 && <NullSP />}
          {clicked == 2 && <ProposalForm />}
          {clicked == 3 && <ItDash />}
          {clicked == 4 && <ItDashCpd />}
          {clicked == 5 && <Courses theU={user} />}
        </div>
      )}
    </div>
  );
}

export default Menus;
