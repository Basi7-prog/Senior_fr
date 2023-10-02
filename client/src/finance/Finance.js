import { useEffect,useState } from "react";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import ProposalForm from "../proposalUI/ProposalForm";
import NullSP from "./NullStatusProposal";

function Finance(){
    const params = useParams();
    const [p, pa] = useState(false);
    const [clicked, setclicked] = useState(1);
    const cookies=Cookies.get('accessToken');
    useEffect(() => {
      fetch("/getUser/"+params.id, {
        headers: {
          Authorization: `Bearer ${cookies}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("fin", data);
          
        data.department.name.toLowerCase()=="finance"? pa(data.user): pa(null);;
         
        });
    },[]);
    return(
        <div>
            {p?(<div className="flex flex-row">
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
          {/*!p.userType&&*/clicked == 1 && <NullSP/>}
          {clicked == 2 && <ProposalForm />}
        </div>):'fuck outta here'}
        </div>
    );
}

export default Finance;