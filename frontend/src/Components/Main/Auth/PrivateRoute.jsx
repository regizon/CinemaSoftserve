import { Navigate } from 'react-router-dom';
import { isTokenValid, getUserRole } from './auth.js';

export default function PrivateRoute({ children }) {
  const accessToken = localStorage.getItem('access');
  getUserRole(accessToken)
  return isTokenValid(accessToken) ? children : <Navigate to="/login" replace />;
}