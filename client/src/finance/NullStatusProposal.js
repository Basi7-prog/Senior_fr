import Cookies from "js-cookie";
import { useEffect, useState } from "react";

function NullStatusProposal(user) {
  const [nullProposal, setnullProposal] = useState("");
  const [enteredBudget, setenteredBudget] = useState();
  const [trainingT, settrainingT] = useState(0);
  const cookies = Cookies.get("accessToken");
  useEffect(() => {
    fetch("/fetchNullProposal", {
      headers: {
        Authorization: `Bearer ${cookies}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("null proposals", data);
        setnullProposal(data);
        setenteredBudget(
          data.nullProposal.map((onlyBudget, i) => ({
            budget: onlyBudget.budget,
            id: onlyBudget.id,
          }))
        );
      });
  }, []);
  //console.log(enteredBudget)
  const acceptHandler = async (e) => {
    let linkString = "/proposalApprove";
    if (e.target.value == "reject") {
      linkString = "/proposalReject";
    }
    if (enteredBudget) {
      //   console.log(enteredBudget.find((ids)=>ids.id==e.target.id).budget,e.target.id);
      try {
        await fetch(linkString, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies}`,
          },
          body: JSON.stringify({
            budget: enteredBudget.find((ids) => ids.id == e.target.id),
            tType: nullProposal.department == "Logistics" && trainingT,
          }),
        })
          .then((re) => re.json())
          .then((re) => {
            const updated = {
              nullProposal: nullProposal.nullProposal.filter(
                (ids) => ids.id != e.target.id
              ),
              department: nullProposal.department,
            };
            setnullProposal(updated);

            setenteredBudget(
              updated.nullProposal.map((onlyBudget, i) => ({
                budget: onlyBudget.budget,
                id: onlyBudget.id,
              }))
            );
            console.log("null effec proposals", updated);
          });
      } catch (err) {}
    }
  };

  useEffect(() => {
    if (nullProposal.nullProposal) {
      setenteredBudget(
        nullProposal.nullProposal.map((onlyBudget, i) => ({
          budget: onlyBudget.budget,
          id: onlyBudget.id,
        }))
      );
    }

    console.log("null effec proposals", enteredBudget);
  }, [nullProposal]);

  useEffect(() => {}, [enteredBudget]);

  const enteredBudgetHandler = (e) => {
    const updated = enteredBudget.map((ids) => {
      if (ids.id == e.target.id) {
        return { ...ids, budget: e.target.value };
      }
      return ids;
    });
    setenteredBudget(updated);
    console.log(
      enteredBudget.find((ids) => ids.id == e.target.id).budget,
      e.target.id
    );
    // setenteredBudget(e.target.value);
  };
  const comboHandler = (e) => {
    console.log(e.target.value);
    settrainingT(e.target.value);
  };
  const style1 = "mr-2 font-bold";
  const style2 = "";
  return (
    <div className="w-fit grid grid-cols-1 lg:grid-cols-2 gap-y-10 gap-x-3">
      {nullProposal.nullProposal?.map((proposal, i) => (
        <div className="w-full border-2 rounded-xl p-3">
          <div className="mb-6">{proposal.departmentName}</div>
          <div className="mb-4">
            <label className="text-xl font-bold">{proposal.topic}</label>
          </div>
          <div className="grid grid-cols-2 gap-y-2.5 gap-x-4">
            <div className="">
              <label className={style1}>Start Date</label>
              <label className="">{proposal.startDate}</label>
            </div>
            <div className="">
              <label className={style1}>End Date</label>
              <label className="">{proposal.endDate}</label>
            </div>
            <div className="">
              <label className={style1}>Targeted Profession</label>
              <label className="">{proposal.targetProfession}</label>
            </div>
            <div className="">
              <label className={style1}>Number of Facilitator</label>
              <label className="">{proposal.numberOfFacilitator}</label>
            </div>
            <div className="">
              <label className={style1}>Number of Trainee</label>
              <label className="">{proposal.numberOfTrainee}</label>
            </div>
            <div className="">
              <label className={style1}>Number of Trainer</label>
              <label className="">{proposal.numberOfTrainer}</label>
            </div>
            <div className="felx flex-col">
              <div className="">
                <label className={style1}>Budget</label>
                <label className="">
                  ETB {parseInt(proposal.budget).toLocaleString()}.
                  {proposal.budget.split(".")[1]}
                </label>
              </div>
              {user.theU.user.userType != ""&&nullProposal.department == "Finance" &&
                !nullProposal.approveBudgetStatus && (
                  <div className="">
                    <label className={style1}>New budget</label>
                    <input
                      type="number"
                      onChange={enteredBudgetHandler}
                      defaultValue={enteredBudget[i].budget}
                      id={proposal.id}
                      className="w-40 border-[1px] border-borderc rounded-lg px-3 py-1 focus:drop-shadow-[0_0px_3px_#0582F5] focus:border-tenPer outline-0"
                    />
                  </div>
                )}
            </div>
            <div className="">
              <label className={style1}>Approve Training Type</label>
              {user.theU.user.userType != ""&&nullProposal.department == "Logistics" &&
              !nullProposal.approveTrainingType ? (
                <select
                  className=""
                  onChange={comboHandler}
                  id={`combo${proposal.id}`}
                >
                  <option value="Self">Self</option>
                  {nullProposal.cpd?.map((cpdName,i)=>(
                  <option value={cpdName.id}>{cpdName.name}
                  </option>))}
                </select>
              ) : (
                !proposal.approveTrainingType && <label className="">---</label>
              )}
            </div>
          </div>
          <div className="mt-4 flex flex-row gap-x-3">
            {user.theU.user.userType != ""&&<button
              className="w-fit rounded-md p-2 text-sixtyPer bg-accepted"
              onClick={acceptHandler}
              value={"accept"}
              id={proposal.id}
            >
              Accept
            </button>}
            {user.theU.user.userType != ""&&!(nullProposal.department == "Logistics") && (
              <button
                className="w-fit rounded-md p-2 text-sixtyPer bg-rejected"
                onClick={acceptHandler}
                value={"reject"}
                id={proposal.id}
              >
                Reject
              </button>
            )}
          </div>
        </div>
      ))}
      {nullProposal.nullProposal?.length == 0 && (
        <div className="text-3xl font-bold">No requested proposal</div>
      )}
    </div>
  );
}

export default NullStatusProposal;
