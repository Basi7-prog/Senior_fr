import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import PropTable from "./ProposalTable";
import AddPopup from "./AddProposalPopUp";

function ProposalForm() {
  const [allProposal, setallProposal] = useState([{}]);
  const cookies = Cookies.get("accessToken");
  const childProposalRef = useRef({});
  useEffect(() => {
    fetch("/fetchAllProposal", {
      headers: {
        Authorization: `Bearer ${cookies}`,
      },
    })
      .then((response) => response.json())
      .then((proposals) => {
        console.log("fetched proposals", proposals);
        setallProposal(proposals.resp);
        childProposalRef.current.setState({
          department: {
            id: proposals.depDetail.departmentId,
            name: proposals.depDetail.depName,
          },
          onSaveNewProposal: saveProposal,
        });
      })
      .catch((err) => console.log("fetching proposal errror", err));
  }, []);
  useEffect(() => {

  }, [allProposal]);

  const saveProposal = async (newProposal) => {
    console.log("add new proposal", newProposal);
    try {
      const response = await fetch("/addproposal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies}`,
        },
        body: JSON.stringify(newProposal),
      })
        .then((res) => res.json())
        .then((res2) => {
          setallProposal((prevData) => [...prevData, res2]);
          console.log("post successfull", allProposal);
        });
      if (response.ok) {
      } else {
        console.log("post not successfull");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const checkHandler = (id) => {
    childProposalRef.current.setState({
      childState: true,
      proposal: allProposal.find((propos) => propos.id == id),
    });
  };
  console.log("proposal form");
  return (
    <div className="w-full overflow-hidden text-md text-[14px]">
      <div className="container mx-auto w-9/12 p-2 overflow-hidden">
        <div className="flex flex-col">
          <div className=" text-[16px]">
            <AddPopup ref={childProposalRef} />

            <PropTable proposalForTable={allProposal} onAction={checkHandler} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProposalForm;
