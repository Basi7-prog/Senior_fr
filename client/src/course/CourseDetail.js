import TraineesTable from "./Trainees";
import TrainersTable from "./Trainers";

function CourseDetails(course) {
  console.log("the course detail is", course);
  return (
    <div className="">
      <div className="flex flex-col gap-y-12">
        <div className="grid grid-cols-2 gap-y-14 gap-x-5 overflow-hidden">
          <div className="flex flex-col">
            <span className="text-accepted">
              {course.courseD.Course.courseStatus ? "Finished" : "On-Training"}
            </span>
            <h1 className="text-3xl font-bold">{course.courseD.topic}</h1>
            <span className="">
              <span className="pr-3">{course.courseD.startDate}</span>{" "}
              <span className="">{course.courseD.endDate}</span>
            </span>
          </div>
          <div className="">
            <span className="font-bold">Today</span>{" "}
            {`${new Date().getDay()}-${
              new Date().getMonth() + 1
            }-${new Date().getFullYear()}`}
          </div>
          <div className="overflow-hidden">
            <TraineesTable />
          </div>
          <div className="">
            <div className="flex flex-col gap-y-5">
              <TrainersTable />
              <h1 className="mt-4 text-xl font-bold">Facilitator</h1>
              <div className="flex flex-row">asdf adfs</div>
            </div>
          </div>
        </div>
        <hr />
        <div className="grid grid-cols-3 w-full gap-y-4 w-fit">
          <div className="grid grid-cols-2 gap-x-4 gap-y-4 w-fit">
            <span className="font-bold">Expected Trainees</span>
            <span className="">11</span>
            <span className="font-bold">Trainers</span>
            <span className="">2</span>
            <span className="font-bold">Facilitor</span>
            <span className="">2</span>
            <span className="font-bold">Venue</span>
            <span className="">{course.courseD.CPD.name}</span>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-4 w-fit">
            <span className="font-bold">Enrolled Trainees</span>
            <span className="">10</span>
          </div>
          <div className="flex flex-col text-center gap-y-2 w-fit border-8 border-accepted rounded-full justify-center px-4 py-10">
            <span className="font-bold">Days Remaining</span>
            <span className="font-bold text-5xl">11</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetails;
