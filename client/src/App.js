import Finance from "./finance/Finance";
import LoginForm from "./first_login_form/LoginForm";
import It from "./it_dashboard/It";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Logistic from "./logistics/Logistics";

function App() {
  return (
    <Router>
      <div className="">
        <header className="flex justify-between items-center px-8 text-lg bo border-2 h-16 mb-12">
          <Link to="/" className="text-2xl font-bold">AAHB</Link>
          <Link to="/ilogin">Login</Link>
        </header>
        <div className="container mx-auto">
        <Routes>
          <Route path="/ilogin/" element={<LoginForm />} />
          <Route path="/it/:id" element={<It user=''/>} />
          <Route path="/finance/:id" element={<Finance />} />
          <Route path="/logistics/:id" element={<Logistic />} />
        </Routes></div>
      </div>
    </Router>
  );
}

export default App;
