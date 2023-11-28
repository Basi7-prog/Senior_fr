import Rate from "./TrainerRate";
import TraineeInfo from "./TraineeInfo";
import TrainerInfo from "./TrainerInfo";

function Profile(user) {  
  return (
    <div className={"w-full"}>
      <div className="mb-14">
      {user.theU?.user.firstName} {user.theU?.user.middleName}{" "}
      {user.theU?.user.lastName}</div>
      <div className="">
        <TraineeInfo theU={user} />
      </div>
      <div className=""><TrainerInfo theU={user} /></div>
    </div>
  );
}

export default Profile;
