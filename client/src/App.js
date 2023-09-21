import LoginForm from "./first_login_form/LoginForm";
import It from "./it_dashboard/It";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="">
        <header className="">
          <Link to="/ilogin">Login</Link>
        </header>
        <Routes>
          <Route path="/ilogin/" element={<LoginForm />} />
          <Route path="/it/:id" element={<It />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
