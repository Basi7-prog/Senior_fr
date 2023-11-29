import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

function Reports(params) {
  const cookies = Cookies.get("accessToken");
  const [state, setState] = useState();
  const [from, setFrom] = useState("2022-10-16");
  const [to, setTo] = useState("2023-11-28");
  const [newD, setNewD] = useState([{}]);

  const submitIt=()=>{
    setNewD([{}])
    axios
    .get(`/gettraineereport?from=${from}&to=${to}`, {
      headers: {
        Authorization: `Bearer ${cookies}`,
      },
    })
    .then((resp) => {
      if (resp.data.length > 0) {
        setState(resp.data);
        resp.data.forEach((element, i) => {
          let fem = 0;
          let mal = 0;
          if (element.Trainees.length > 0) {
            element.Trainees.forEach((gender) => {
              if (gender.User.gender == "Female") {
                fem += 1;
              } else {
                mal += 1;
              }
            });
          }
          if (i == 1) {
            setNewD([
              {
                name: `${new Date(element.createdAt).getMonth()} ${new Date(
                  element.createdAt
                ).getFullYear()}`,
                female: fem,
                male: mal,
              },
            ]);
          } else if (i > 1) {
            setNewD((prev) => [
              ...prev,
              {
                name: `${new Date(element.createdAt).getMonth()} ${new Date(
                  element.createdAt
                ).getFullYear()}`,
                female: fem,
                male: mal,
              },
            ]);
          }
        });
      }
    });
  }
  useEffect(() => {
    submitIt()
  }, []);
  
  const data = [
    { name: "Jan", uv: 4000, pv: 2400, amt: 2400 },
    { name: "Feb", uv: 3000, pv: 1398, amt: 2210 },
    { name: "Mar", uv: 2000, pv: 9800, amt: 2290 },
    // Other data points...
  ];

  return (
    <div className="">
      <div className="flex gap-3">
        <label><input type="date" onChange={(e)=>{setFrom(e.target.value)}} /></label>
        <label><input type="date" onChange={(e)=>{setTo(e.target.value)}} /></label>
        <button onClick={submitIt} className="">Show</button>
      </div>
      <div className="grid grid-cols-2 overflow-auto">
        <LineChart width={400} height={300} data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <Line type="monotone" dataKey="uv" stroke="#8884d8" />
          <Line type="monotone" dataKey="pv" stroke="#82ca9d" />
          <Line type="monotone" dataKey="amt" stroke="#82ca9d" />
          <Tooltip />
          <Legend />
        </LineChart>
        <LineChart width={500} height={400} data={newD}>
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid stroke="#ebebeb" strokeDasharray="6 2" />
          <Line type="monotone" dataKey="female" stroke="#8884d8" />
          <Line type="monotone" dataKey="male" stroke="#82ca9d" />
          <Tooltip />
          <Legend />
        </LineChart>
      </div>
    </div>
  );
}

export default Reports;
