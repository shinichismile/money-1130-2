import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import Layout from './components/Layout';
import Login from './pages/Login';
import WorkerDashboard from './pages/WorkerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import WithdrawalRequests from './pages/WithdrawalRequests';
import PointHistory from './pages/PointHistory';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import WorkerList from './pages/WorkerList';
import { useAuthStore } from './stores/authStore';

function App() {
  const { user, isAuthenticated } = useAuthStore();

  return (
    <>
      <Router>
        <Routes>
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/" /> : <Login />} 
          />
          
          {isAuthenticated ? (
            <Route element={<Layout />}>
              <Route 
                path="/" 
                element={
                  user?.role === 'admin' ? 
                    <Navigate to="/admin" /> : 
                    <WorkerDashboard />
                } 
              />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/withdrawals" element={<WithdrawalRequests />} />
              <Route path="/history" element={<PointHistory />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/profile" element={<Profile />} />
              {user?.role === 'admin' && (
                <Route path="/workers" element={<WorkerList />} />
              )}
            </Route>
          ) : (
            <Route path="*" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </Router>
      <Toaster position="top-right" expand={false} richColors />
    </>
  );
}

export default App;