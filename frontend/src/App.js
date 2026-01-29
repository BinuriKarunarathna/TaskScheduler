import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import NewTaskPage from "./pages/NewTaskPage";
import ManageTasksPage from "./pages/ManageTasksPage";
import EditTaskPage from "./pages/EditTaskPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/tasks" element={<ManageTasksPage />} />
        <Route path="/tasks/new" element={<NewTaskPage />} />
        <Route path="/tasks/edit/:id" element={<EditTaskPage />} />
      </Routes>
    </Router>
  );
}

export default App;
