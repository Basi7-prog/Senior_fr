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
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  Rectangle,
} from "recharts";

function Reports(params) {
  const dropDownStyle =
    "border-[1px] border-borderc rounded-lg px-3 py-1 focus:drop-shadow-[0_0px_3px_#0582F5] focus:border-tenPer outline-0";
  const cookies = Cookies.get("accessToken");
  const [state, setState] = useState();
  const [from, setFrom] = useState("2022-10-16");
  const [to, setTo] = useState("2023-11-28");
  const [newD, setNewD] = useState([{}]);
  const [budget, setBudget] = useState([{}]);
  const [processedTraineeData, setProcessedTraineeData] = useState([{}]);

  const submitIt = () => {
    setNewD([{}]);
    setBudget([{}]);
    axios
      .get(`/gettraineereport?from=${from}&to=${to}`, {
        headers: {
          Authorization: `Bearer ${cookies}`,
        },
      })
      .then((resp) => {
        if (resp.data.length > 0) {
          const pT = processTraineeData(resp.data);
          setProcessedTraineeData(pT);
          let setBud = [];
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
            if (i == 0) {
              setBud.push({
                Dep: element.Proposal.Department.name,
                money: parseFloat(element.Proposal.budget),
              });
              setNewD([
                {
                  name: `${new Date(element.createdAt).getMonth()} ${new Date(
                    element.createdAt
                  ).getFullYear()}`,
                  female: fem,
                  male: mal,
                },
              ]);
            } else {
              const index = setBud.findIndex(
                (obj) => obj.Dep == element.Proposal.Department.name
              );
              if (index !== -1) {
                setBud[index].money =
                  parseFloat(setBud[index].money) +
                  parseFloat(element.Proposal.budget);
              } else {
                setBud.push({
                  Dep: element.Proposal.Department.name,
                  money: parseFloat(element.Proposal.budget),
                });
              }
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
          setBudget(setBud);
        }
      });
  };
  useEffect(() => {
    submitIt();
  }, []);
  // Function to calculate age from Date of Birth (Dob)
  const calculateAge = (dob) => {
    const dobDate = new Date(dob);
    const currentDate = new Date();
    const age = currentDate.getFullYear() - dobDate.getFullYear();
    const monthDiff = currentDate.getMonth() - dobDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && currentDate.getDate() < dobDate.getDate())
    ) {
      return age - 1;
    }
    return age;
  };

  // Function to process trainee data
  const processTraineeData = (traineeData) => {
    const processedData = traineeData.map((proposal) =>
      proposal.Trainees.map((trainee) => ({
        age: calculateAge(trainee.User.Dob),
        preTest: trainee.preTest,
        postTest: trainee.postTest,
      }))
    );

    // Flattening the nested array
    return processedData.flat();
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label bg-tenPer px-3 text-white">{`${
            payload[0].payload.Dep
          } : ${payload[0].payload.money.toLocaleString()} ETB`}</p>
        </div>
      );
    }
  };
  const COLORS = ["#8884d8", "#82ca9d", "#FFBB28", "#FF8042"];

  return (
    <div className="">
      <div className="flex gap-3 mb-7">
        <label>
          From{" "}
          <input
            type="date"
            className={dropDownStyle}
            onChange={(e) => {
              setFrom(e.target.value);
            }}
          />
        </label>
        <label>
          To{" "}
          <input
            type="date"
            className={dropDownStyle}
            onChange={(e) => {
              setTo(e.target.value);
            }}
          />
        </label>
        <button
          onClick={submitIt}
          className={"text-white bg-tenPer rounded-md px-2"}
        >
          Show
        </button>
      </div>
      <div className="grid grid-cols-2 gap-y-2 overflow-auto">
        <div className="w-fit border-2">
          <h1 className="bg-thirtyPer p-2 text-center">
            Budget spent in all departments
          </h1>
          <div className="p-2">
            <PieChart width={400} height={300}>
              <Pie
                dataKey="money"
                isAnimationActive={true}
                data={budget}
                cx={200}
                cy={150}
                outerRadius={80}
                color="green"
                fill="#0088FE"
                label
              >
                {budget.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                wrapperStyle={{ fontSize: "10px" }}
                content={<CustomTooltip />}
              />
              <Legend wrapperStyle={{ fontSize: "10px" }} />
            </PieChart>
          </div>
        </div>
        <div className="w-fit border-2">
          <h1 className="bg-thirtyPer p-2 text-center">
            Female and Male Trainees
          </h1>
          <div className="p-2">
            <LineChart width={400} height={300} data={newD}>
              <XAxis dataKey="name" fontSize={8} />
              <YAxis />
              <CartesianGrid stroke="#ebebeb" strokeDasharray="6 2" />
              <Line type="monotone" dataKey="female" stroke="#8884d8" />
              <Line type="monotone" dataKey="male" stroke="#82ca9d" />
              <Tooltip
                contentStyle={{ fontSize: "14px", fontFamily: "Arial" }}
              />
              <Legend />
            </LineChart>
          </div>
        </div>
        <div className="w-fit border-2">
          <h1 className="bg-thirtyPer p-2 text-center">Pass and fail by Age</h1>
          <div className="p-2">
            {/* <ResponsiveContainer width={400} height={300}>
              <BarChart
                width={500}
                height={300}
                data={processedTraineeData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="pv"
                  fill="#8884d8"
                  activeBar={<Rectangle fill="pink" stroke="blue" />}
                />
                <Bar
                  dataKey="uv"
                  fill="#82ca9d"
                  activeBar={<Rectangle fill="gold" stroke="purple" />}
                />
              </BarChart>
            </ResponsiveContainer> */}
            <LineChart width={400} height={300} data={processedTraineeData}>
              <XAxis dataKey="age" fontSize={8} />
              <YAxis />
              <CartesianGrid stroke="#ebebeb" strokeDasharray="6 2" />
              <Line type="monotone" dataKey="preTest" stroke="#8884d8" />
              <Line type="monotone" dataKey="postTest" stroke="#82ca9d" />
              <Tooltip
                contentStyle={{ fontSize: "14px", fontFamily: "Arial" }}
              />
              <Legend />
            </LineChart>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;
