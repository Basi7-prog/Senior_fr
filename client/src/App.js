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
import MenusCpd from "./sideBarMenus/MenusCpd";
import MenuOthers from "./sideBarMenus/MenuOthers";

function App() {
  const [isLoged, setIsLoged] = useState(null);
  // const [cookies, setCookie] = useCookies("accessToken");
  const cookies = Cookies.get("accessToken");
  useEffect(() => {
    if (isLoged === null) {
      checkLogged();
    }
  }, []);
  const checkLogged = async () => {
    await fetch("/isUser", {
      headers: {
        Authorization: `Bearer ${cookies}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setIsLoged(res);
        console.log("logged user", res);
        if (res.department != null) {
          return res.department;
        } else if (res.cpd != null) {
          return res.cpd;
        } else if (res.trainee != null) {
          return res.trainee;
        } else if (res.trainer != null) {
          return res.trainer;
        }
      });
  };
  if (isLoged === null) {
    checkLogged();
  }
  const logoutHandler=()=>{
setIsLoged(null);
Cookies.remove("accessToken")
// window.location.reload();
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
        <header className="w-full backdrop-blur-lg flex justify-between items-center px-8 text-sm bo border-2 h-16">
          <Link to="/" className="text-xl font-bold">
            AAHB
          </Link>
          <div className="flex gap-x-3">{isLoged==null?
            <Link to="/ilogin">Login</Link>:<Link to="/ilogin" onClick={logoutHandler} className="">Log-Out</Link>}
            {isLoged != null ? (
              <div className="flex gap-x-3">
                <Link to="/account">{isLoged.user.userName}</Link>
                {isLoged.department != null ? (
                  <Link to={`/${isLoged.user.userName}/menu/profile`}>
                    Dash-Board
                  </Link>
                ) : isLoged.cpd != null ? (
                  <Link to={`/${isLoged.user.userName}/menucpd`}>
                    Dash-Board
                  </Link>
                ) : (
                  <Link to={`/${isLoged.user.userName}/menuothers/profile`}>
                    Dash-Board
                  </Link>
                )}
              </div>
            ) : (
              ""
            )}
          </div>
        </header>
        <div className="w-full">
          <Routes>
            <Route
              path="/ilogin/"
              element={<LoginForm isLogedIn={setIsLoged} />}
            />
            <Route
              path="/account/"
              element={<UpdateAccount isLogedIn={isLoged?.user} />}
            />
            {/* <Route path="/it/:id" element={<It user="" />} /> */}
            {/* <Route path="/finance/:id" element={<Finance />} />
            <Route path="/logistics/:id" element={<Logistic />} /> */}
            <Route
              path="/:id/menu/*"
              element={<Menus user={isLoged} check={checkLogged} />}
            />
            {isLoged != null && isLoged.cpd != null && (
              <Route
                path="/:id/menucpd/*"
                element={<MenusCpd user={isLoged} check={checkLogged} />}
              />
            )}
            {isLoged != null &&
              isLoged.cpd == null &&
              isLoged.department == null && (
                <Route
                  path="/:id/menuothers/*"
                  element={<MenuOthers user={isLoged} check={checkLogged} />}
                />
              )}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
