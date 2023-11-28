import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

function Attendance(data) {
  const cookies = Cookies.get("accessToken");
  const [dateHeader, setDateHeader] = useState([]);
  const [users, setUsers] = useState([]);
  const [attended, setAttended] = useState([]);
  const style = "text-sm py-2 font-normal text-center";
  const hStyle = "py-4 text-sm font-semibold";

  console.log("attendance");

  const toJson = (str) => {
    const jsn = JSON.parse(str);
    return jsn;
  };

  useEffect(() => {
    axios
      .get(`/getAttendance/${data.course}`, {
        headers: {
          Authorization: `Bearer ${cookies}`,
        },
      })
      .then((resp) => {
        const dateH =
          resp.data.trainee && JSON.parse(resp.data.trainee[0].attendance);
        setDateHeader([]);
        setAttended([]);
        setUsers(resp.data.trainee);
        resp.data.trainee?.forEach((dayAtt, i) => {
          const js = toJson(dayAtt.attendance);
          setAttended((prev) => [
            ...prev,
            { uId: resp.data.trainee[i].id, attendance: js.dates },
          ]);
          setAttended((prev) => {
            if (resp.data.today == null) {
              console.log("last att");
            } else {
              prev[i].attendance.push({
                date: resp.data.today,
                attended: false,
              });
            }
            return prev;
          });
        });
        dateH?.dates.forEach((day) => {
          setDateHeader((prev) => [...prev, new Date(day.date)]);
        });
        setDateHeader((prev) => {
          if (resp.data.today == null) {
            console.log("last att");
            return prev;
          } else {
            return [...prev, new Date(resp.data.today)];
          }
        });
        console.log(attended);
      });
  }, []);

  const onChangeHandler = (uId, i, j, isChecked) => {
    setAttended((prev) => {
      if (prev[i].uId == uId) {
        prev[i].attendance[j].attended = isChecked;
        console.log("inside ", prev[i]);
        return prev;
      }
    });
    console.log("real ", attended);
  };
  useEffect(() => {
    console.log("real ", attended);
  }, [attended]);

  const onSubmitHandler = () => {
    axios.post(
      "/setattendance",
      { attendance: attended, course: data.course },
      {
        headers: {
          Authorization: `Bearer ${cookies}`,
        },
      }
    );
  };

  return (
    <div className="text-xl font-bold">
      {/* attendance for real {data.theU.user.firstName} */}
      {users ? (
        <div className="">
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell class={hStyle}>Name</TableCell>
                  {dateHeader?.map((date, i) => (
                    <TableCell class={hStyle}>{date.toDateString()}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {users?.map((user, i) => (
                  <TableRow>
                    <TableCell class={style}>
                      {user?.User.firstName} {user?.User.middleName}
                    </TableCell>
                    {attended[i].attendance?.map((attend, j) => (
                      <TableCell class={`${style}`}>
                        <center>
                          <input
                            type="checkbox"
                            defaultChecked={attend.attended}
                            id={j}
                            onChange={(e) => {
                              onChangeHandler(user?.id, i, j, e.target.checked);
                            }}
                          />
                        </center>
                      </TableCell>
                    ))}
                    {/* <TableCell class={`${style}`}>
                  <center>
                    <input
                      type="checkbox"
                      id={dateHeader.length}
                      onChange={(e) => {
                        onChangeHandler(i, dateHeader.length, e.target.checked);
                      }}
                    />
                  </center>
                </TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <button className={""} onClick={onSubmitHandler}>
            Submit
          </button>
        </div>
      ):<h1 className="text-rejected text-center">No Trainees Registered</h1>}
    </div>
  );
}

export default Attendance;
