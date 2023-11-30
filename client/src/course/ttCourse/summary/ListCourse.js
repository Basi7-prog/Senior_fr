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
  import { Route, Routes, useNavigate, useParams } from "react-router-dom";
  import CourseSummary from "./CourseSummary";
  function ListCourse(user) {
    const params = useParams();
    const [allCourse, setAllCourse] = useState([]);
    const [allCourseDis, setAllCourseDis] = useState([]);
    const [deps, setDeps] = useState([]);
    const [byDep, setByDep] = useState("");
    const [byTopic, setByTopic] = useState("");
    const cookies = Cookies.get("accessToken");
    const dropDownStyle =
      "border-[1px] border-borderc rounded-lg px-3 py-1 focus:drop-shadow-[0_0px_3px_#0582F5] focus:border-tenPer outline-0";
  
    useEffect(() => {
      axios
        .get(`/getalldonecourse`, {
          headers: { Authorization: `Bearer ${cookies}` },
        })
        .then((res) => {
          if (res.data.length > 0) {
            setAllCourse(res.data);
            let alldeps = [];
            res.data.forEach((element) => {
              if (!alldeps.includes(element.Proposal.Department.name)) {
                alldeps.push(element.Proposal.Department.name);
              }
            });
            setDeps(alldeps);
          }
        });
    }, []);
  
    useEffect(() => {
      setAllCourseDis(allCourse);
    }, [allCourse]);
  
    useEffect(() => {
      if (byTopic == "" && byTopic != "") {
        const filterTopic = allCourse.filter((crs) =>
          crs.Proposal.topic.toLowerCase().includes(byTopic.toLowerCase())
        );
        setAllCourseDis(filterTopic);
      } else if (byDep == "" && byTopic == "") {
        setAllCourseDis(allCourse);
      } else if (byTopic != "" && byTopic == "") {
        const filterDep = allCourse.filter(
          (crs) => crs.Proposal.Department.name == byDep
        );
        setAllCourseDis(filterDep);
      } else {
        const filterTopic = allCourse.filter(
          (crs) =>
            crs.Proposal.topic.toLowerCase().includes(byTopic.toLowerCase()) &&
            crs.Proposal.Department.name == byDep
        );
        setAllCourseDis(filterTopic);
      }
    }, [byTopic, byDep]);
    // useEffect(() => {
    //   if (byDep != "") {
    //     const filterDep = allCourseDis.filter(
    //       (crs) => crs.Proposal.Department.name == byDep
    //     );
    //     setAllCourseDis(filterDep);
    //   } else if (byDep == "" && byTopic == "") {
    //     setAllCourseDis(allCourse);
    //   } else if (byDep == "" && byTopic != "") {
    //     const filterTopic = allCourseDis.filter((crs) =>
    //       crs.Proposal.topic.toLowerCase().includes(byTopic.toLowerCase())
    //     );
    //     setAllCourseDis(filterTopic);
    //   }
    // }, [byDep]);
  
    return (
      <div className=" overflow-hidden text-md text-[14px] flex-col">
        <h1 className="text-2xl font-semibold">Courses by all Departments</h1>
        <div className="flex gap-3 mt-7 mb-3">
          <input
            type="text"
            className={dropDownStyle}
            placeholder="Search Topic"
            onChange={(e) => setByTopic(e.target.value)}
          />
          <select
            className={dropDownStyle}
            onChange={(e) => setByDep(e.target.value)}
          >
            <option value={""}>{"All"}</option>
            {deps.map((dp) => (
              <option value={dp}>{dp}</option>
            ))}
          </select>
        </div>
        <ParticipantTable data={allCourseDis} sCourse={user.selectedC} />
        <Routes>
          <Route
            path="coursesummary/:id"
            element={<CourseSummary theU={user} />}
          />
        </Routes>
      </div>
    );
  }
  function ParticipantTable(data) {
    // const nav = useNavigate(``);
    const headerStyle = "font-semibold text-sm p-2";
    const selectedCourse = (crsId) => {
        data.sCourse(crsId)
    };
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell class={headerStyle}>#</TableCell>
              <TableCell class={headerStyle}>Course Topic</TableCell>
              <TableCell class={headerStyle}>Department</TableCell>
              <TableCell class={headerStyle}>End Date</TableCell>
              <TableCell class={headerStyle}>Rating</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.data?.map((course, i) => (
              <TableRow
                class={"cursor-pointer"}
                onClick={() => {
                  selectedCourse(course.id);
                }}
              >
                <TableCell className={""}>{i + 1}</TableCell>
                <TableCell className={""}>{course.Proposal.topic}</TableCell>
                <TableCell className={""}>
                  {course.Proposal.Department.name}
                </TableCell>
                <TableCell className={""}>{course.Proposal.endDate}</TableCell>
                <TableCell className={""}>{course.courseRating}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
  
  export default ListCourse;
  export { ParticipantTable };
  