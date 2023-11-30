import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function CourseSummary(user) {
  const params = useParams();
  const cookies = Cookies.get("accessToken");
  const [trainers, setTrainers] = useState([]);
  const [cols, setCols] = useState([]);
  const [course, setCourse] = useState();
  useEffect(() => {
    axios
      .get(`/getallcoursesummarization/${params.id}`, {
        headers: { Authorization: `Bearer ${cookies}` },
      })
      .then((res) => {
        if (res.data) {
          setTrainers(res.data.course.trainerEvaluations);
          setCourse(res.data.course.CourseRatings);
          setCols(res.data.trainerCols);
        }
      });
  }, []);
  return (
    <div className="flex flex-col">
      <button onClick={() => user.back()} className="w-fit text-tenPer">
        {"< back"}
      </button>
      <div className="">
        <TrainerRate trainers={trainers} forms={cols} />
        <CourseRate course={course} />
      </div>
    </div>
  );
}

function TrainerRate(rate) {
  return (
    <div className="mb-4">
      <h1 className="font-semibold text-md bg-tenPer text-sixtyPer pl-2">
        Trainers
      </h1>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              {rate.forms?.map((fOptions) => (
                <TableCell>{fOptions}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rate.trainers?.map((fOptions, key) => (
              <TableRow class={""}>
                <TableCell>{fOptions.Trainer.User.firstName} {fOptions.Trainer.User.middleName} {fOptions.Trainer.User.lastName}</TableCell>
                <TableCell>{fOptions.Personality_keeping_including_wearing_style}</TableCell>
                <TableCell>{fOptions.Training_materials_preparation_status}</TableCell>
                <TableCell>{fOptions.Training_methods_used}</TableCell>
                <TableCell>{fOptions.Facilitation_skill}</TableCell>
                <TableCell>{fOptions.Comprehensive_Knowledge_regarding_to_course_title}</TableCell>
                <TableCell>{fOptions.Comprehensive_practical_skill_regarding_to_course_title}</TableCell>
                <TableCell>{fOptions.Punctuality}</TableCell>
                <TableCell>{fOptions.CRC_Decipline}</TableCell>
                <TableCell>{fOptions.Total_score_out}</TableCell>
                <TableCell>{fOptions.Decision_made_for_the_next_training_Competent_Not_competent?"Competent":"Not Competent"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

function CourseRate(rate) {
    const cols=["Excellent","Very Good","Unable to decide","Poor","Very Poor","ExpectedNoOfParticipants",
    "TotalParticipanted",
    "ResponseRate",
    "SatisfactionRate",
    "UnableToDecideRate",
    "PoorSatisfactionRate",]
  return (
    <div className="mb-4">
      <h1 className="font-semibold text-md bg-tenPer text-sixtyPer pl-2">
        Course
      </h1>
      <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    {cols?.map((fOptions) => (
                      <TableCell>{fOptions}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rate.course?.map((values, i) => (
                    <TableRow>
                      <TableCell>{values.rating_type.type}</TableCell>
                      <TableCell>{values.excellent}</TableCell>
                      <TableCell>{values.veryGood}</TableCell>
                      <TableCell>{values.UnableToDecide}</TableCell>
                      <TableCell>{values.poor}</TableCell>
                      <TableCell>{values.veryPoor}</TableCell>
                      <TableCell>{values.ExpectedNoOfParticipants}</TableCell>
                      <TableCell>{values.TotalParticipanted}</TableCell>
                      <TableCell>{values.ResponseRate}%</TableCell>
                      <TableCell>{values.SatisfactionRate}%</TableCell>
                      <TableCell>{values.UnableToDecideRate}%</TableCell>
                      <TableCell>{values.PoorSatisfactionRate}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
    </div>
  );
}

export default CourseSummary;
export { TrainerRate };
