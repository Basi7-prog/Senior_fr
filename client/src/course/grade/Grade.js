import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Grade(user) {
  console.log("attendance");
  const cookies = Cookies.get("accessToken");
  const params = useParams();
  const [course, setCourse] = useState();
  const [preT, setPreT] = useState();
  const [postT, setPostT] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/gradetrainee/${params.id}`, {
      headers: {
        Authorization: `Bearer ${cookies}`,
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log("this is the course ", data);
        setCourse(data);
      });
  }, []);

  const pretestHandle = async (e) => {
    const test = e.target.value;
    const id = e.target.id;
    if (test != "") {
      setPreT(e.target.value);
      let tf = 1;
      if (test == "fail") {
        tf = 0;
      }
      setLoading(true);
      await axios
        .post(
          `/pretest?id=${id}&pret=${tf}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${cookies}`,
            },
          }
        )
        .then((resp) => {
          if (resp.data) {
            setLoading(false);
          }
          console.log("pre tes", resp.data);
        });
    }
  };
  const posttestHandle = async (e) => {
    const test = e.target.value;
    const id = e.target.id;
    if (test != "") {
      setPostT(e.target.value);
      let tf = 1;
      if (test == "fail") {
        tf = 0;
      }
      setLoading(true);
      await axios
        .post(
          `/posttest?id=${id}&postt=${tf}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${cookies}`,
            },
          }
        )
        .then((resp) => {
          if (resp.data) {
            setLoading(false);
          }
          console.log("post tes", resp.data);
        });
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">{user.courseT}</h1>
      <table className="w-fit text-center">
        <thead className=" ">
          <tr>
            <th className="rounded-l-lg bg-tenPer text-sixtyPer py-10 px-24">
              Full Name
            </th>
            <th className="py-2 bg-tenPer py-10 px-10 text-sixtyPer border-x-2 border-sixtyPer">
              Pre Test
            </th>
            <th className="py-2 rounded-r-lg bg-tenPer text-sixtyPer py-10 px-10">
              Post Test
            </th>
          </tr>
        </thead>
        <tbody>
          {course?.Trainees?.map((trainee) => (
            <tr key={trainee.id}>
              <td className="py-2 rounded-l-lg">
                {trainee.User.firstName} {trainee.User.middleName}
              </td>
              <td className="py-2 py-1 px-2">
                <select
                  className=""
                  disabled={loading}
                  id={trainee.id}
                  defaultValue={
                    trainee.preTest > 0
                      ? "pass"
                      : trainee.postTest == null
                      ? ""
                      : "fail"
                  }
                  onChange={pretestHandle}
                >
                  <option value="">Select status</option>
                  <option value="pass">Pass</option>
                  <option value="fail">Fail</option>
                </select>
              </td>
              <td className="py-2 rounded-r-lg py-1 px-2">
                <select
                  className=""
                  disabled={loading}
                  id={trainee.id}
                  defaultValue={
                    trainee.postTest > 0
                      ? "pass"
                      : trainee.postTest == null
                      ? ""
                      : "fail"
                  }
                  onChange={posttestHandle}
                >
                  <option value="">Select status</option>
                  <option value="pass">Pass</option>
                  <option value="fail">Fail</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Grade;
