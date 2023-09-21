import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function It() {
  const params = useParams();
  const [p, pa] = useState("nothing");
  useEffect(() => {
    fetch("/l", {
      headers: {
        Authorization: `Bearer ${params.id}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("asd", data);
        pa(data.post);
      });
  });
  return (
    <div>
      {p}
      {params.id}
    </div>
  );
}

export default It;
