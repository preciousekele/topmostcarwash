import { useAuthStore } from '../../store/authStore';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import './Dashboard.css';
import Sidebar from '../../components/Sidebar/Sidebar';
import Home from './pages/Home/Home';
import UserManagement from './pages/UserManagement/UserManagement';
import TransactionDashboard from './pages/Transaction/TransactionDashboard';
import Savings from './pages/Savings/Savings';
import EntryPage from './pages/EntryPage/EntryPage';
import Company from './pages/Company/Company';
import Car from './pages/EntryPage/Car/Car';
import Jeep from './pages/EntryPage/Jeep/Jeep';
import PickUp from './pages/EntryPage/PickUp/PickUp';
import Bus from './pages/EntryPage/Bus/Bus';
import Rug from './pages/EntryPage/Rug/Rug';

const DashboardLayout = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main-content">
        <Outlet />
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<EntryPage />} />
        <Route path="overview" element={<EntryPage />} />
        <Route path="entry" element={< EntryPage/>} />
        <Route path="transactions" element={< TransactionDashboard/>} />
        <Route path="staffpayment" element={<UserManagement />} />
        <Route path="company" element={<Company />} />
         <Route path="savings" element={<Savings />} />
         <Route path="entry/car" element={<Car />} />
         <Route path="entry/jeep" element={<Jeep />} />
         <Route path="entry/pick-up" element={<PickUp />} />
         <Route path="entry/bus" element={<Bus />} />
         <Route path="entry/rug" element={<Rug />} />
      </Route>
    </Routes>
  );
};

export default Dashboard;
