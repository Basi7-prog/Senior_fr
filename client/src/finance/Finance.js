import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import Menus from "../sideBarMenus/Menus";

function Finance() {
  const params = useParams();
  const [p, pa] = useState(false);
  const cookies = Cookies.get("accessToken");
  useEffect(() => {
    fetch("/getUser/" + params.id, {
      headers: {
        Authorization: `Bearer ${cookies}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("fin", data);

        data.department.name.toLowerCase() == "finance"
          ? pa(data)
          : pa(null);
      });
  }, []);
  return (
    <div>
      {p ? (
        <div className="">
          <Menus user={p} ></Menus>
        </div>
      ) : (
        "fuck outta here"
      )}
    </div>
  );
}

export default Finance;
