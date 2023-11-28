import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

function CourseRate(user) {
  const cookies = Cookies.get("accessToken");
  const [cols, setCols] = useState();
  const [rows, setRows] = useState();
  const [rateValues, setRateValues] = useState([]);
  const [rated, setRated] = useState(false);

  useEffect(() => {
    axios
      .get(
        `/getcourseforrate?cId=${user.theC.cId}&uId=${user.theU.theU.theU.user.id}`,
        {
          headers: {
            Authorization: `Bearer ${cookies}`,
          },
        }
      )
      .then((resp) => {
        if (resp.data != null) {
          setCols(resp.data.cols);
          setRows(resp.data.rows);
        }
      });
  }, []);
  useEffect(() => {
    if (rows != null) {
      if (rateValues.length == 0) {
        console.log("this is the cols", rows);
        const rowvalues = [];
        rows.forEach((element) => {
          rowvalues.push({ key: element, value: null });
        });
        setRateValues(rowvalues);
        // cols.forEach((element) => {
        //   setRateValues((prev) => [...prev, { key: element, value: rowvalues }]);
        // });
      }
    }
  }, [rows]);

  const onValueChange = (key, values) => {
    const index = rateValues.findIndex((obj) => obj.key == key);
    if (index !== -1) {
      console.log("found it");
      const newdata = [...rateValues];
      newdata[index].value = values;
      setRateValues(newdata);
    }
  };

  const submitRate = (e) => {
    e.preventDefault();
    const finalValue = [];
    cols.forEach((col) => {
      const values = [];
      rateValues.forEach((row) => {
        if (row.value == col) {
          values.push(1);
        } else {
          values.push(0);
        }
      });
      finalValue.push({ type: col, values: values });
    });
    console.log("the final value", finalValue);
    axios
      .put(
        `/ratecourse?cId=${user.theC.cId}&uId=${user.theU.theU.theU.user.id}`,
        { finalValue },
        {
          headers: {
            Authorization: `Bearer ${cookies}`,
          },
        }
      )
      .then((resp) => {
        if (resp.data) {
          setRated(true);
        }
      });
  };
  return (
    <>
      {rows && !rated && (
        <div className="">
          <div className="mb-14">{""}</div>
          <h1 className="font-semibold text-xl">
            Rate Course {""}
            <span className="text-sm font-normal italic">
              {user.theC.topic}
            </span>
          </h1>
          <form
            onSubmit={submitRate}
            className="border-2 border-tenPer p-2 rounded-md"
          >
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
                  {rows?.map((values, i) => (
                    <TableRow>
                      <TableCell>{values}</TableCell>
                      {cols?.map((fOptions, key) => (
                        <TableCell class="text-center py-2 border-y-[1px]">
                          <input
                            type="radio"
                            name={`group${i}`}
                            className="border-[1px] border-black text-center rounded-md"
                            onChange={(e) => onValueChange(values, fOptions)}
                            required={true}
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <button className="" type="submit">
              Submit Rate
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default CourseRate;
