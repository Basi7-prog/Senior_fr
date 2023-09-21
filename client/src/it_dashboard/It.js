import { useParams } from "react-router-dom";

function It(){
    const params=useParams();
    return(
        <div>
            It
            {params.id}
        </div>
    );
}

export default It;