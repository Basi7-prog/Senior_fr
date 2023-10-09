import ProposalForm from "../proposalUI/ProposalForm";
import NullSP from "../finance/NullStatusProposal";
import ItDash from "../it_dashboard/ItDashboard";
import { useState } from "react";
import Courses from '../course/Course'
import ItDashCpd from '../it_dashboard/cpd/ItDashboardCpd'

function Menus(user) {
  const checkUserAuth = () => {
    return false;
  };
  console.log("the user is:", user);
  const [clicked, setclicked] = useState();
  return (
    <div className="flex flex-row">
      <div className="w-60">
        <div className="fixed flex flex-col justify-center text-center gap-12 text-xl p-12 mt-14">
          {(user.user.department.name.toLowerCase() == "finance" ||
            user.user.department.name.toLowerCase() == "logistics") && (
            <div className="cursor-pointer" onClick={() => setclicked(1)}>
              Requests
            </div>
          )}
          <div className="cursor-pointer" onClick={() => setclicked(2)}>
            Proposal
          </div>
          {user.user.department.name.toLowerCase() ==
            "system administrator" && (
            <div className="cursor-pointer" onClick={() => setclicked(3)}>
              Users
            </div>
          )}
          {user.user.department.name.toLowerCase() ==
            "system administrator" && (
              <div className="cursor-pointer" onClick={() => setclicked(4)}>
                CPD
              </div>
          )}
          <div className="cursor-pointer" onClick={() => setclicked(5)}>
            Courses
          </div>
        </div>
      </div>
      {clicked == 1 && <NullSP />}
      {clicked == 2 && <ProposalForm />}
      {clicked == 3 && <ItDash />}
      {clicked == 4 && <ItDashCpd />}
      {clicked == 5 && <Courses />}
    </div>
  );
}

export default Menus;
