import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProposalForm from "../proposalUI/ProposalForm";
import NullStatusProposal from "../finance/NullStatusProposal";

function Logistics() {
  const params = useParams();
  const [isAutherized, setisAutherized] = useState(null);
  const [clicked, setclicked] = useState(2);
  const cookies = Cookies.get("accessToken");

  useEffect(() => {
    fetch("/getUser/" + params.id, {
      headers: {
        Authorization: `Bearer ${cookies}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("in it ", data);

        data.department.name.toLowerCase() == "logistics"
          ? setisAutherized(data.user)
          : setisAutherized(null);
        console.log(data.department.name);
      });
  }, []);

  return (
    <div className="">
      {isAutherized != null ? `welcome ${isAutherized.userName}` : ""}
      {isAutherized != null ? (
        <div className="flex flex-row">
          <div className="w-60">
            <div className="fixed flex flex-col justify-center text-center gap-12 text-xl p-12 mt-14">
                {/*!p.userType&&*/<div className="cursor-pointer" onClick={() => setclicked(1)}>
                Requests
              </div>}
              <div className="cursor-pointer" onClick={() => setclicked(2)}>
                Proposal
              </div>
              {/* <Link to={`it/users`}>users</Link> */}
            </div>
          </div>
          {clicked == 1 && <NullStatusProposal/>}
          {clicked == 2 && <ProposalForm />}
        </div>
      ) : (
        "fuck outta here"
      )}
    </div>
  );
}

export default Logistics;
