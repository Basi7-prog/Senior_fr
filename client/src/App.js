import Finance from "./finance/Finance";
import LoginForm from "./first_login_form/LoginForm";
import It from "./it_dashboard/It";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Logistic from "./logistics/Logistics";
import { useEffect, useState } from "react";
import UpdateAccount from "./updateAccount/UpdateAccount";
import Menus from "./sideBarMenus/Menus";
import { useCookies } from "react-cookie";
import Cookies from "js-cookie";

function App() {
  const [isLoged, setIsLoged] = useState(null);
  // const [cookies, setCookie] = useCookies("accessToken");
  const cookies = Cookies.get("accessToken");
  useEffect(()=>{
    if (isLoged === null){
    checkLogged()}
  },[])
  const checkLogged=async()=>{
    await fetch("/isUser", {
      headers: {
        Authorization: `Bearer ${cookies}`,
      },
    }).then((res)=>res.json()).then((res)=>{
      setIsLoged(res)
      console.log("logged user",res)
      return res.department;
    });
  }
  if (isLoged === null) {
    checkLogged();
  }
  // useEffect(() => {
  //   const loggedInCookie = cookies;
  //   if (loggedInCookie) {
  //     setIsLoged(JSON.stringify(loggedInCookie));
  //     console.log("is loged", isLoged);
  //   } else {
  //     console.log("no is not loged", isLoged);
  //   }
  // }, [cookies]);
  return (
    <Router>
      <div className="">
        <header className="flex justify-between items-center px-8 text-sm bo border-2 h-16 mb-12">
          <Link to="/" className="text-xl font-bold">
            AAHB
          </Link>
          <div className="flex gap-x-3">
            <Link to="/ilogin">Login</Link>
            {isLoged != null ? (
              <div className="flex gap-x-3">
                <Link to="/account">{isLoged.user.userName}</Link>
                <Link to={`/menu/${isLoged.user.userName}`}>Dash-Board</Link>
              </div>
            ) : (
              ""
            )}
          </div>
        </header>
        <div className="container mx-auto">
          <Routes>
            <Route
              path="/ilogin/"
              element={<LoginForm isLogedIn={setIsLoged} />}
            />
            <Route
              path="/account/"
              element={<UpdateAccount isLogedIn={isLoged?.user} />}
            />
            <Route path="/it/:id" element={<It user="" />} />
            <Route path="/finance/:id" element={<Finance />} />
            <Route path="/logistics/:id" element={<Logistic />} />
            <Route path="/menu/:id" element={<Menus user={isLoged} check={checkLogged}/>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
