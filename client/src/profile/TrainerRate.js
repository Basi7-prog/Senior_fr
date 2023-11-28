import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

function Rate(user) {
  const cookies = Cookies.get("accessToken");
  const [trainerR, setTrainerR] = useState();
  const [submittedTR, setSubmittedTR] = useState();
  const [enteredValue, setEnteredValue] = useState([]);
  const [rated, setRated] = useState(false);

  console.log("for rating", user.theU.theU.theU);
  useEffect(() => {
    axios
      .get(
        `/gettrainerforrate?cId=${user.theC.cId}&uId=${user.theU.theU.theU.user.id}`,
        {
          headers: {
            Authorization: `Bearer ${cookies}`,
          },
        }
      )
      .then((resp) => {
        if (resp.data) {
          setTrainerR(resp.data);
        } else {
          setTrainerR();
          setEnteredValue([]);
        }
      });
  }, [user.theC]);
  const onValueChange = (key, value, uId) => {
    if (enteredValue.length > 0) {
      let found = false;
      const index = enteredValue.findIndex((obj) => obj.uId === uId);
      console.log("index is", index);
      if (index !== -1) {
        const updatedData = enteredValue[index].data.map((item) => {
          if (item.key === key) {
            found = true;
            return { ...item, rate: value };
          } else {
            return item;
          }
        });
        if (!found) {
          const newState = [...enteredValue];
          const newData = [...newState[index].data, { key: key, rate: value }];
          newState[index].data = newData;
          setEnteredValue(newState);
        } else {
          const newState = [...enteredValue];
          newState[index].data = updatedData;
          setEnteredValue(newState);
        }
      } else {
        setEnteredValue((prev) => [
          ...prev,
          { uId: uId, data: [{ key: key, rate: value }] },
        ]);
      }
    } else {
      setEnteredValue((prev) => [
        ...prev,
        { uId: uId, data: [{ key: key, rate: value }] },
      ]);
    }
  };

  const submitRate = async (e) => {
    e.preventDefault();
    await axios
      .post(
        `/ratetrainer?cId=${user.theC.cId}&uId=${user.theU.theU.theU.user.id}`,
        { enteredValue },
        {
          headers: {
            Authorization: `Bearer ${cookies}`,
          },
        }
      )
      .then((resp) => {
        if (resp.data) {
          setRated(resp.data);
        }
      });
  };
  useEffect(() => {
    console.log("changed value", enteredValue);
  }, [enteredValue]);
  return (
    <>
      {trainerR && !rated && (
        <div className={"w-full"}>
          <div className="mb-14">
            {/* {user.theU?.user.firstName} {user.theU?.user.middleName}{" "}
        {user.theU?.user.lastName} */}
          </div>
          <h1 className="font-semibold text-xl">
            Evaluate Trainers{" "}
            <span className="text-sm font-normal italic">
              {user.theC.topic}
            </span>
          </h1>
          <div className="border-2 border-tenPer p-2 rounded-md">
            <form onSubmit={submitRate}>
              {trainerR.trainers.map((tForm) => (
                <div className="mb-4">
                  <h1 className="font-semibold text-md bg-tenPer text-sixtyPer pl-2">
                    {tForm.User.firstName} {tForm.User.middleName}{" "}
                    {tForm.User.lastName}
                  </h1>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          {trainerR.form?.map((fOptions) => (
                            <TableCell>{fOptions}</TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          {trainerR.form?.map((fOptions, key) => (
                            <TableCell>
                              <input
                                type="number"
                                min="0"
                                max="15"
                                placeholder="----"
                                className="border-[1px] border-black text-center rounded-md"
                                onChange={(e) =>
                                  onValueChange(key, e.target.value, tForm.id)
                                }
                                required={true}
                              />
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              ))}
              <button className="" type="submit">
                Submit Rate
              </button>
            </form>
            {/* {enteredValue} */}
          </div>
        </div>
      )}
    </>
  );
}

export default Rate;
